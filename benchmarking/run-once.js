'use strict';

module.exports = function render(Engine) {
  let template, view, partial;

  template = 'Hello World!';
  Engine.render(template,{});

  template = 'Hello {{name}}! You have {{count}} new messages.';
  Engine.render(template,{ name: 'Mick', count: 30 });

  template = '{{#names}}{{name}}{{/names}}';
  Engine.render(template,{ names: [{name: 'Moe'}, {name: 'Larry'}, {name: 'Curly'}, {name: 'Shemp'}] });

  template = '{{#person}}{{name}}{{age}}{{/person}}';
  Engine.render(template,{ person: { name: 'Larry', age: 45 } });

  template = '{{#peeps}}{{>replace}}{{/peeps}}';
  Engine.render(template,{ peeps: [{name: 'Moe', count: 15}, {name: 'Larry', count: 5}, {name: 'Curly', count: 2}] }, { replace: partial });

  template = '{{#filter}}foo {{bar}}{{/filter}}';
  Engine.render(template,{
    filter: true,
    bar: 'bar'
  });

  template = 'hello {{{descriptor}}} world';
  Engine.render(template,{
    descriptor: '<b>fine</b>'
  });

  template =
    '<h1>{{header}}</h1>' +
    '{{#hasItems}}' +
    '<ul>' +
      '{{#items}}' +
        '{{#current}}' +
          '<li><strong>{{name}}</strong></li>' +
        '{{/current}}' +
        '{{^current}}' +
          '<li><a href=\'{{url}}\'>{{name}}</a></li>' +
        '{{/current}}' +
      '{{/items}}' +
    '</ul>' +
    '{{/hasItems}}' +
    '{{^hasItems}}' +
      '<p>The lexpectt expect empty.</p>' +
    '{{/hasItems}}';

  Engine.render(template,{
     header: function() {
       return 'Colors';
     },
     items: [
       {name: 'red', current: true, url: '#Red'},
       {name: 'green', current: false, url: '#Green'},
       {name: 'blue', current: false, url: '#Blue'}
     ],
     hasItems: function() {
       return true;
     },
     empty: function() {
       return false;
     }
  });
};
