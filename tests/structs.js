'use strict';

const expect = require('expect');

const thriftParser = require('../');

describe('structs', function() {

  it('parses simple struct', function(done) {
    const content = `
      struct Test {
        1: i16 test1
      }
    `;

    const expected = {
      struct: {
        Test: [
          {
            id: 1,
            type: 'i16',
            name: 'test1'
          }
        ]
      }
    };

    const ast = thriftParser(content);

    expect(ast).toEqual(expected);
    done();
  });

  it('parses a struct with a required field', function(done) {
    const content = `
      struct Test {
        1: required i16 test1
      }
    `;

    const expected = {
      struct: {
        Test: [
          {
            id: 1,
            type: 'i16',
            name: 'test1',
            option: 'required'
          }
        ]
      }
    };

    const ast = thriftParser(content);

    expect(ast).toEqual(expected);
    done();
  });

  it('parses a struct with an optional field', function(done) {
    const content = `
      struct Test {
        1: optional i16 test1
      }
    `;

    const expected = {
      struct: {
        Test: [
          {
            id: 1,
            type: 'i16',
            name: 'test1',
            option: 'optional'
          }
        ]
      }
    };

    const ast = thriftParser(content);

    expect(ast).toEqual(expected);
    done();
  });

  it('parses a struct with mixed option fields', function(done) {
    const content = `
      struct Test {
        1: required i16 test1
        2: i16 test2
        3: optional i16 test3
      }
    `;

    const expected = {
      struct: {
        Test: [
          {
            id: 1,
            type: 'i16',
            name: 'test1',
            option: 'required'
          },
          {
            id: 2,
            type: 'i16',
            name: 'test2'
          },
          {
            id: 3,
            type: 'i16',
            name: 'test3',
            option: 'optional'
          }
        ]
      }
    };

    const ast = thriftParser(content);

    expect(ast).toEqual(expected);
    done();
  });

  it('parses custom types in struct field', function(done) {
    const content = `
      struct Test {
        1: TestType test1
      }
    `;

    const expected = {
      struct: {
        Test: [
          {
            id: 1,
            type: 'TestType',
            name: 'test1'
          }
        ]
      }
    };

    const ast = thriftParser(content);

    expect(ast).toEqual(expected);
    done();
  });

  it('parses a struct with default values', function(done) {
    const content = `
      struct Test {
        1: string test1 = 'test'
      }
    `;

    const expected = {
      struct: {
        Test: [
          {
            id: 1,
            type: 'string',
            name: 'test1',
            defaultValue: 'test'
          }
        ]
      }
    };

    const ast = thriftParser(content);

    expect(ast).toEqual(expected);
    done();
  });

  it('parses a struct with mixed default/no-default values', function(done) {
    const content = `
      struct Test {
        1: string test1 = 'test'
        2: i16 test2
      }
    `;

    const expected = {
      struct: {
        Test: [
          {
            id: 1,
            type: 'string',
            name: 'test1',
            defaultValue: 'test'
          },
          {
            id: 2,
            type: 'i16',
            name: 'test2'
          }
        ]
      }
    };

    const ast = thriftParser(content);

    expect(ast).toEqual(expected);
    done();
  });

  it.skip('parses a struct containing a field with a hex FieldID', function(done) {
    const content = `
      struct Test {
        0x01: string test1
      }
    `;

    const expected = {
      struct: {
        Test: [
          {
            id: 1,
            type: 'string',
            name: 'test1'
          }
        ]
      }
    };

    const ast = thriftParser(content);

    expect(ast).toEqual(expected);
    done();
  });

  it('parses a struct containing a field with a negative FieldID', function(done) {
    const content = `
      struct Test {
        -1: string test1
      }
    `;

    const expected = {
      struct: {
        Test: [
          {
            id: -1,
            type: 'string',
            name: 'test1'
          }
        ]
      }
    };

    const ast = thriftParser(content);

    expect(ast).toEqual(expected);
    done();
  });

  it.skip('parses a struct containing a field with a positive FieldID with `+`', function(done) {
    const content = `
      struct Test {
        +1: string test1
      }
    `;

    const expected = {
      struct: {
        Test: [
          {
            id: -1,
            type: 'string',
            name: 'test1'
          }
        ]
      }
    };

    const ast = thriftParser(content);

    expect(ast).toEqual(expected);
    done();
  });

  // TODO: Remove undefined field in output
  it.skip('parses a struct containing a field without a FieldID', function(done) {
    const content = `
      struct Test {
        string test1
      }
    `;

    const expected = {
      struct: {
        Test: [
          {
            type: 'string',
            name: 'test1'
          }
        ]
      }
    };

    const ast = thriftParser(content);

    expect(ast).toEqual(expected);
    done();
  });

  it.skip('parses a struct containing a field without a FieldID but with required', function(done) {
    const content = `
      struct Test {
        required string test1
      }
    `;

    const expected = {
      struct: {
        Test: [
          {
            type: 'string',
            name: 'test1',
            option: 'required'
          }
        ]
      }
    };

    const ast = thriftParser(content);

    expect(ast).toEqual(expected);
    done();
  });

  it.skip('parses a struct containing mixed fields with/without a FieldID', function(done) {
    const content = `
      struct Test {
        string test1
        2: string test2
      }
    `;

    const expected = {
      struct: {
        Test: [
          {
            type: 'string',
            name: 'test1'
          },
          {
            id: 2,
            type: 'string',
            name: 'test2'
          }
        ]
      }
    };

    const ast = thriftParser(content);

    expect(ast).toEqual(expected);
    done();
  });

  it('parses a struct with values that end in `,` (ListSeparator)', function(done) {
    const content = `
      struct Test {
        1: string test1,
        2: string test2 = 'test',
      }
    `;

    const expected = {
      struct: {
        Test: [
          {
            id: 1,
            type: 'string',
            name: 'test1'
          },
          {
            id: 2,
            type: 'string',
            name: 'test2',
            defaultValue: 'test'
          }
        ]
      }
    };

    const ast = thriftParser(content);

    expect(ast).toEqual(expected);
    done();
  });

  it('parses a struct with values that end in `;` (ListSeparator)', function(done) {
    const content = `
      struct Test {
        1: string test1;
        2: string test2 = 'test';
      }
    `;

    const expected = {
      struct: {
        Test: [
          {
            id: 1,
            type: 'string',
            name: 'test1'
          },
          {
            id: 2,
            type: 'string',
            name: 'test2',
            defaultValue: 'test'
          }
        ]
      }
    };

    const ast = thriftParser(content);

    expect(ast).toEqual(expected);
    done();
  });

  it('parses a struct with values that end in `;` and `,` (ListSeparator)', function(done) {
    const content = `
      struct Test {
        1: string test1,
        2: string test2 = 'test';
      }
    `;

    const expected = {
      struct: {
        Test: [
          {
            id: 1,
            type: 'string',
            name: 'test1'
          },
          {
            id: 2,
            type: 'string',
            name: 'test2',
            defaultValue: 'test'
          }
        ]
      }
    };

    const ast = thriftParser(content);

    expect(ast).toEqual(expected);
    done();
  });

  it('does not parse a struct containing a field without a type', function(done) {
    const content = `
      struct Test {
        1: test
      }
    `;

    expect(() => thriftParser(content)).toThrow();
    done();
  });

  it('does not parse a struct containing a field with required & without a type', function(done) {
    const content = `
      struct Test {
        1: required test
      }
    `;

    expect(() => thriftParser(content)).toThrow();
    done();
  });

  it('does not parse a struct containing a field with default & without a type', function(done) {
    const content = `
      struct Test {
        1: test = 'test'
      }
    `;

    expect(() => thriftParser(content)).toThrow();
    done();
  });

  // TODO: OOMs the VM
  it.skip('does not parse a struct containing a field with invalid default', function(done) {
    const content = `
      struct Test {
        1: string test = 'test
      }
    `;

    expect(() => thriftParser(content)).toThrow();
    done();
  });

  // TODO: OOMs the VM
  it.skip('does not parse a struct containing a field with default containing mixed quotes', function(done) {
    const content = `
      struct Test {
        1: string test = 'test"
      }
    `;

    expect(() => thriftParser(content)).toThrow();
    done();
  });

  it('does not parse a struct containing a field with string FieldID', function(done) {
    const content = `
      struct Test {
        test: string test
      }
    `;

    expect(() => thriftParser(content)).toThrow();
    done();
  });

  it('does not parse a struct containing a field with e-notation FieldID', function(done) {
    const content = `
      struct Test {
        1e2: string test
      }
    `;

    expect(() => thriftParser(content)).toThrow();
    done();
  });

  it.skip('does not parse a struct containing a field with decimal FieldID', function(done) {
    const content = `
      struct Test {
        1.2: string test
      }
    `;

    expect(() => thriftParser(content)).toThrow();
    done();
  });

  it('does not parse a struct containing a field with invalid option', function(done) {
    const content = `
      struct Test {
        1: failure string test
      }
    `;

    expect(() => thriftParser(content)).toThrow();
    done();
  });

  it('parses a struct containing a field with a Map type', function(done) {
    const content = `
      struct Test {
        1: map<i16, string> test = { 1: 'a', 2: 'b' }
      }
    `;

    const expected = {
      struct: {
        Test: [
          {
            id: 1,
            type: {
              name: 'map',
              keyType: 'i16',
              valueType: 'string'
            },
            name: 'test',
            defaultValue: [
              {
                key: 1,
                value: 'a'
              },
              {
                key: 2,
                value: 'b'
              }
            ]
          }
        ]
      }
    };

    const ast = thriftParser(content);

    expect(ast).toEqual(expected);
    done();
  });

  it.skip('does not parse a struct containing a field with an invalid Map type', function(done) {
    const content = `
      struct Test {
        1: map<i16> test
      }
    `;

    expect(() => thriftParser(content)).toThrow();
    done();
  });

  it.skip('does not parse a struct containing a field with a Map type but invalid default', function(done) {
    const content = `
      struct Test {
        1: map<i16, string> test = [1,2]
      }
    `;

    expect(() => thriftParser(content)).toThrow();
    done();
  });

  it('parses a struct containing a field with a Set type', function(done) {
    const content = `
      struct Test {
        1: set<i16> test = [1,2]
      }
    `;

    const expected = {
      struct: {
        Test: [
          {
            id: 1,
            type: {
              name: 'set',
              valueType: 'i16'
            },
            name: 'test',
            defaultValue: [
              1,
              2
            ]
          }
        ]
      }
    };

    const ast = thriftParser(content);

    expect(ast).toEqual(expected);
    done();
  });

  it.skip('does not parse a struct containing a field with an invalid Set type', function(done) {
    const content = `
      struct Test {
        1: set<i16, string> test = [1,2]
      }
    `;

    expect(() => thriftParser(content)).toThrow();
    done();
  });

  it.skip('does not parse a struct containing a field with a Set type but invalid default', function(done) {
    const content = `
      struct Test {
        1: set<i16> test = { 1: 'a', 2: 'b' }
      }
    `;

    expect(() => thriftParser(content)).toThrow();
    done();
  });

  it('parses a struct containing a field with a List type', function(done) {
    const content = `
      struct Test {
        1: list<i16> test = [1,2]
      }
    `;

    const expected = {
      struct: {
        Test: [
          {
            id: 1,
            type: {
              name: 'list',
              valueType: 'i16'
            },
            name: 'test',
            defaultValue: [
              1,
              2
            ]
          }
        ]
      }
    };

    const ast = thriftParser(content);

    expect(ast).toEqual(expected);
    done();
  });

  it.skip('does not parse a struct containing a field with an invalid List type', function(done) {
    const content = `
      struct Test {
        1: list<i16, string> test = [1,2]
      }
    `;

    expect(() => thriftParser(content)).toThrow();
    done();
  });

  it.skip('does not parse a struct containing a field with a List type but invalid default', function(done) {
    const content = `
      struct Test {
        1: list<i16> test = { 1: 'a', 2: 'b' }
      }
    `;

    expect(() => thriftParser(content)).toThrow();
    done();
  });

  it('does not parse a struct containing a field with an invalid default assignment', function(done) {
    const content = `
      struct Test {
        1: string test =
      }
    `;

    expect(() => thriftParser(content)).toThrow();
    done();
  });

  it('parses a struct that starts with `_` (Identifier)', function(done) {
    const content = `
      struct _Test {
        1: string test1
      }
    `;

    const expected = {
      struct: {
        _Test: [
          {
            id: 1,
            type: 'string',
            name: 'test1'
          }
        ]
      }
    };

    const ast = thriftParser(content);

    expect(ast).toEqual(expected);
    done();
  });

  it('parses a struct containing `_` (Identifier)', function(done) {
    const content = `
      struct Te_st {
        1: string test1
      }
    `;

    const expected = {
      struct: {
        Te_st: [
          {
            id: 1,
            type: 'string',
            name: 'test1'
          }
        ]
      }
    };

    const ast = thriftParser(content);

    expect(ast).toEqual(expected);
    done();
  });

  it('parses a struct containing `.` (Identifier)', function(done) {
    const content = `
      struct Te.st {
        1: string test1
      }
    `;

    const expected = {
      struct: {
        'Te.st': [
          {
            id: 1,
            type: 'string',
            name: 'test1'
          }
        ]
      }
    };

    const ast = thriftParser(content);

    expect(ast).toEqual(expected);
    done();
  });

  it('parses a struct containing `.`, `_`, letters and numbers (Identifier)', function(done) {
    const content = `
      struct Te.st_123 {
        1: string test1
      }
    `;

    const expected = {
      struct: {
        'Te.st_123': [
          {
            id: 1,
            type: 'string',
            name: 'test1'
          }
        ]
      }
    };

    const ast = thriftParser(content);

    expect(ast).toEqual(expected);
    done();
  });

  it('parses a struct with a field that starts with `_` (Identifier)', function(done) {
    const content = `
      struct Test {
        1: string _test1
      }
    `;

    const expected = {
      struct: {
        Test: [
          {
            id: 1,
            type: 'string',
            name: '_test1'
          }
        ]
      }
    };

    const ast = thriftParser(content);

    expect(ast).toEqual(expected);
    done();
  });

  it('parses a struct with a field containing `_` (Identifier)', function(done) {
    const content = `
      struct Test {
        1: string test_1
      }
    `;

    const expected = {
      struct: {
        Test: [
          {
            id: 1,
            type: 'string',
            name: 'test_1'
          }
        ]
      }
    };

    const ast = thriftParser(content);

    expect(ast).toEqual(expected);
    done();
  });

  it('parses a struct with a field containing `.` (Identifier)', function(done) {
    const content = `
      struct Test {
        1: string test.1
      }
    `;

    const expected = {
      struct: {
        Test: [
          {
            id: 1,
            type: 'string',
            name: 'test.1'
          }
        ]
      }
    };

    const ast = thriftParser(content);

    expect(ast).toEqual(expected);
    done();
  });

  it('parses a struct with a field containing `.`, `_`, letters and numbers (Identifier)', function(done) {
    const content = `
      struct Test {
        1: string te.st_1
      }
    `;

    const expected = {
      struct: {
        Test: [
          {
            id: 1,
            type: 'string',
            name: 'te.st_1'
          }
        ]
      }
    };

    const ast = thriftParser(content);

    expect(ast).toEqual(expected);
    done();
  });
});
