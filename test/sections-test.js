describe('sections', function() {
  it('works with affirmative boolean sections', function() {
    var view = {person: {name: 'Mario', mustache: 'bushy'}};
    var template = "{{#person}}Hello {{name}}, I see your mustache is {{mustache}}{{/person}}."
    console.log(Mario.compile(template));
    var rendered = Mario.render(template, view);
    expect(rendered).toBe('Hello Mario, I see your mustache is bushy.');
  });
});
