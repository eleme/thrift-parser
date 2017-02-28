class ThriftFileParsingError extends Error {
  constructor(message) {
    super(message);
    this.name = 'THRIFT_FILE_PARSING_ERROR';
  }
}

/**/ module.exports = (buffer, offset = 0) => {

buffer = new Buffer(buffer);

const reading = (transaction) => (...args) => {
  let beginning = offset;
  try {
    return transaction(...args);
  } catch (reason) {
    offset = beginning;
    throw reason;
  }
};

const readAnyOne = (...args) => {
  for (let transaction of args) {
    try {
      return transaction();
    } catch(error) {
      continue;
    }
  }
  throw new ThriftFileParsingError('Unexcepted Token');
};

const readUntilThrow = (transaction, key) => {
  let receiver = key ? {} : [];
  while (true) {
    try {
      let result = transaction();
      key ? receiver[result[key]] = result : receiver.push(result);
    } catch (reason) {
      return receiver;
    }
  }
};

const readString = reading((string) => {
  for (let i = 0; i < string.length; i++) {
    if (buffer[offset++] !== string.charCodeAt(i)) {
      throw new ThriftFileParsingError('readString(' + JSON.stringify(string) + ') Error');
    }
  }
  return string;
});

const readKeyword = (word) => {
  readString(word);
  readSpace();
  return word;
};

const readComment = () => readAnyOne(readCommentMultiple, readCommentSingle);

const readCommentMultiple = reading(() => {
  readString('/*');
  while (true) {
    if (buffer[offset++] === 42 && buffer[offset] === 47) {
      return offset++;
    }
  }
});

const readCommentSingle = reading(() => {
  readAnyOne(() => readString('#'), () => readString('//'));
  while (true) {
    let byte = buffer[offset++];
    if (byte === 10 || byte === 13) {
      return true;
    }
  }
});

const readSpace = reading(() => {
  while (true) {
    let byte = buffer[offset];
    if (byte === 13 || byte === 10 || byte === 32 || byte === 9) {
      offset++;
    } else {
      try {
        readComment();
      } catch(reason) {
        return true;
      }
    }
  }
});

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

const readTypeMap = reading(() => {
  let name = readName();
  readKeyword('<')
  let keyType = readType();
  readComma();
  let valueType = readType();
  readKeyword('>');
  return { name, keyType, valueType };
});

const readTypeList = reading(() => {
  let name = readName();
  readKeyword('<')
  let valueType = readType();
  readKeyword('>')
  return { name, valueType }
});

const readTypeNormal = () => readName();

const readName = reading(() => {
  let result = [];
  while (true) {
    let byte = buffer[offset];
    if (
      (byte >= 97 && byte <= 122) || // a-z
      (byte >= 65 && byte <= 90) || // A-Z
      (byte >= 48 && byte <= 57) || // 0-9
      byte === 95
    ) {
      offset++;
      result.push(byte);
    } else {
      if (result.length) {
        readSpace();
        return String.fromCharCode(...result);
      } else {
        throw void 0;
      }
    }
  }
});

const readNumberValue = reading(() => {
  let result = [];
  while (true) {
    let byte = buffer[offset]
    if ((byte >= 48 && byte <= 57) || byte === 45 || byte === 46) {
      offset++;
      result.push(byte);
    } else {
      if (result.length) {
        readSpace();
        return +String.fromCharCode(...result);
      } else {
        throw new ThriftFileParsingError('require a number');
      }
    }
  }
});

const readBooleanValue = () => JSON.parse(readAnyOne(() => readKeyword('true'), () => readKeyword('false')));

const readRefValue = reading(() => {
  let list = [ readName() ];
  readUntilThrow(reading(() => {
    readKeyword('.');
    let name = readName();
    list.push(name);
  }));
  return { '=': list };
});

const readStringValue = reading(() => {
  let receiver = [];
  let start;
  while(true) {
    let byte = buffer[offset++];
    if (receiver.length) {
      if (byte === start) { // " or '
        receiver.push(byte);
        readSpace();
        return new Function('return ' + String.fromCharCode(...receiver))();
      } else if (byte === 92) { // \
        receiver.push(byte);
        offset++;
        receiver.push(byte);
      } else {
        receiver.push(byte);
      }
    } else {
      if (byte === 34 || byte === 39) {
        start = byte;
        receiver.push(byte);
      } else {
        throw new ThriftFileParsingError('require a quote');
      }
    }
  }
});

const readListValue = reading(() => {
  readKeyword('[');
  let list = readUntilThrow(reading(() => {
    let value = readValue();
    readComma();
    return value;
  }));
  readKeyword(']');
  return list;
});

const readMapValue = reading(() => {
  readKeyword('{');
  let list = readUntilThrow(reading(() => {
    let key = readValue();
    readKeyword(':');
    let value = readValue();
    readComma();
    return { key, value };
  }));
  readKeyword('}');
  return list;
});

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
  return { subject, type, name, value };
};

const readEnum = () => {
  let subject = readKeyword('enum');
  let name = readName();
  let items = readEnumBlock();
  return { subject, name, items };
};

const readEnumBlock = () => {
  readKeyword('{');
  let receiver = readUntilThrow(readEnumItem);
  readKeyword('}');
  return receiver;
};

const readEnumItem = () => {
  let name = readName();
  let value = readAssign();
  readComma();
  return { name, value };
};

const readAssign = () => {
  try {
    readKeyword('=');
    return readValue();
  } catch (error) {}
};

const readStruct = () => {
  let subject = readKeyword('struct');
  let name = readName();
  let items = readStructBlock();
  return { subject, name, items };
};

const readStructBlock = () => {
  readKeyword('{');
  let receiver = readUntilThrow(readStructItem);
  readKeyword('}');
  return receiver;
};

const readStructItem = () => {
  let id = readNumberValue();
  readKeyword(':');
  let option;
  try { option = readOption(); } catch (reason) {}
  let type = readType();
  let name = readName();
  let defaultValue = readAssign();
  readComma();
  let result = { id, type, name };
  if (option !== void 0) result.option = option;
  if (defaultValue !== void 0) result.defaultValue = defaultValue;
  return result;
};

const readOption = () => {
  return readAnyOne(() => readKeyword('required'), () => readKeyword('optional'));
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
  let name = readName();
  let serviceName = readName().concat(...readUntilThrow(reading(() => readString('.') + readName())));
  return { subject, name, serviceName }; 
};

const readServiceBlock = () => {
  readKeyword('{');
  let receiver = readUntilThrow(readServiceItem, 'name');
  readKeyword('}');
  return receiver;
};

const readServiceItem = () => {
  let oneway = false;
  try {
    readKeyword('oneway');
    oneway = true;
  } catch (error) { /* ignore */ }
  let type = readType();
  let name = readName();
  let args = readServiceArgs();
  let throws = readServiceThrow();
  readComma();
  return { type, name, args, throws, oneway };
};

const readServiceArgs = () => {
  readKeyword('(');
  let receiver = readUntilThrow(readStructItem);
  readKeyword(')');
  readSpace();
  return receiver;
};

const readServiceThrow = reading(() => {
  try {
    readKeyword('throws');
    return readServiceArgs();
  } catch (reason) {
    return [];
  }
});

const readSubject = () => {
  return readAnyOne(readTypedef, readConst, readEnum, readStruct, readException, readService, readNamespace);
};

const readThrift = (() => {
  readSpace();
  let storage = {};
  while (true) {
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
    } catch (error) {
      if (buffer.length === offset) break;
      console.error(`[31m${buffer.slice(offset, offset + 50)}[0m`);
      throw error;
    }
  }
  return storage;
});

return readThrift();

/**/ };
