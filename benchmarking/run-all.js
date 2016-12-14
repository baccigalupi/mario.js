'use strict';

const Mustache  = require('mustache');
const Hogan     = require('hogan.js');
const Mario     = require('../dist/mario-0.1.0-common');

const render    = require('./run-once');

const hoganTemplates = {};

const hoganRender = {
  render: function(template, view, partials) {
    view = view || {};
    partials = partials || {};
    let compiled = hoganTemplates[template] || Hogan.compile(template);
    compiled.render(view, partials);
  }
};

const renderers = {
  Mario: Mario,
  Mustache: Mustache,
  Hogan: hoganRender,
};

const N = 1000000;

let times = {};

let runAll = function() {
  for (var libraryName in renderers) {
    let i;
    let theseTimes = [new Date()];
    for (i = 1; i < N; i++) {
      render(renderers[libraryName]);
    }
    theseTimes.push(new Date());
    theseTimes.push(theseTimes[1] - theseTimes[0]);
    times[libraryName] = theseTimes;
  }
  console.log(times);
};

runAll();
