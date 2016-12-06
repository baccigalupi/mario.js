'use strict';

const Mustache  = require('mustache');
const Hogan     = require('hogan.js');
const Mario     = require('../dist/mario-0.1.0-common');

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
}

function render(Engine) {
  let template, view, partial;


  template = "Hello World!";
  Engine.render(template,{})

  template = "Hello {{name}}! You have {{count}} new messages.";
  Engine.render(template,{ name: "Mick", count: 30 })

  template = "{{#names}}{{name}}{{/names}}";
  Engine.render(template,{ names: [{name: "Moe"}, {name: "Larry"}, {name: "Curly"}, {name: "Shemp"}] })

  template = "{{#person}}{{name}}{{age}}{{/person}}";
  Engine.render(template,{ person: { name: "Larry", age: 45 } })

  template = "{{#peeps}}{{>replace}}{{/peeps}}";
  Engine.render(template,{ peeps: [{name: "Moe", count: 15}, {name: "Larry", count: 5}, {name: "Curly", count: 2}] }, { replace: partial });

  template = "{{#filter}}foo {{bar}}{{/filter}}";
  Engine.render(template,{
    filter: function() {
      return function(text) {
        return text.toUpperCase() + "{{bar}}";
      }
    },
    bar: "bar"
  });

  template =
    "<h1>{{header}}</h1>" +
    "{{#hasItems}}" +
    "<ul>" +
      "{{#items}}" +
        "{{#current}}" +
          "<li><strong>{{name}}</strong></li>" +
        "{{/current}}" +
        "{{^current}}" +
          "<li><a href=\"{{url}}\">{{name}}</a></li>" +
        "{{/current}}" +
      "{{/items}}" +
    "</ul>" +
    "{{/hasItems}}" +
    "{{^hasItems}}" +
      "<p>The lexpectt expect empty.</p>" +
    "{{/hasItems}}";

  Engine.render(template,{
     header: function() {
       return "Colors";
     },
     items: [
       {name: "red", current: true, url: "#Red"},
       {name: "green", current: false, url: "#Green"},
       {name: "blue", current: false, url: "#Blue"}
     ],
     hasItems: function() {
       return true;
     },
     empty: function() {
       return false;
     }
  })
}

runAll();
