'use strict';

const fs      = require('fs');
const version = require('../package.json').version;

const template    =
  '(function(global) {\n' +
    '\'use strict\';\n' +
    'YIELD\n' +
    'global.Mario = Mario;\n' +
  '})(this);';

const replaceKey  = 'YIELD';
const source      = fs.readFileSync(__dirname + '/../src/mario.js');

let output = template.replace(replaceKey, source);

fs.writeFileSync(__dirname + '/../dist/mario-' + version + '-global.js', output);
