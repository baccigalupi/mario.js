'use strict';

const fs      = require('fs');
const version = require('../package.json').version;

const template    =
  '\'use strict\';\n' +
  'YIELD\n' +
  'module.exports = Mario;\n';

const replaceKey  = 'YIELD';
const source      = fs.readFileSync(__dirname + '/../src/mario.js');

let output = template.replace(replaceKey, source);

fs.writeFileSync(__dirname + '/../dist/mario-' + version + '-common.js', output);
