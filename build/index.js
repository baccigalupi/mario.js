'use strict';

const fs        = require('fs');
const version   = require('../package.json').version;
const replaceKey  = 'YIELD';

['global', 'common'].forEach(function(distType) {
  const template  = require('./templates/' + distType);
  ['mario-client'].forEach(function(name) {
    let source      = fs.readFileSync(__dirname + '/../src/' + name + '.js');
    let output = template.replace(replaceKey, source);
    fs.writeFileSync(__dirname + '/../dist/' + name + '-' + version + '-' + distType + '.js', output);
  });
});
