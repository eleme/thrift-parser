'use strict';

const expect = require('expect');

const thriftParser = require('../');

describe('services', function() {

  it('parses a basic service', function(done) {
    const content = `
      service Test {
        bool test()
      }
    `;

    const expected = {
      service: {
        Test: {
          functions: {
            test: {
              args: [],
              name: 'test',
              oneway: false,
              throws: [],
              type: 'bool'
            }
          }
        }
      }
    };

    const ast = thriftParser(content);

    expect(ast).toEqual(expected);
    done();
  });

  it('parses a service containing a function with void type', function(done) {
    const content = `
      service Test {
        void test()
      }
    `;

    const expected = {
      service: {
        Test: {
          functions: {
            test: {
              args: [],
              name: 'test',
              oneway: false,
              throws: [],
              type: 'void'
            }
          }
        }
      }
    };

    const ast = thriftParser(content);

    expect(ast).toEqual(expected);
    done();
  });

  it('parses a service containing a function with custom type', function(done) {
    const content = `
      service Test {
        TestType test()
      }
    `;

    const expected = {
      service: {
        Test: {
          functions: {
            test: {
              args: [],
              name: 'test',
              oneway: false,
              throws: [],
              type: 'TestType'
            }
          }
        }
      }
    };

    const ast = thriftParser(content);

    expect(ast).toEqual(expected);
    done();
  });

  it('parses a service containing a function with Map type', function(done) {
    const content = `
      service Test {
        map<i16, string> test()
      }
    `;

    const expected = {
      service: {
        Test: {
          functions: {
            test: {
              args: [],
              name: 'test',
              oneway: false,
              throws: [],
              type: {
                name: 'map',
                keyType: 'i16',
                valueType: 'string'
              }
            }
          }
        }
      }
    };

    const ast = thriftParser(content);

    expect(ast).toEqual(expected);
    done();
  });

  it.skip('does not parse a service containing a function with invalid Map type', function(done) {
    const content = `
      service Test {
        map<i16> test()
      }
    `;

    expect(() => thriftParser(content)).toThrow();
    done();
  });

  it('parses a service containing a function with Set type', function(done) {
    const content = `
      service Test {
        set<i16> test()
      }
    `;

    const expected = {
      service: {
        Test: {
          functions: {
            test: {
              args: [],
              name: 'test',
              oneway: false,
              throws: [],
              type: {
                name: 'set',
                valueType: 'i16'
              }
            }
          }
        }
      }
    };

    const ast = thriftParser(content);

    expect(ast).toEqual(expected);
    done();
  });

  it.skip('does not parse a service containing a function with invalid Set type', function(done) {
    const content = `
      service Test {
        set<i16, string> test()
      }
    `;

    expect(() => thriftParser(content)).toThrow();
    done();
  });

  it('parses a service containing a function with List type', function(done) {
    const content = `
      service Test {
        list<i16> test()
      }
    `;

    const expected = {
      service: {
        Test: {
          functions: {
            test: {
              args: [],
              name: 'test',
              oneway: false,
              throws: [],
              type: {
                name: 'list',
                valueType: 'i16'
              }
            }
          }
        }
      }
    };

    const ast = thriftParser(content);

    expect(ast).toEqual(expected);
    done();
  });

  it.skip('does not parse a service containing a function with invalid List type', function(done) {
    const content = `
      service Test {
        list<i16, string> test()
      }
    `;

    expect(() => thriftParser(content)).toThrow();
    done();
  });

  it('parses a service containing a function with nested Map/Set/List type', function(done) {
    const content = `
      service Test {
        list<set<map<string, string>>> test()
      }
    `;

    const expected = {
      service: {
        Test: {
          functions: {
            test: {
              args: [],
              name: 'test',
              oneway: false,
              throws: [],
              type: {
                name: 'list',
                valueType: {
                  name: 'set',
                  valueType: {
                    name: 'map',
                    keyType: 'string',
                    valueType: 'string'
                  }
                }
              }
            }
          }
        }
      }
    };

    const ast = thriftParser(content);

    expect(ast).toEqual(expected);
    done();
  });

  it('parses a service containing a function with `oneway`', function(done) {
    const content = `
      service Test {
        oneway void test()
      }
    `;

    const expected = {
      service: {
        Test: {
          functions: {
            test: {
              args: [],
              name: 'test',
              oneway: true,
              throws: [],
              type: 'void'
            }
          }
        }
      }
    };

    const ast = thriftParser(content);

    expect(ast).toEqual(expected);
    done();
  });

  it.skip('does not parse a service containing a function with `oneway` but not void type', function(done) {
    const content = `
      service Test {
        oneway bool test()
      }
    `;

    expect(() => thriftParser(content)).toThrow();
    done();
  });

  it('parses a service containing functions that end in `,` (ListSeparator)', function(done) {
    const content = `
      service Test {
        void test1(),
        void test2(),
      }
    `;

    const expected = {
      service: {
        Test: {
          functions: {
            test1: {
              args: [],
              name: 'test1',
              oneway: false,
              throws: [],
              type: 'void'
            },
            test2: {
              args: [],
              name: 'test2',
              oneway: false,
              throws: [],
              type: 'void'
            }
          }
        }
      }
    };

    const ast = thriftParser(content);

    expect(ast).toEqual(expected);
    done();
  });

  it('parses a service containing functions that end in `;` (ListSeparator)', function(done) {
    const content = `
      service Test {
        void test1();
        void test2();
      }
    `;

    const expected = {
      service: {
        Test: {
          functions: {
            test1: {
              args: [],
              name: 'test1',
              oneway: false,
              throws: [],
              type: 'void'
            },
            test2: {
              args: [],
              name: 'test2',
              oneway: false,
              throws: [],
              type: 'void'
            }
          }
        }
      }
    };

    const ast = thriftParser(content);

    expect(ast).toEqual(expected);
    done();
  });

  it('parses a service containing functions that end in mixed `,` and `;` (ListSeparator)', function(done) {
    const content = `
      service Test {
        void test1();
        void test2(),
      }
    `;

    const expected = {
      service: {
        Test: {
          functions: {
            test1: {
              args: [],
              name: 'test1',
              oneway: false,
              throws: [],
              type: 'void'
            },
            test2: {
              args: [],
              name: 'test2',
              oneway: false,
              throws: [],
              type: 'void'
            }
          }
        }
      }
    };

    const ast = thriftParser(content);

    expect(ast).toEqual(expected);
    done();
  });

  it('parses a service with extends', function(done) {
    const content = `
      service Test2 extends Test1 {
      }
    `;

    const expected = {
      service: {
        Test2: {
          extends: 'Test1',
          functions: {}
        }
      }
    };

    const ast = thriftParser(content);

    expect(ast).toEqual(expected);
    done();
  });

  it('parses a service that starts with `_` (Identifier)', function(done) {
    const content = `
      service _Test {
        void test()
      }
    `;

    const expected = {
      service: {
        _Test: {
          functions: {
            test: {
              args: [],
              name: 'test',
              oneway: false,
              throws: [],
              type: 'void'
            }
          }
        }
      }
    };

    const ast = thriftParser(content);

    expect(ast).toEqual(expected);
    done();
  });

  it('parses a service containing `_` (Identifier)', function(done) {
    const content = `
      service Te_st {
        void test()
      }
    `;

    const expected = {
      service: {
        Te_st: {
          functions: {
            test: {
              args: [],
              name: 'test',
              oneway: false,
              throws: [],
              type: 'void'
            }
          }
        }
      }
    };

    const ast = thriftParser(content);

    expect(ast).toEqual(expected);
    done();
  });

  it('parses a service containing `.` (Identifier)', function(done) {
    const content = `
      service Te.st {
        void test()
      }
    `;

    const expected = {
      service: {
        'Te.st': {
          functions: {
            test: {
              args: [],
              name: 'test',
              oneway: false,
              throws: [],
              type: 'void'
            }
          }
        }
      }
    };

    const ast = thriftParser(content);

    expect(ast).toEqual(expected);
    done();
  });

  it('parses a service containing `.`, `_`, letters and numbers (Identifier)', function(done) {
    const content = `
      service Te.st_123 {
        void test()
      }
    `;

    const expected = {
      service: {
        'Te.st_123': {
          functions: {
            test: {
              args: [],
              name: 'test',
              oneway: false,
              throws: [],
              type: 'void'
            }
          }
        }
      }
    };

    const ast = thriftParser(content);

    expect(ast).toEqual(expected);
    done();
  });

  it('parses a service containing a function that starts with `_` (Identifier)', function(done) {
    const content = `
      service Test {
        void _test()
      }
    `;

    const expected = {
      service: {
        Test: {
          functions: {
            _test: {
              args: [],
              name: '_test',
              oneway: false,
              throws: [],
              type: 'void'
            }
          }
        }
      }
    };

    const ast = thriftParser(content);

    expect(ast).toEqual(expected);
    done();
  });

  it('parses a service containing a function containing `_` (Identifier)', function(done) {
    const content = `
      service Test {
        void te_st()
      }
    `;

    const expected = {
      service: {
        Test: {
          functions: {
            te_st: {
              args: [],
              name: 'te_st',
              oneway: false,
              throws: [],
              type: 'void'
            }
          }
        }
      }
    };

    const ast = thriftParser(content);

    expect(ast).toEqual(expected);
    done();
  });

  it('parses a service containing a function containing `.` (Identifier)', function(done) {
    const content = `
      service Test {
        void te.st()
      }
    `;

    const expected = {
      service: {
        Test: {
          functions: {
            'te.st': {
              args: [],
              name: 'te.st',
              oneway: false,
              throws: [],
              type: 'void'
            }
          }
        }
      }
    };

    const ast = thriftParser(content);

    expect(ast).toEqual(expected);
    done();
  });

  it('parses a service containing a function containing `.`, `_`, letters and numbers (Identifier)', function(done) {
    const content = `
      service Test {
        void te.st_123()
      }
    `;

    const expected = {
      service: {
        Test: {
          functions: {
            'te.st_123': {
              args: [],
              name: 'te.st_123',
              oneway: false,
              throws: [],
              type: 'void'
            }
          }
        }
      }
    };

    const ast = thriftParser(content);

    expect(ast).toEqual(expected);
    done();
  });

  it('does not parse a service containing a function without a type', function(done) {
    const content = `
      service Test {
        test()
      }
    `;

    expect(() => thriftParser(content)).toThrow();
    done();
  });

  it('does not parse a service containing a function without parens', function(done) {
    const content = `
      service Test {
        void test
      }
    `;

    expect(() => thriftParser(content)).toThrow();
    done();
  });

  it('does not parse a service containing a function without closing paren', function(done) {
    const content = `
      service Test {
        void test(
      }
    `;

    expect(() => thriftParser(content)).toThrow();
    done();
  });

  it('does not parse a service containing a function without opening paren', function(done) {
    const content = `
      service Test {
        void test)
      }
    `;

    expect(() => thriftParser(content)).toThrow();
    done();
  });

  it('parses a service containing a function with a lot of whitespace between parens', function(done) {
    const content = `
      service Test {
        void test(    )
      }
    `;

    const expected = {
      service: {
        Test: {
          functions: {
            test: {
              args: [],
              name: 'test',
              oneway: false,
              throws: [],
              type: 'void'
            }
          }
        }
      }
    };

    const ast = thriftParser(content);

    expect(ast).toEqual(expected);
    done();
  });

  it('does not parse a service containing throws with no parens', function(done) {
    const content = `
      service Test {
        void test() throws
      }
    `;

    expect(() => thriftParser(content)).toThrow();
    done();
  });

  it('does not parse a service containing throws with no opening paren', function(done) {
    const content = `
      service Test {
        void test() throws )
      }
    `;

    expect(() => thriftParser(content)).toThrow();
    done();
  });

  it('does not parse a service containing throws with no closing paren', function(done) {
    const content = `
      service Test {
        void test() throws (
      }
    `;

    expect(() => thriftParser(content)).toThrow();
    done();
  });

  it('parses a service containing a function with a lot of whitespace between throw parens', function(done) {
    const content = `
      service Test {
        void test() throws (     )
      }
    `;

    const expected = {
      service: {
        Test: {
          functions: {
            test: {
              args: [],
              name: 'test',
              oneway: false,
              throws: [],
              type: 'void'
            }
          }
        }
      }
    };

    const ast = thriftParser(content);

    expect(ast).toEqual(expected);
    done();
  });
});

describe('service function arguments', function() {

  it('parses a service containing a function with arguments', function(done) {
    const content = `
      service Test {
        void test(1: string test1, 2: bool test2)
      }
    `;

    const expected = {
      service: {
        Test: {
          functions: {
            test: {
              args: [
                {
                  id: 1,
                  name: 'test1',
                  type: 'string'
                },
                {
                  id: 2,
                  name: 'test2',
                  type: 'bool'
                }
              ],
              name: 'test',
              oneway: false,
              throws: [],
              type: 'void'
            }
          }
        }
      }
    };

    const ast = thriftParser(content);

    expect(ast).toEqual(expected);
    done();
  });

  it.skip('parses a service containing a function with arguments without FieldIDs', function(done) {
    const content = `
      service Test {
        void test(string test1, bool test2)
      }
    `;

    const expected = {
      service: {
        Test: {
          functions: {
            test: {
              args: [
                {
                  name: 'test1',
                  type: 'string'
                },
                {
                  name: 'test2',
                  type: 'bool'
                }
              ],
              name: 'test',
              oneway: false,
              throws: [],
              type: 'void'
            }
          }
        }
      }
    };

    const ast = thriftParser(content);

    expect(ast).toEqual(expected);
    done();
  });

  it.skip('parses a service containing a function with arguments with mixed FieldIDs', function(done) {
    const content = `
      service Test {
        void test(string test1, 1: bool test2)
      }
    `;

    const expected = {
      service: {
        Test: {
          functions: {
            test: {
              args: [
                {
                  name: 'test1',
                  type: 'string'
                },
                {
                  id: 1,
                  name: 'test2',
                  type: 'bool'
                }
              ],
              name: 'test',
              oneway: false,
              throws: [],
              type: 'void'
            }
          }
        }
      }
    };

    const ast = thriftParser(content);

    expect(ast).toEqual(expected);
    done();
  });

  it.skip('parses a service containing a function with arguments using hexadecimal FieldIDs', function(done) {
    const content = `
      service Test {
        void test(0x01: string test1)
      }
    `;

    const expected = {
      service: {
        Test: {
          functions: {
            test: {
              args: [
                {
                  id: 1,
                  name: 'test1',
                  type: 'string'
                }
              ],
              name: 'test',
              oneway: false,
              throws: [],
              type: 'void'
            }
          }
        }
      }
    };

    const ast = thriftParser(content);

    expect(ast).toEqual(expected);
    done();
  });

  it('parses a service containing a function argument with a negative FieldID', function(done) {
    const content = `
      service Test {
        void test(-1: string test1)
      }
    `;

    const expected = {
      service: {
        Test: {
          functions: {
            test: {
              args: [
                {
                  id: -1,
                  name: 'test1',
                  type: 'string'
                }
              ],
              name: 'test',
              oneway: false,
              throws: [],
              type: 'void'
            }
          }
        }
      }
    };

    const ast = thriftParser(content);

    expect(ast).toEqual(expected);
    done();
  });

  it.skip('parses a service containing a function argument with a positive FieldID with `+`', function(done) {
    const content = `
      service Test {
        void test(+1: string test1)
      }
    `;

    const expected = {
      service: {
        Test: {
          functions: {
            test: {
              args: [
                {
                  id: 1,
                  name: 'test1',
                  type: 'string'
                }
              ],
              name: 'test',
              oneway: false,
              throws: [],
              type: 'void'
            }
          }
        }
      }
    };

    const ast = thriftParser(content);

    expect(ast).toEqual(expected);
    done();
  });

  it.skip('does not parse a service containing a function with arguments using decimal FieldIDs', function(done) {
    const content = `
      service Test {
        void test(1.2: string test)
      }
    `;

    expect(() => thriftParser(content)).toThrow();
    done();
  });

  it('does not parse a service containing a function with arguments using e-notation FieldIDs', function(done) {
    const content = `
      service Test {
        void test(1e2: string test)
      }
    `;

    expect(() => thriftParser(content)).toThrow();
    done();
  });

  it('parses a service containing a function with required arguments', function(done) {
    const content = `
      service Test {
        void test(1: required string test)
      }
    `;

    const expected = {
      service: {
        Test: {
          functions: {
            test: {
              args: [
                {
                  id: 1,
                  name: 'test',
                  type: 'string',
                  option: 'required'
                }
              ],
              name: 'test',
              oneway: false,
              throws: [],
              type: 'void'
            }
          }
        }
      }
    };

    const ast = thriftParser(content);

    expect(ast).toEqual(expected);
    done();
  });

  it('parses a service containing a function with optional arguments', function(done) {
    const content = `
      service Test {
        void test(1: optional string test)
      }
    `;

    const expected = {
      service: {
        Test: {
          functions: {
            test: {
              args: [
                {
                  id: 1,
                  name: 'test',
                  type: 'string',
                  option: 'optional'
                }
              ],
              name: 'test',
              oneway: false,
              throws: [],
              type: 'void'
            }
          }
        }
      }
    };

    const ast = thriftParser(content);

    expect(ast).toEqual(expected);
    done();
  });

  it('parses a service containing a function with mixed option arguments', function(done) {
    const content = `
      service Test {
        void test(1: optional string test1, 2: string test2, 3: required string test3)
      }
    `;

    const expected = {
      service: {
        Test: {
          functions: {
            test: {
              args: [
                {
                  id: 1,
                  name: 'test1',
                  type: 'string',
                  option: 'optional'
                },
                {
                  id: 2,
                  name: 'test2',
                  type: 'string'
                },
                {
                  id: 3,
                  name: 'test3',
                  type: 'string',
                  option: 'required'
                }
              ],
              name: 'test',
              oneway: false,
              throws: [],
              type: 'void'
            }
          }
        }
      }
    };

    const ast = thriftParser(content);

    expect(ast).toEqual(expected);
    done();
  });

  it('parses a service containing arguments separated by `;` (ListSeparator)', function(done) {
    const content = `
      service Test {
        void test(1: string test1; 2: bool test2;)
      }
    `;

    const expected = {
      service: {
        Test: {
          functions: {
            test: {
              args: [
                {
                  id: 1,
                  name: 'test1',
                  type: 'string'
                },
                {
                  id: 2,
                  name: 'test2',
                  type: 'bool'
                }
              ],
              name: 'test',
              oneway: false,
              throws: [],
              type: 'void'
            }
          }
        }
      }
    };

    const ast = thriftParser(content);

    expect(ast).toEqual(expected);
    done();
  });

  it('parses a service containing arguments separated by mixed `,` and `;` (ListSeparator)', function(done) {
    const content = `
      service Test {
        void test(1: string test1; 2: bool test2,)
      }
    `;

    const expected = {
      service: {
        Test: {
          functions: {
            test: {
              args: [
                {
                  id: 1,
                  name: 'test1',
                  type: 'string'
                },
                {
                  id: 2,
                  name: 'test2',
                  type: 'bool'
                }
              ],
              name: 'test',
              oneway: false,
              throws: [],
              type: 'void'
            }
          }
        }
      }
    };

    const ast = thriftParser(content);

    expect(ast).toEqual(expected);
    done();
  });

  it('parses a service containing an argument that starts with `_` (Identifier)', function(done) {
    const content = `
      service Test {
        void test(1: string _test)
      }
    `;

    const expected = {
      service: {
        Test: {
          functions: {
            test: {
              args: [
                {
                  id: 1,
                  name: '_test',
                  type: 'string'
                }
              ],
              name: 'test',
              oneway: false,
              throws: [],
              type: 'void'
            }
          }
        }
      }
    };

    const ast = thriftParser(content);

    expect(ast).toEqual(expected);
    done();
  });

  it('parses a service containing an argument containing `_` (Identifier)', function(done) {
    const content = `
      service Test {
        void test(1: string te_st)
      }
    `;

    const expected = {
      service: {
        Test: {
          functions: {
            test: {
              args: [
                {
                  id: 1,
                  name: 'te_st',
                  type: 'string'
                }
              ],
              name: 'test',
              oneway: false,
              throws: [],
              type: 'void'
            }
          }
        }
      }
    };

    const ast = thriftParser(content);

    expect(ast).toEqual(expected);
    done();
  });

  it('parses a service containing an argument containing `.` (Identifier)', function(done) {
    const content = `
      service Test {
        void test(1: string te.st)
      }
    `;

    const expected = {
      service: {
        Test: {
          functions: {
            test: {
              args: [
                {
                  id: 1,
                  name: 'te.st',
                  type: 'string'
                }
              ],
              name: 'test',
              oneway: false,
              throws: [],
              type: 'void'
            }
          }
        }
      }
    };

    const ast = thriftParser(content);

    expect(ast).toEqual(expected);
    done();
  });

  it('parses a service containing an argument containing `.`, `_`, letters and numbers (Identifier)', function(done) {
    const content = `
      service Test {
        void test(1: string te.st_123)
      }
    `;

    const expected = {
      service: {
        Test: {
          functions: {
            test: {
              args: [
                {
                  id: 1,
                  name: 'te.st_123',
                  type: 'string'
                }
              ],
              name: 'test',
              oneway: false,
              throws: [],
              type: 'void'
            }
          }
        }
      }
    };

    const ast = thriftParser(content);

    expect(ast).toEqual(expected);
    done();
  });

  it('parses a service containing a function with whitespace around arguments', function(done) {
    const content = `
      service Test {
        void test(   1: string test   )
      }
    `;

    const expected = {
      service: {
        Test: {
          functions: {
            test: {
              args: [
                {
                  id: 1,
                  name: 'test',
                  type: 'string'
                }
              ],
              name: 'test',
              oneway: false,
              throws: [],
              type: 'void'
            }
          }
        }
      }
    };

    const ast = thriftParser(content);

    expect(ast).toEqual(expected);
    done();
  });

  it('parses a service containing a function with defaulted arguments', function(done) {
    const content = `
      service Test {
        void test(1: string test1 = 'test', 2: i16 test2 = 123)
      }
    `;

    const expected = {
      service: {
        Test: {
          functions: {
            test: {
              args: [
                {
                  id: 1,
                  name: 'test1',
                  type: 'string',
                  defaultValue: 'test'
                },
                {
                  id: 2,
                  name: 'test2',
                  type: 'i16',
                  defaultValue: 123
                }
              ],
              name: 'test',
              oneway: false,
              throws: [],
              type: 'void'
            }
          }
        }
      }
    };

    const ast = thriftParser(content);

    expect(ast).toEqual(expected);
    done();
  });
});

describe('service function throws', function() {

  it('parses a service containing a function with throws', function(done) {
    const content = `
      service Test {
        void test() throws (1: TestException1 test1, 2: TestException2 test2)
      }
    `;

    const expected = {
      service: {
        Test: {
          functions: {
            test: {
              args: [],
              name: 'test',
              oneway: false,
              throws: [
                {
                  id: 1,
                  name: 'test1',
                  type: 'TestException1'
                },
                {
                  id: 2,
                  name: 'test2',
                  type: 'TestException2'
                }
              ],
              type: 'void'
            }
          }
        }
      }
    };

    const ast = thriftParser(content);

    expect(ast).toEqual(expected);
    done();
  });

  it.skip('parses a service containing a function with throws without FieldIDs', function(done) {
    const content = `
      service Test {
        void test() throws (TestException1 test1, TestException2 test2)
      }
    `;

    const expected = {
      service: {
        Test: {
          functions: {
            test: {
              args: [],
              name: 'test',
              oneway: false,
              throws: [
                {
                  name: 'test1',
                  type: 'TestException1'
                },
                {
                  name: 'test2',
                  type: 'TestException2'
                }
              ],
              type: 'void'
            }
          }
        }
      }
    };

    const ast = thriftParser(content);

    expect(ast).toEqual(expected);
    done();
  });

  it.skip('parses a service containing a function with throws with mixed FieldIDs', function(done) {
    const content = `
      service Test {
        void test() throws (TestException1 test1, 1: TestException2 test2)
      }
    `;

    const expected = {
      service: {
        Test: {
          functions: {
            test: {
              args: [],
              name: 'test',
              oneway: false,
              throws: [
                {
                  name: 'test1',
                  type: 'TestException1'
                },
                {
                  id: 1,
                  name: 'test2',
                  type: 'TestException2'
                }
              ],
              type: 'void'
            }
          }
        }
      }
    };

    const ast = thriftParser(content);

    expect(ast).toEqual(expected);
    done();
  });

  it.skip('parses a service containing a function with throws using hexadecimal FieldIDs', function(done) {
    const content = `
      service Test {
        void test() throws (0x01: string test1)
      }
    `;

    const expected = {
      service: {
        Test: {
          functions: {
            test: {
              args: [],
              name: 'test',
              oneway: false,
              throws: [
                {
                  id: 1,
                  name: 'test1',
                  type: 'string'
                }
              ],
              type: 'void'
            }
          }
        }
      }
    };

    const ast = thriftParser(content);

    expect(ast).toEqual(expected);
    done();
  });

  it('parses a service containing a function with throws using a negative FieldID', function(done) {
    const content = `
      service Test {
        void test() throws (-1: string test1)
      }
    `;

    const expected = {
      service: {
        Test: {
          functions: {
            test: {
              args: [],
              name: 'test',
              oneway: false,
              throws: [
                {
                  id: -1,
                  name: 'test1',
                  type: 'string'
                }
              ],
              type: 'void'
            }
          }
        }
      }
    };

    const ast = thriftParser(content);

    expect(ast).toEqual(expected);
    done();
  });

  it.skip('parses a service containing a function with throws using a positive FieldID with `+`', function(done) {
    const content = `
      service Test {
        void test() throws (+1: string test1)
      }
    `;

    const expected = {
      service: {
        Test: {
          functions: {
            test: {
              args: [],
              name: 'test',
              oneway: false,
              throws: [
                {
                  id: 1,
                  name: 'test1',
                  type: 'string'
                }
              ],
              type: 'void'
            }
          }
        }
      }
    };

    const ast = thriftParser(content);

    expect(ast).toEqual(expected);
    done();
  });

  it.skip('does not parse a service containing a function with throws with decimal FieldIDs', function(done) {
    const content = `
      service Test {
        void test() throws (1.2: string test)
      }
    `;

    expect(() => thriftParser(content)).toThrow();
    done();
  });

  it('does not parse a service containing a function with throws with e-notation FieldIDs', function(done) {
    const content = `
      service Test {
        void test() throws (1e2: string test)
      }
    `;

    expect(() => thriftParser(content)).toThrow();
    done();
  });

  it('parses a service containing a function with required throws', function(done) {
    const content = `
      service Test {
        void test() throws (1: required string test)
      }
    `;

    const expected = {
      service: {
        Test: {
          functions: {
            test: {
              args: [],
              name: 'test',
              oneway: false,
              throws: [
                {
                  id: 1,
                  name: 'test',
                  type: 'string',
                  option: 'required'
                }
              ],
              type: 'void'
            }
          }
        }
      }
    };

    const ast = thriftParser(content);

    expect(ast).toEqual(expected);
    done();
  });

  it('parses a service containing a function with optional throws', function(done) {
    const content = `
      service Test {
        void test() throws (1: optional string test)
      }
    `;

    const expected = {
      service: {
        Test: {
          functions: {
            test: {
              args: [],
              name: 'test',
              oneway: false,
              throws: [
                {
                  id: 1,
                  name: 'test',
                  type: 'string',
                  option: 'optional'
                }
              ],
              type: 'void'
            }
          }
        }
      }
    };

    const ast = thriftParser(content);

    expect(ast).toEqual(expected);
    done();
  });

  it('parses a service containing a function with mixed option throws', function(done) {
    const content = `
      service Test {
        void test() throws (1: optional string test1, 2: string test2, 3: required string test3)
      }
    `;

    const expected = {
      service: {
        Test: {
          functions: {
            test: {
              args: [],
              name: 'test',
              oneway: false,
              throws: [
                {
                  id: 1,
                  name: 'test1',
                  type: 'string',
                  option: 'optional'
                },
                {
                  id: 2,
                  name: 'test2',
                  type: 'string'
                },
                {
                  id: 3,
                  name: 'test3',
                  type: 'string',
                  option: 'required'
                }
              ],
              type: 'void'
            }
          }
        }
      }
    };

    const ast = thriftParser(content);

    expect(ast).toEqual(expected);
    done();
  });

  it('parses a service containing throws separated by `;` (ListSeparator)', function(done) {
    const content = `
      service Test {
        void test() throws (1: string test1; 2: bool test2;)
      }
    `;

    const expected = {
      service: {
        Test: {
          functions: {
            test: {
              args: [],
              name: 'test',
              oneway: false,
              throws: [
                {
                  id: 1,
                  name: 'test1',
                  type: 'string'
                },
                {
                  id: 2,
                  name: 'test2',
                  type: 'bool'
                }
              ],
              type: 'void'
            }
          }
        }
      }
    };

    const ast = thriftParser(content);

    expect(ast).toEqual(expected);
    done();
  });

  it('parses a service containing throws separated by mixed `,` and `;` (ListSeparator)', function(done) {
    const content = `
      service Test {
        void test() throws (1: string test1; 2: bool test2,)
      }
    `;

    const expected = {
      service: {
        Test: {
          functions: {
            test: {
              args: [],
              name: 'test',
              oneway: false,
              throws: [
                {
                  id: 1,
                  name: 'test1',
                  type: 'string'
                },
                {
                  id: 2,
                  name: 'test2',
                  type: 'bool'
                }
              ],
              type: 'void'
            }
          }
        }
      }
    };

    const ast = thriftParser(content);

    expect(ast).toEqual(expected);
    done();
  });

  it('parses a service containing a throws that starts with `_` (Identifier)', function(done) {
    const content = `
      service Test {
        void test() throws (1: string _test)
      }
    `;

    const expected = {
      service: {
        Test: {
          functions: {
            test: {
              args: [],
              name: 'test',
              oneway: false,
              throws: [
                {
                  id: 1,
                  name: '_test',
                  type: 'string'
                }
              ],
              type: 'void'
            }
          }
        }
      }
    };

    const ast = thriftParser(content);

    expect(ast).toEqual(expected);
    done();
  });

  it('parses a service containing a throws containing `_` (Identifier)', function(done) {
    const content = `
      service Test {
        void test() throws (1: string te_st)
      }
    `;

    const expected = {
      service: {
        Test: {
          functions: {
            test: {
              args: [],
              name: 'test',
              oneway: false,
              throws: [
                {
                  id: 1,
                  name: 'te_st',
                  type: 'string'
                }
              ],
              type: 'void'
            }
          }
        }
      }
    };

    const ast = thriftParser(content);

    expect(ast).toEqual(expected);
    done();
  });

  it('parses a service containing a throws containing `.` (Identifier)', function(done) {
    const content = `
      service Test {
        void test() throws (1: string te.st)
      }
    `;

    const expected = {
      service: {
        Test: {
          functions: {
            test: {
              args: [],
              name: 'test',
              oneway: false,
              throws: [
                {
                  id: 1,
                  name: 'te.st',
                  type: 'string'
                }
              ],
              type: 'void'
            }
          }
        }
      }
    };

    const ast = thriftParser(content);

    expect(ast).toEqual(expected);
    done();
  });

  it('parses a service containing a throws containing `.`, `_`, letters and numbers (Identifier)', function(done) {
    const content = `
      service Test {
        void test() throws (1: string te.st_123)
      }
    `;

    const expected = {
      service: {
        Test: {
          functions: {
            test: {
              args: [],
              name: 'test',
              oneway: false,
              throws: [
                {
                  id: 1,
                  name: 'te.st_123',
                  type: 'string'
                }
              ],
              type: 'void'
            }
          }
        }
      }
    };

    const ast = thriftParser(content);

    expect(ast).toEqual(expected);
    done();
  });

  it('parses a service containing a function with whitespace around throws', function(done) {
    const content = `
      service Test {
        void test() throws (   1: string test   )
      }
    `;

    const expected = {
      service: {
        Test: {
          functions: {
            test: {
              args: [],
              name: 'test',
              oneway: false,
              throws: [
                {
                  id: 1,
                  name: 'test',
                  type: 'string'
                }
              ],
              type: 'void'
            }
          }
        }
      }
    };

    const ast = thriftParser(content);

    expect(ast).toEqual(expected);
    done();
  });

  it('parses a service containing a function with defaulted throws', function(done) {
    const content = `
      service Test {
        void test() throws (1: string test1 = 'test', 2: i16 test2 = 123)
      }
    `;

    const expected = {
      service: {
        Test: {
          functions: {
            test: {
              args: [],
              name: 'test',
              oneway: false,
              throws: [
                {
                  id: 1,
                  name: 'test1',
                  type: 'string',
                  defaultValue: 'test'
                },
                {
                  id: 2,
                  name: 'test2',
                  type: 'i16',
                  defaultValue: 123
                }
              ],
              type: 'void'
            }
          }
        }
      }
    };

    const ast = thriftParser(content);

    expect(ast).toEqual(expected);
    done();
  });
});
