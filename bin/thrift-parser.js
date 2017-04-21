#!/usr/bin/env node

const parser = require('../thrift-parser');
const fs = require('fs');
const args = process.argv.slice(2);

if (args.length) {
  args.forEach(path => {
    console.log(JSON.stringify(parser(fs.readFileSync(path)), null, 2)); // eslint-disable-line
  });
} else {
  let receiver = [];
  process.stdin.on('data', data => receiver.push(data));
  process.stdin.on('end', () => {
    console.log(JSON.stringify(parser(Buffer.concat(receiver)), null, 2)); // eslint-disable-line
  });
}
