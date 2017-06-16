/// <reference types="node" />

type SetType = {
  name: 'set',
  valueType: ValueType,
}
type ListType = {
  name: 'list',
  valueType: ValueType,
}
type MapType = {
  name: 'map',
  keyType: ValueType,
  valueType: ValueType,
}
type ValueType = string | SetType | ListType | MapType;
type ThriftType = 'int' | 'bool' | 'i16' | 'i32' | 'i64' | 'string';
type FieldOption = 'required' | 'optional';
type Field = {
  id: string,
  option: FieldOption,
  type: ThriftType,
  name: string,
};

type ArgOrExecption = {
  id: string,
  type: ValueType,
  name: string,
}

type Method = {
  type: ValueType,
  name: string,
  args: ArgOrExecption[],
  throws: ArgOrExecption[],
}

type Structs = {
  [name: string]: Field[],
}

type Unions = {
  [name: string]: Field[],
}

type Exceptions = {
  [name: string]: Field[],
}

type Services = {
  [serviceName: string]: {
    [methodName: string]: Method,
  },
}

type Namespaces = {
  [name: string]: {
    serviceName: string,
  }
}

type Includes = {
  [name: string]: {
    path: string,
  }
}

type TypeDefs = {
  [name: string]: {
    type: string,
  }
}

type StaticConst = {
  type: string,
  value: any,
}

type ListConst = {
  type: ListType,
  value: any,
}

type MapConst = {
  type: MapType,
  value: {
    key: any,
    value: any,
  }[],
}

type SetConst = {
  type: SetType,
  value: any,
}

type Consts = {
  [name: string]: StaticConst | ListConst | MapConst | SetConst,
}

type Enums = {
  [name: string]: {
    items: {
      name: string,
      value: string | number | boolean,
    }[]
  }
}

type JsonAST = {
  namespace?: Namespaces,
  typedef?: TypeDefs,
  include?: Includes,
  const?: Consts,
  enum?: Enums,
  struct?: Structs,
  union?: Unions,
  exception?: Exceptions,
  service?: Services,
};

declare module 'thrift-parser' {
  interface ThriftFileParsingError extends Error {
    messgae: string;
    name: 'THRIFT_FILE_PARSING_ERROR';
  }

  function parser (str: string | Buffer): JsonAST;

  export = parser;
}
