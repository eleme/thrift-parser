'use strict';

const expect = require('expect');

const thriftParser = require('../');

describe('consts', function() {

  it('parses a simple const', function(done) {
    const content = `
      const string test = 'hello world'
    `;

    const expected = {
      const: {
        test: {
          type: 'string',
          value: 'hello world'
        }
      }
    };

    const ast = thriftParser(content);

    expect(ast).toEqual(expected);
    done();
  });

  it('does not parse a const without assignment', function(done) {
    const content = `
      const string test
    `;

    expect(() => thriftParser(content)).toThrow();
    done();
  });

  it('parses a const as a number for number types', function(done) {
    const content = `
      const i32 test = 123
    `;

    const expected = {
      const: {
        test: {
          type: 'i32',
          value: 123
        }
      }
    };

    const ast = thriftParser(content);

    expect(ast).toEqual(expected);
    done();
  });

  it('parses a const with a hex value as a number', function(done) {
    const content = `
      const i16 testSmall = 0x7fff
      const i32 testLarge = 0x7fffffff
    `;

    const expected = {
      const: {
        testSmall: {
          type: 'i16',
          value: 32767
        },
        testLarge: {
          type: 'i32',
          value: 2147483647
        }
      }
    };

    const ast = thriftParser(content);

    expect(ast).toEqual(expected);
    done();
  });

  it('parses a const with an e-notation value as a number', function(done) {
    const content = `
      const i16 testSmall = -3e4
      const i32 testLarge = 2.147483647e9
    `;

    const expected = {
      const: {
        testSmall: {
          type: 'i16',
          value: -30000
        },
        testLarge: {
          type: 'i32',
          value: 2147483647
        }
      }
    };

    const ast = thriftParser(content);

    expect(ast).toEqual(expected);
    done();
  });

  it('parses a const as a boolean for boolean types', function(done) {
    const content = `
      const bool testTrue = true
      const bool testFalse = false
    `;

    const expected = {
      const: {
        testTrue: {
          type: 'bool',
          value: true
        },
        testFalse: {
          type: 'bool',
          value: false
        }
      }
    };

    const ast = thriftParser(content);

    expect(ast).toEqual(expected);
    done();
  });

  it('parses a const that ends in `,` (ListSeparator)', function(done) {
    const content = `
      const string test = 'hello world',
    `;

    const expected = {
      const: {
        test: {
          type: 'string',
          value: 'hello world'
        }
      }
    };

    const ast = thriftParser(content);

    expect(ast).toEqual(expected);
    done();
  });

  it('parses a const that ends in `;` (ListSeparator)', function(done) {
    const content = `
      const string test = 'hello world';
    `;

    const expected = {
      const: {
        test: {
          type: 'string',
          value: 'hello world'
        }
      }
    };

    const ast = thriftParser(content);

    expect(ast).toEqual(expected);
    done();
  });

  it('parses a const with a value wrapped in double-quotes', function(done) {
    const content = `
      const string test = "hello world"
    `;

    const expected = {
      const: {
        test: {
          type: 'string',
          value: 'hello world'
        }
      }
    };

    const ast = thriftParser(content);

    expect(ast).toEqual(expected);
    done();
  });

  it('does not parse a const with a value wrapped in mixed-quotes', function(done) {
    const content = `
      const string test = "hello world'
    `;

    expect(() => thriftParser(content)).toThrow();
    done();
  });

  it('parses a const as an array of objects for Map types', function(done) {
    const content = `
      const map<i32, string> test = { 1: 'a', 2: 'b', 3: 'c' }
    `;

    const expected = {
      const: {
        test: {
          type: {
            name: 'map',
            keyType: 'i32',
            valueType: 'string'
          },
          value: [
            {
              key: 1,
              value: 'a'
            },
            {
              key: 2,
              value: 'b'
            },
            {
              key: 3,
              value: 'c'
            }
          ]
        }
      }
    };

    const ast = thriftParser(content);

    expect(ast).toEqual(expected);
    done();
  });

  it('parses a const for Map type with `;` separator (ListSeparator)', function(done) {
    const content = `
      const map<i32, string> test = { 1: 'a'; 2: 'b'; 3: 'c' }
    `;

    const expected = {
      const: {
        test: {
          type: {
            name: 'map',
            keyType: 'i32',
            valueType: 'string'
          },
          value: [
            {
              key: 1,
              value: 'a'
            },
            {
              key: 2,
              value: 'b'
            },
            {
              key: 3,
              value: 'c'
            }
          ]
        }
      }
    };

    const ast = thriftParser(content);

    expect(ast).toEqual(expected);
    done();
  });

  it('does not parse an invalid Map type', function(done) {
    const content = `
      const map<i32> test = { 1: 'a', 2: 'b', 3: 'c' }
    `;

    expect(() => thriftParser(content)).toThrow();
    done();
  });

  it('does not parse an invalid Map value', function(done) {
    const content = `
      const map<i32, string> test = [ 1, 2, 3]
    `;

    expect(() => thriftParser(content)).toThrow();
    done();
  });

  it('parses a const as an array for Set types', function(done) {
    const content = `
      const set<i32> test = [ 1, 2, 3 ]
    `;

    const expected = {
      const: {
        test: {
          type: {
            name: 'set',
            valueType: 'i32'
          },
          value: [1, 2, 3]
        }
      }
    };

    const ast = thriftParser(content);

    expect(ast).toEqual(expected);
    done();
  });

  it('parses a const for Set type with `;` separator (ListSeparator)', function(done) {
    const content = `
      const set<i32> test = [ 1; 2; 3 ]
    `;

    const expected = {
      const: {
        test: {
          type: {
            name: 'set',
            valueType: 'i32'
          },
          value: [1, 2, 3]
        }
      }
    };

    const ast = thriftParser(content);

    expect(ast).toEqual(expected);
    done();
  });

  it('does not parse an invalid Set type', function(done) {
    const content = `
      const set<i32, string> test = [ 1, 2, 3 ]
    `;

    expect(() => thriftParser(content)).toThrow();
    done();
  });

  it('does not parse an invalid Set value', function(done) {
    const content = `
      const set<i32> test = { 1: 'a', 2: 'b', 3: 'c' }
    `;

    expect(() => thriftParser(content)).toThrow();
    done();
  });

  it('parses a const as an array for List types', function(done) {
    const content = `
      const list<i32> test = [ 1, 2, 3 ]
    `;

    const expected = {
      const: {
        test: {
          type: {
            name: 'list',
            valueType: 'i32'
          },
          value: [1, 2, 3]
        }
      }
    };

    const ast = thriftParser(content);

    expect(ast).toEqual(expected);
    done();
  });

  it('parses a const for List type with `;` separator (ListSeparator)', function(done) {
    const content = `
      const list<i32> test = [ 1; 2; 3 ]
    `;

    const expected = {
      const: {
        test: {
          type: {
            name: 'list',
            valueType: 'i32'
          },
          value: [1, 2, 3]
        }
      }
    };

    const ast = thriftParser(content);

    expect(ast).toEqual(expected);
    done();
  });

  it('does not parse an invalid List type', function(done) {
    const content = `
      const list<i32, string> test = [ 1, 2, 3 ]
    `;

    expect(() => thriftParser(content)).toThrow();
    done();
  });

  it('does not parse an invalid List value', function(done) {
    const content = `
      const list<i32> test = { 1: 'a', 2: 'b', 3: 'c' }
    `;

    expect(() => thriftParser(content)).toThrow();
    done();
  });
});
