'use strict';

const expect = require('expect');

const thriftParser = require('../');

describe('enums', function() {

  it('parses a simple enum', function(done) {
    const content = `
      enum Test {
        test = 1
      }
    `;

    const expected = {
      enum: {
        Test: {
          items: [
            {
              name: 'test',
              value: 1
            }
          ]
        }
      }
    };

    const ast = thriftParser(content);

    expect(ast).toEqual(expected);
    done();
  });

  it('parses an enum with multiple values', function(done) {
    const content = `
      enum Test {
        test1 = 1
        test2 = 2
        test3 = 3
      }
    `;

    const expected = {
      enum: {
        Test: {
          items: [
            {
              name: 'test1',
              value: 1
            },
            {
              name: 'test2',
              value: 2
            },
            {
              name: 'test3',
              value: 3
            }
          ]
        }
      }
    };

    const ast = thriftParser(content);

    expect(ast).toEqual(expected);
    done();
  });

  // TODO: fix values
  it.skip('parses an enum without values', function(done) {
    const content = `
      enum Test {
        test1
        test2
        test3
      }
    `;

    const expected = {
      enum: {
        Test: {
          items: [
            {
              name: 'test1'
            },
            {
              name: 'test2'
            },
            {
              name: 'test3'
            }
          ]
        }
      }
    };

    const ast = thriftParser(content);

    expect(ast).toEqual(expected);
    done();
  });

  // TODO: fix values
  it.skip('parses an enum with mixed values', function(done) {
    const content = `
      enum Test {
        test1 = 1
        test2
        test3 = 3
      }
    `;

    const expected = {
      enum: {
        Test: {
          items: [
            {
              name: 'test1',
              value: 1
            },
            {
              name: 'test2'
            },
            {
              name: 'test3',
              value: 3
            }
          ]
        }
      }
    };

    const ast = thriftParser(content);

    expect(ast).toEqual(expected);
    done();
  });

  it('parses an enum with hex value assigmnet', function(done) {
    const content = `
      enum Test {
        test1 = 0x01
      }
    `;

    const expected = {
      enum: {
        Test: {
          items: [
            {
              name: 'test1',
              value: 1
            }
          ]
        }
      }
    };

    const ast = thriftParser(content);

    expect(ast).toEqual(expected);
    done();
  });

  it('parses an enum with values that end in `,` (ListSeparator)', function(done) {
    const content = `
      enum Test {
        test1 = 1,
        test2 = 2,
      }
    `;

    const expected = {
      enum: {
        Test: {
          items: [
            {
              name: 'test1',
              value: 1
            },
            {
              name: 'test2',
              value: 2
            }
          ]
        }
      }
    };

    const ast = thriftParser(content);

    expect(ast).toEqual(expected);
    done();
  });

  it('parses an enum with values that end in `;` (ListSeparator)', function(done) {
    const content = `
      enum Test {
        test1 = 1;
        test2 = 2;
      }
    `;

    const expected = {
      enum: {
        Test: {
          items: [
            {
              name: 'test1',
              value: 1
            },
            {
              name: 'test2',
              value: 2
            }
          ]
        }
      }
    };

    const ast = thriftParser(content);

    expect(ast).toEqual(expected);
    done();
  });

  it('parses an enum with values that end in `;` and `,` (ListSeparator)', function(done) {
    const content = `
      enum Test {
        test1 = 1,
        test2 = 2;
      }
    `;

    const expected = {
      enum: {
        Test: {
          items: [
            {
              name: 'test1',
              value: 1
            },
            {
              name: 'test2',
              value: 2
            }
          ]
        }
      }
    };

    const ast = thriftParser(content);

    expect(ast).toEqual(expected);
    done();
  });

  it('parses an enum that starts with `_` (Identifier)', function(done) {
    const content = `
      enum _Test {
        test1 = 1
      }
    `;

    const expected = {
      enum: {
        _Test: {
          items: [
            {
              name: 'test1',
              value: 1
            }
          ]
        }
      }
    };

    const ast = thriftParser(content);

    expect(ast).toEqual(expected);
    done();
  });

  it('parses an enum containing `_` (Identifier)', function(done) {
    const content = `
      enum Te_st {
        test1 = 1
      }
    `;

    const expected = {
      enum: {
        Te_st: {
          items: [
            {
              name: 'test1',
              value: 1
            }
          ]
        }
      }
    };

    const ast = thriftParser(content);

    expect(ast).toEqual(expected);
    done();
  });

  it('parses an enum containing `.` (Identifier)', function(done) {
    const content = `
      enum Te.st {
        test1 = 1
      }
    `;

    const expected = {
      enum: {
        'Te.st': {
          items: [
            {
              name: 'test1',
              value: 1
            }
          ]
        }
      }
    };

    const ast = thriftParser(content);

    expect(ast).toEqual(expected);
    done();
  });

  it('parses an enum containing `.`, `_`, letters and numbers (Identifier)', function(done) {
    const content = `
      enum Te.st_123 {
        test1 = 1
      }
    `;

    const expected = {
      enum: {
        'Te.st_123': {
          items: [
            {
              name: 'test1',
              value: 1
            }
          ]
        }
      }
    };

    const ast = thriftParser(content);

    expect(ast).toEqual(expected);
    done();
  });

  it('parses an enum with values that starts with `_` (Identifier)', function(done) {
    const content = `
      enum Test {
        _test1 = 1
      }
    `;

    const expected = {
      enum: {
        Test: {
          items: [
            {
              name: '_test1',
              value: 1
            }
          ]
        }
      }
    };

    const ast = thriftParser(content);

    expect(ast).toEqual(expected);
    done();
  });

  it('parses an enum with values containing `_` (Identifier)', function(done) {
    const content = `
      enum Test {
        test_1 = 1
      }
    `;

    const expected = {
      enum: {
        Test: {
          items: [
            {
              name: 'test_1',
              value: 1
            }
          ]
        }
      }
    };

    const ast = thriftParser(content);

    expect(ast).toEqual(expected);
    done();
  });

  it('parses an enum with values containing `.` (Identifier)', function(done) {
    const content = `
      enum Test {
        test.1 = 1
      }
    `;

    const expected = {
      enum: {
        Test: {
          items: [
            {
              name: 'test.1',
              value: 1
            }
          ]
        }
      }
    };

    const ast = thriftParser(content);

    expect(ast).toEqual(expected);
    done();
  });

  it('parses an enum with values containing `.`, `_`, letters and numbers (Identifier)', function(done) {
    const content = `
      enum Test {
        te.st_1 = 1
      }
    `;

    const expected = {
      enum: {
        Test: {
          items: [
            {
              name: 'te.st_1',
              value: 1
            }
          ]
        }
      }
    };

    const ast = thriftParser(content);

    expect(ast).toEqual(expected);
    done();
  });

  it('does not parse an enum with invalid value assignment', function(done) {
    const content = `
      enum Test {
        test1 =
      }
    `;

    expect(() => thriftParser(content)).toThrow();
    done();
  });

  it.skip('does not parse an enum with a string value assignment', function(done) {
    const content = `
      enum Test {
        test1 = 'test'
      }
    `;

    expect(() => thriftParser(content)).toThrow();
    done();
  });

  it.skip('does not parse an enum with a decimal value assignment', function(done) {
    const content = `
      enum Test {
        test1 = 1.2
      }
    `;

    expect(() => thriftParser(content)).toThrow();
    done();
  });

  it.skip('does not parse an enum with an e-notation value assignment', function(done) {
    const content = `
      enum Test {
        test1 = 1e2
      }
    `;

    expect(() => thriftParser(content)).toThrow();
    done();
  });

  it.skip('does not parse an enum with a Map value assignment', function(done) {
    const content = `
      enum Test {
        test1 = {'test':'test'}
      }
    `;

    expect(() => thriftParser(content)).toThrow();
    done();
  });

  it.skip('does not parse an enum with a Set/List value assignment', function(done) {
    const content = `
      enum Test {
        test1 = [1,2,3]
      }
    `;

    expect(() => thriftParser(content)).toThrow();
    done();
  });
});
