function render(template, view, partials) {
  return new MarioClient(template, view, partials).render();
}

describe('rendering more complex data', function() {
  it('does not render lambdas', function() {
    var compiledTemplate = {
      "name":"function",
      "tree":[{
        "texts":["","!"],
        "tags":[{"index":0,"type":6,"name":"functionalness"}]
      }]
    };
    var rendered = render(compiledTemplate, {functionalness: function () {}});
    expect(rendered).toBe('function () {}!');
  });

  it('renders nested attributes with a dot', function() {
    var compiledTemplate = {
      "name":"nested_data",
      "tree":[{
        "texts":["nested: ",""],
        "tags":[{"index":1,"type":6,"name":"foo.bar"}]
      }]
    };
    var rendered = render(compiledTemplate, {foo: {bar: 'ohai!'}});
    expect(rendered).toBe('nested: ohai!');
  });

  it('without a view, leaves blank values', function() {
    var compiledTemplate = {
      "name":"viewless",
      "tree":[{
        "texts":["I (","",") be seen!"],
        "tags":[{"index":1,"type":6,"name":"cannot"}]
      }]
    };
    var text = 'I ({{cannot}}) be seen!';
    var rendered = render(compiledTemplate);
    expect(rendered).toBe('I () be seen!');
  });

  it('renders 0', function() {
    var text = 'Absolute {{zero}}';
    var compiledTemplate = {
      "name":"zero",
      "tree":[{
        "texts":["Absolute ",""],
        "tags":[{"index":1,"type":6,"name":"zero"}]
      }]
    };
    var rendered = render(compiledTemplate, {zero: 0});
    expect(rendered).toBe('Absolute 0');
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
      var compiledTemplate = {
        "name":"elimination_round",
        "tree":[{
          "texts":["foo","","baz"],
          "tags":[{"index":1,"type":6,"name":"bar"}]
        }]
      };
      var rendered = render(compiledTemplate, {bar: falseyValues[key]});
      expect(rendered).toBe('foobaz');
    });
  });
});

