describe('rendering more complex data', function() {
  it('does not render lambdas', function() {
    var text = '{{functionalness}}!';
    var s = Mario.render(text, {functionalness: function () {}});
    expect(s).toBe('function () {}!');
  });

  it('renders nested attributes with a dot', function() {
    var text = 'nested: {{foo.bar}}';
    var s = Mario.render(text, {foo: {bar: 'ohai!'}});
    expect(s).toBe('nested: ohai!');
  });

  it('without a view, leaves blank values', function() {
    var text = 'I ({{cannot}}) be seen!';
    var s = Mario.render(text);
    expect(s).toBe('I () be seen!');
  });

  it('renders 0', function() {
    var text = 'Absolute {{zero}}';
    var s = Mario.render(text, {zero: 0});
    expect(s).toBe('Absolute 0');
  });
});

describe('handling false-y values', function() {
  var falseyValues = {
    'undefined': undefined,
    'null': null,
    'false': false
  };

  Object.keys(falseyValues).forEach(function (key) {
    it('omits values: ' + key, function() {
      var text = 'foo{{bar}}baz';
      var s = Mario.render(text, {bar: falseyValues[key]});
      expect(s).toBe('foobaz');
    });
  });
});

