'use strict';

const Mario     = require('../dist/mario-0.1.0-common');
const render    = require('./run-once');

const N = 1000000;

let runPerformance = function() {
  let i;
  let theseTimes = [new Date()];
  for (i = 1; i < N; i++) {
    render(Mario);
  }
  theseTimes.push(new Date());
  theseTimes.push(theseTimes[1] - theseTimes[0]);
  console.log(theseTimes);
};

runPerformance();

