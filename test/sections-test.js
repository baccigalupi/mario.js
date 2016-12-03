describe('sections', function() {
  it('works with affirmative boolean sections', function() {
    var view = {person: {name: 'Mario', mustache: 'bushy'}};
    var template = "{{#person}}Hello {{name}}, I see your mustache is {{mustache}}{{/person}}."
    var rendered = Mario.render(template, view);
    expect(rendered).toBe('Hello Mario, I see your mustache is bushy.');
  });

  it('works with multiple affirmative boolean sections', function() {
    var view = {
      greeting: {name: 'Mario'},
      weather: {description: 'cloudy', temperature: '77'},
      happiness: {score: 6}
    };

    var template = "{{#greeting}}Hello {{name}},\n{{/greeting}}"+
      "{{#weather}}It is {{description}} and {{temperature}} degrees.{{/weather}}"+
      "{{#happiness}} You have stated that your happiness is {{score}} out of 10.{{/happiness}}";

    var rendered = Mario.render(template, view);

    expect(rendered).toBe(
      'Hello Mario,\n'+
      'It is cloudy and 77 degrees.'+
      ' You have stated that your happiness is 6 out of 10.'
    );
  });

  it('do not render without the view data', function() {
    var view = {
      greeting: {name: 'Mario'},
      weather: {description: 'cloudy', temperature: '77'},
    };

    var template = "{{#greeting}}Hello {{name}},\n{{/greeting}}"+
      "{{#weather}}It is {{description}} and {{temperature}} degrees.{{/weather}}"+
      "{{#happiness}} You have stated that your happiness is {{score}} out of 10.{{/happiness}}";

    var rendered = Mario.render(template, view);

    expect(rendered).toBe(
      'Hello Mario,\n'+
      'It is cloudy and 77 degrees.'
    );
  });
});
