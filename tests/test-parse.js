const thriftParser = require('../thrift-parser');
const assert = require('assert');
const fs = require('fs');
const expectoin = require('./test-parse.expection.json');

fs.readFile('./test.thrift', (error, buffer) => {
  let ast = thriftParser(buffer);
  // console.log(JSON.stringify(ast, null, 2));
  assert.deepEqual(ast, expectoin);
});

fs.readFile('./invalid-number.thrift', (error, buffer) => {
  assert.throws(() => thriftParser(buffer));
});
