const thriftParser = require('../thrift-parser');
const assert = require('assert');
const fs = require('fs');
const expectoin = require("./test-parse.expection.json");

fs.readFile('./test.thrift', (error, buffer) => {
  let result = thriftParser(buffer);
  assert.deepEqual(result, expectoin);
});
