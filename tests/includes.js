'use strict';

const expect = require('expect');

const thriftParser = require('../');

describe('includes', function() {

  it('parses a basic include', function(done) {
    const content = `
        include "test"
    `;

    const expected = {
      include: {
        test: {
          path: 'test'
        }
      }
    };

    const ast = thriftParser(content);

    expect(ast).toEqual(expected);
    done();
  });

  it('drops .thrift extension for key', function(done) {
    const content = `
        include "test.thrift"
    `;

    const expected = {
      include: {
        test: {
          path: 'test.thrift'
        }
      }
    };

    const ast = thriftParser(content);

    expect(ast).toEqual(expected);
    done();
  });

  it('parses paths wrapped in single-quotes', function(done) {
    const content = `
        include 'test'
    `;

    const expected = {
      include: {
        test: {
          path: 'test'
        }
      }
    };

    const ast = thriftParser(content);

    expect(ast).toEqual(expected);
    done();
  });

  // TODO: Make this pass
  it.skip('does not parse paths wrapped in mixed-quotes (Literal)', function(done) {
    const content = `
        include 'test"
    `;

    expect(() => thriftParser(content)).toThrow();
    done();
  });
});
