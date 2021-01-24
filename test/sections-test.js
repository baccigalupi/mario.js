describe('affirmative boolean sections', function() {
  it('basic ones render', function() {
    var view = {person: {name: 'Mario', mustache: 'bushy'}};
    var template = '{{#person}}Hello {{name}}, I see your mustache is {{mustache}}{{/person}}.';
    var rendered = Mario.render(template, view);
    expect(rendered).toBe('Hello Mario, I see your mustache is bushy.');
  });

  it('works with multiple affirmative sections', function() {
    var view = {
      greeting: {name: 'Mario'},
      weather: {description: 'cloudy', temperature: '77'},
      happiness: {score: 6}
    };

    var template = '{{#greeting}}Hello {{name}},\n{{/greeting}}'+
      '{{#weather}}It is {{description}} and {{temperature}} degrees.{{/weather}}'+
      '{{#happiness}} You have stated that your happiness is {{score}} out of 10.{{/happiness}}';

    var rendered = Mario.render(template, view);

    expect(rendered).toBe(
      'Hello Mario,\n'+
      'It is cloudy and 77 degrees.'+
      ' You have stated that your happiness is 6 out of 10.'
    );
  });

  it('do not render when the view data is absent', function() {
    var view = {
      greeting: {name: 'Mario'},
      weather: {description: 'cloudy', temperature: '77'},
    };

    var template = '{{#greeting}}Hello {{name}},\n{{/greeting}}'+
      '{{#weather}}It is {{description}} and {{temperature}} degrees.{{/weather}}'+
      '{{#happiness}} You have stated that your happiness is {{score}} out of 10.{{/happiness}}';

    var rendered = Mario.render(template, view);

    expect(rendered).toBe(
      'Hello Mario,\n'+
      'It is cloudy and 77 degrees.'
    );
  });

  it('can use nested notation too', function() {
    var view = {is: {truth: true}};

    var template = 'It is {{#is.truth}}true{{/is.truth}}{{^is.truth}}not true{{/is.truth}}.';
    var rendered = Mario.render(template, view);
    expect(rendered).toEqual('It is true.');
  });
});

describe('Negative boolean sections - sections that render when the view key is false-y or not present', function() {
  it('works with affirmative boolean sections', function() {
    var view = {};
    var template = '{{#person}}Hello {{name}},\n{{/person}}' +
      '{{^person}}Sign in!{{/person}}';
    var rendered = Mario.render(template, view);
    expect(rendered).toBe('Sign in!');
  });

  it('are ignored if the view has that key', function() {
    var view = {person: {name: 'Mario'}};
    var template = '{{#person}}Hello {{name}},{{/person}}' +
      '{{^person}}Sign in!{{/person}}';
    var rendered = Mario.render(template, view);
    expect(rendered).toBe('Hello Mario,');
  });

  it('can use nested notation too', function() {
    var view = {is: {truth: false}};

    var template = 'It is {{#is.truth}}true{{/is.truth}}{{^is.truth}}not true{{/is.truth}}.';
    var rendered = Mario.render(template, view);
    expect(rendered).toEqual('It is not true.');
  });
});

describe('array sections', function() {
  it('an empty array is falsey', function() {
    var view = {numbers: []};
    var template = '{{#numbers}}<li>{{n}}</li>{{/numbers}}';
    var rendered = Mario.render(template, view);
    expect(rendered).toEqual('');
  });

  it('an empty array is falsey and renders the negative section', function() {
    var view = {numbers: []};
    var template = '{{#numbers}}<li>{{n}}</li>{{/numbers}}{{^numbers}}Oh, nothing to count{{/numbers}}';
    var rendered = Mario.render(template, view);
    expect(rendered).toEqual('Oh, nothing to count');
  });

  it('renders each element as a section', function() {
    var view = {numbers: [{n: 1}, {n: 2}]};
    var template = '{{#numbers}}<li>{{n}}</li>{{/numbers}}{{^numbers}}Oh, nothing to count{{/numbers}}';
    var rendered = Mario.render(template, view);
    expect(rendered).toEqual('<li>1</li><li>2</li>');
  });

  it('works with implicit values in arrays', function() {
    var view = {numbers: [1,2]};
    var template = '{{#numbers}}<li>{{.}}</li>{{/numbers}}{{^numbers}}Oh, nothing to count{{/numbers}}';
    var rendered = Mario.render(template, view);
    expect(rendered).toEqual('<li>1</li><li>2</li>');
  });

  it('rendering an array of partials', function() {
    var view = {numbers: [{n: 1}, {n: 2}]};
    var partials = {number: '<li>{{n}}</li>'};
    var template = '{{#numbers}}{{>number}}{{/numbers}} === {{#numbers}}<li>{{n}}</li>{{/numbers}}';
    var rendered = Mario.render(template, view, partials);
    expect(rendered).toEqual('<li>1</li><li>2</li> === <li>1</li><li>2</li>');
  });

  it('rendering an array of partials with implicits', function() {
    var view = {numbers: [1,2]};
    var partials = {number: '<li>{{.}}</li>'};
    var template = '{{#numbers}}{{>number}}{{/numbers}} === {{#numbers}}<li>{{.}}</li>{{/numbers}}';
    var rendered = Mario.render(template, view, partials);
    expect(rendered).toEqual('<li>1</li><li>2</li> === <li>1</li><li>2</li>');
  });
});
