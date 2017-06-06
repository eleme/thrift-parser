'use strict';

const expect = require('expect');

const thriftParser = require('../');

describe('typedefs', function() {

  it('parses a simple typedef', function(done) {
    const content = `
      typedef string Test
    `;

    const expected = {
      typedef: {
        Test: {
          type: 'string'
        }
      }
    };

    const ast = thriftParser(content);

    expect(ast).toEqual(expected);
    done();
  });

  it('parses a typedef of another typedef type', function(done) {
    const content = `
      typedef string Json
      typedef Json Test
    `;

    const expected = {
      typedef: {
        Json: {
          type: 'string'
        },
        Test: {
          type: 'Json'
        }
      }
    };

    const ast = thriftParser(content);

    expect(ast).toEqual(expected);
    done();
  });

  it('parses a typedef that ends in `,` (ListSeparator)', function(done) {
    const content = `
      typedef string Test,
    `;

    const expected = {
      typedef: {
        Test: {
          type: 'string'
        }
      }
    };

    const ast = thriftParser(content);

    expect(ast).toEqual(expected);
    done();
  });

  it('parses a typedef that ends in `;` (ListSeparator)', function(done) {
    const content = `
      typedef string Test;
    `;

    const expected = {
      typedef: {
        Test: {
          type: 'string'
        }
      }
    };

    const ast = thriftParser(content);

    expect(ast).toEqual(expected);
    done();
  });

  it('parses a Map typedef', function(done) {
    const content = `
      typedef map<string, string> Test;
    `;

    const expected = {
      typedef: {
        Test: {
          type: {
            name: 'map',
            keyType: 'string',
            valueType: 'string'
          }
        }
      }
    };

    const ast = thriftParser(content);

    expect(ast).toEqual(expected);
    done();
  });

  it.skip('does not parse an invalid Map typedef', function(done) {
    const content = `
      typedef map<string> Test;
    `;

    expect(() => thriftParser(content)).toThrow();
    done();
  });

  it('does not parse an unclosed Map typedef', function(done) {
    const content = `
      typedef map<string, string Test;
    `;

    expect(() => thriftParser(content)).toThrow();
    done();
  });

  it('parses a Set typedef', function(done) {
    const content = `
      typedef set<string> Test;
    `;

    const expected = {
      typedef: {
        Test: {
          type: {
            name: 'set',
            valueType: 'string'
          }
        }
      }
    };

    const ast = thriftParser(content);

    expect(ast).toEqual(expected);
    done();
  });

  it.skip('does not parse an invalid Set typedef', function(done) {
    const content = `
      typedef set<string, string> Test;
    `;

    expect(() => thriftParser(content)).toThrow();
    done();
  });

  it('does not parse an unclosed Set typedef', function(done) {
    const content = `
      typedef set<string Test;
    `;

    expect(() => thriftParser(content)).toThrow();
    done();
  });

  it('parses a List typedef', function(done) {
    const content = `
      typedef list<string> Test;
    `;

    const expected = {
      typedef: {
        Test: {
          type: {
            name: 'list',
            valueType: 'string'
          }
        }
      }
    };

    const ast = thriftParser(content);

    expect(ast).toEqual(expected);
    done();
  });

  it.skip('does not parse an invalid List typedef', function(done) {
    const content = `
      typedef list<string, string> Test;
    `;

    expect(() => thriftParser(content)).toThrow();
    done();
  });

  it('does not parse an unclosed List typedef', function(done) {
    const content = `
      typedef list<string Test;
    `;

    expect(() => thriftParser(content)).toThrow();
    done();
  });

  it('parses nested Lists/Maps/Sets in typedef', function(done) {
    const content = `
      typedef list<set<map<string, string>>> Test;
    `;

    const expected = {
      typedef: {
        Test: {
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
    };

    const ast = thriftParser(content);

    expect(ast).toEqual(expected);
    done();
  });

  it('does not parse unclosed nested Lists/Maps/Sets in typedef', function(done) {
    const content = `
      typedef list<set<map<string, string>> Test;
    `;

    expect(() => thriftParser(content)).toThrow();
    done();
  });
});
