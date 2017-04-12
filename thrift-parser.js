class ThriftFileParsingError extends Error {
  constructor(message) {
    super(message);
    this.name = 'THRIFT_FILE_PARSING_ERROR';
  }
}

module.exports = (buffer, offset = 0) => {

  buffer = new Buffer(buffer);

  const readAnyOne = (...args) => {
    let beginning = offset;
    for (let i = 0; i < args.length; i++) {
      try {
        return args[i]();
      } catch (ignore) {
        offset = beginning;
        continue;
      }
    }
    offset = beginning;
    throw 'Unexcepted Token';
  };

  const readUntilThrow = (transaction, key) => {
    let receiver = key ? {} : [];
    let beginning;
    for (;;) {
      try {
        beginning = offset;
        let result = transaction();
        key ? receiver[result[key]] = result : receiver.push(result);
      } catch (ignore) {
        offset = beginning;
        return receiver;
      }
    }
  };

  const readKeyword = word => {
    for (let i = 0; i < word.length; i++) {
      if (buffer[offset + i] !== word.charCodeAt(i)) {
        throw 'Unexpected token "' + word + '"';
      }
    }
    offset += word.length;
    readSpace();
    return word;
  };

  const readCharCode = code => {
    if (buffer[offset] !== code) throw 'Unexpected charCode';
    offset++;
    readSpace();
    return code;
  };

  const readNoop = () => {};

  const readCommentMultiple = () => {
    let i = 0;
    if (buffer[offset + i++] !== 47 || buffer[offset + i++] !== 42) return false;
    do {
      while (offset + i < buffer.length && buffer[offset + i++] !== 42);
    } while (offset + i < buffer.length && buffer[offset + i] !== 47);
    offset += i + 1;
    return true;
  };

  const readCommentSharp = () => {
    let i = 0;
    if (buffer[offset + i++] !== 35) return false;
    while (buffer[offset + i] !== 10 && buffer[offset + i] !== 13) offset++;
    offset += i;
    return true;
  };

  const readCommentDoubleSlash = () => {
    let i = 0;
    if (buffer[offset + i++] !== 47 || buffer[offset + i++] !== 47) return false;
    while (buffer[offset + i] !== 10 && buffer[offset + i] !== 13) offset++;
    offset += i;
    return true;
  };

  const readSpace = () => {
    for (;;) {
      let byte = buffer[offset];
      if (byte === 13 || byte === 10 || byte === 32 || byte === 9) {
        offset++;
      } else {
        if (!readCommentMultiple() && !readCommentSharp() && !readCommentDoubleSlash()) return;
      }
    }
  };

  const readComma = () => {
    if (buffer[offset] === 44 || buffer[offset] === 59) { // , or ;
      offset++;
      readSpace();
      return ',';
    }
  };

  const readTypedef = () => {
    let subject = readKeyword('typedef');
    let type = readType();
    let name = readName();
    return { subject, type, name };
  };

  const readType = () => readAnyOne(readTypeMap, readTypeList, readTypeNormal);

  const readTypeMap = () => {
    let name = readName();
    readCharCode(60); // <
    let keyType = readType();
    readComma();
    let valueType = readType();
    readCharCode(62); // >
    return { name, keyType, valueType };
  };

  const readTypeList = () => {
    let name = readName();
    readCharCode(60); // <
    let valueType = readType();
    readCharCode(62); // >
    return { name, valueType };
  };

  const readTypeNormal = () => readName();

  const readName = () => {
    let i = 0;
    let result = [];
    let byte = buffer[offset];
    while (
      (byte >= 97 && byte <= 122) || // a-z
      byte === 95 ||                 // _
      (byte >= 65 && byte <= 90) ||  // A-Z
      (byte >= 48 && byte <= 57)     // 0-9
    ) byte = buffer[offset + ++i];
    if (i === 0) throw 'Unexpected token';
    let value = buffer.toString('utf8', offset, offset += i);
    readSpace();
    return value;
  };

  const readScope = () => {
    let i = 0;
    let result = [];
    let byte = buffer[offset];
    while (
      (byte >= 97 && byte <= 122) || // a-z
      byte === 95 ||                 // _
      (byte >= 65 && byte <= 90) ||  // A-Z
      (byte >= 48 && byte <= 57) ||  // 0-9
      (byte === 42)                  // *
    ) byte = buffer[offset + ++i];
    if (i === 0) throw 'Unexpected token';
    let value = buffer.toString('utf8', offset, offset += i);
    readSpace();
    return value;
  };

  const readNumberValue = () => {
    let result = [];
    for (;;) {
      let byte = buffer[offset];
      if ((byte >= 48 && byte <= 57) || byte === 45 || byte === 46) {
        offset++;
        result.push(byte);
      } else {
        if (result.length) {
          readSpace();
          return +String.fromCharCode(...result);
        } else {
          throw 'Unexpected token ' + String.fromCharCode(byte);
        }
      }
    }
  };

  const readBooleanValue = () => JSON.parse(readAnyOne(() => readKeyword('true'), () => readKeyword('false')));

  const readRefValue = () => {
    let list = [ readName() ];
    readUntilThrow(() => {
      readCharCode(46); // .
      list.push(readName());
    });
    return { '=': list };
  };

  const readStringValue = () => {
    let receiver = [];
    let start;
    for (;;) {
      let byte = buffer[offset++];
      if (receiver.length) {
        if (byte === start) { // " or '
          receiver.push(byte);
          readSpace();
          return new Function('return ' + String.fromCharCode(...receiver))();
        } else if (byte === 92) { // \
          receiver.push(byte);
          offset++;
          receiver.push(buffer[offset++]);
        } else {
          receiver.push(byte);
        }
      } else {
        if (byte === 34 || byte === 39) {
          start = byte;
          receiver.push(byte);
        } else {
          throw 'Unexpected token ILLEGAL';
        }
      }
    }
  };

  const readListValue = () => {
    readCharCode(91); // [
    let list = readUntilThrow(() => {
      let value = readValue();
      readComma();
      return value;
    });
    readCharCode(93); // ]
    return list;
  };

  const readMapValue = () => {
    readCharCode(123); // {
    let list = readUntilThrow(() => {
      let key = readValue();
      readCharCode(58); // :
      let value = readValue();
      readComma();
      return { key, value };
    });
    readCharCode(125); // }
    return list;
  };

  const readValue = () => readAnyOne(
    readNumberValue,
    readStringValue,
    readBooleanValue,
    readListValue,
    readMapValue,
    readRefValue
  );

  const readConst = () => {
    let subject = readKeyword('const');
    let type = readType();
    let name = readName();
    let value = readAssign();
    readComma();
    return { subject, type, name, value };
  };

  const readEnum = () => {
    let subject = readKeyword('enum');
    let name = readName();
    let items = readEnumBlock();
    return { subject, name, items };
  };

  const readEnumBlock = () => {
    readCharCode(123); // {
    let receiver = readUntilThrow(readEnumItem);
    readCharCode(125); // }
    return receiver;
  };

  const readEnumItem = () => {
    let name = readName();
    let value = readAssign();
    readComma();
    return { name, value };
  };

  const readAssign = () => {
    let beginning = offset;
    try {
      readCharCode(61); // =
      return readValue();
    } catch (ignore) {
      offset = beginning;
    }
  };

  const readStruct = () => {
    let subject = readKeyword('struct');
    let name = readName();
    let items = readStructBlock();
    return { subject, name, items };
  };

  const readStructBlock = () => {
    readCharCode(123); // {
    let receiver = readUntilThrow(readStructItem);
    readCharCode(125); // }
    return receiver;
  };

  const readStructItem = () => {
    let id = readNumberValue();
    readCharCode(58); // :
    let option = readAnyOne(() => readKeyword('required'), () => readKeyword('optional'), readNoop);
    let type = readType();
    let name = readName();
    let defaultValue = readAssign();
    readComma();
    let result = { id, type, name };
    if (option !== void 0) result.option = option;
    if (defaultValue !== void 0) result.defaultValue = defaultValue;
    return result;
  };

  const readException = () => {
    let subject = readKeyword('exception');
    let name = readName();
    let items = readStructBlock();
    return { subject, name, items };
  };

  const readService = () => {
    let subject = readKeyword('service');
    let name = readName();
    let items = readServiceBlock();
    return { subject, name, items }; 
  };

  const readNamespace = () => {
    let subject = readKeyword('namespace');
    let name = readScope();
    let serviceName = readRefValue()['='].join('.');
    return { subject, name, serviceName };
  };

  const readServiceBlock = () => {
    readCharCode(123); // {
    let receiver = readUntilThrow(readServiceItem, 'name');
    readCharCode(125); // }
    return receiver;
  };

  const readOneway = () => readKeyword('oneway');

  const readServiceItem = () => {
    let oneway = !!readAnyOne(readOneway, readNoop);
    let type = readType();
    let name = readName();
    let args = readServiceArgs();
    let throws = readServiceThrow();
    readComma();
    return { type, name, args, throws, oneway };
  };

  const readServiceArgs = () => {
    readCharCode(40); // (
    let receiver = readUntilThrow(readStructItem);
    readCharCode(41); // )
    readSpace();
    return receiver;
  };

  const readServiceThrow = () => {
    let beginning = offset;
    try {
      readKeyword('throws');
      return readServiceArgs();
    } catch (ignore) {
      offset = beginning;
      return [];
    }
  };

  const readSubject = () => {
    return readAnyOne(readTypedef, readConst, readEnum, readStruct, readException, readService, readNamespace);
  };

  const readThrift = () => {
    readSpace();
    let storage = {};
    for (;;) {
      try {
        let block = readSubject();
        let { subject, name } = block;
        if (!storage[subject]) storage[subject] = {};
        delete block.subject;
        delete block.name;
        switch (subject) {
          case 'exception':
          case 'service':
          case 'struct':
            storage[subject][name] = block.items;
            break;
          default:
            storage[subject][name] = block;
        }
      } catch (message) {
        console.error(`[31m${buffer.slice(offset, offset + 50)}[0m`); // eslint-disable-line
        throw new ThriftFileParsingError(message);
      } finally {
        if (buffer.length === offset) break;
      }
    }
    return storage;
  };

  return readThrift();

};
