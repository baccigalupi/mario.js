function render(template, view, partials) {
  return new MarioClient(template, view, partials).render();
}

describe('basic rendering', function() {
  it("renders just text", function() {
    var compiledTemplate = {
      "name":"just_text",
      "tree":[{"texts":["test"],"tags":[]}]
    };

    expect(render(compiledTemplate)).toBe('test');
  });

  it("renders just a tag", function() {
    var compiledTemplate = {
      "name":"one_tag",
      "tree":[{
        "texts":[""],
        "tags":[{"index":0,"type":6,"name":"string"}]
      }]
    };

    var rendered = render(compiledTemplate, {string: "---" });
    expect(rendered).toBe("---");
  });

  it('renders when the tag is at the end', function() {
    var compiledTemplate = {
      "name":"ending_tag",
      "tree":[{
        "texts":["hello ",""],
        "tags":[{"index":1,"type":6,"name":"string"}]
      }]
    };
    var rendered = render(compiledTemplate, {string: "---" });
    expect(rendered).toBe("hello ---");
  });

  it('renders when the tag is at the beginning', function() {
    var compiledTemplate = {
      "name":"beginning_tag",
      "tree":[{
        "texts":[""," |||"],
        "tags":[{"index":0,"type":6,"name":"string"}]
      }]
    };
    var rendered = render(compiledTemplate, {string: "---" });
    expect(rendered).toBe("--- |||");
  });

  it("renders one tag surrounded by text", function() {
    var compiledTemplate = {
      "name":"middle_tag",
      "tree":[{
        "texts":["test ",""," test"],
        "tags":[{"index":1,"type":6,"name":"foo"}]
      }]
    };
    var rendered = render(compiledTemplate, {foo:'bar'});
    expect(rendered).toBe("test bar test");
  });

  it("elminates whitespace inside the tag", function() {
    var compiledTemplate = {
      "name":"tag_with_whitespace_inside",
      "tree":[{
        "texts":[""],
        "tags":[{"index":0,"type":6,"name":"string"}]
      }]
    };
    var rendered = render(compiledTemplate, {string: "---" });
    expect(rendered).toBe("---");
  });

  it("preserves white space outside the tag", function() {
    var compiledTemplate = {
      "name":"tag_with_whitespace_outside",
      "tree":[{
        "texts":["  ","","\n"],
        "tags":[{"index":1,"type":6,"name":"string"}]
      }]
    };
    var rendered = render(compiledTemplate, {string: "---" });
    expect(rendered).toEqual("  ---\n");
  });
});

describe('Rendering multiple tags with basic types', function() {
  it("many string variables render correctly", function() {
    var compiledTemplate = {
      "name":"many_tags",
      "tree":[{
        "texts":["test ",""," test ",""," test ",""," test ",""," test"],
        "tags":[
          {"index":1,"type":6,"name":"foo"},
          {"index":3,"type":6,"name":"bar"},
          {"index":5,"type":6,"name":"baz"},
          {"index":7,"type":6,"name":"foo"}
        ]
      }]
    };
    var rendered = render(compiledTemplate, {foo:'42', bar: '43', baz: '44'});
    expect(rendered).toBe("test 42 test 43 test 44 test 42 test");
  });

  it("many numeric variable render correctly", function() {
    var compiledTemplate = {
      "name":"numeric_substitution",
      "tree":[{
        "texts":["integer: ",""," float: ",""," negative: ",""],
        "tags":[
          {"index":1,"type":6,"name":"foo"},
          {"index":3,"type":6,"name":"bar"},
          {"index":5,"type":6,"name":"baz"}
        ]
      }]
    };
    var rendered = render(compiledTemplate, {foo: 42, bar: 42.42, baz: -42});
    expect(rendered).toBe("integer: 42 float: 42.42 negative: -42");
  });
});

describe('rendering non-string and non-numerics', function() {
  it('rendering a plain object is dissatisfying', function() {
    var compiledTemplate = {
      "name":"dissapointment",
      "tree":[{
        "texts":["object: ",""],
        "tags":[{"index":1,"type":6,"name":"foo"}]
      }]
    };
    var rendered = render(compiledTemplate, {foo: {}});
    expect(rendered).toBe("object: [object Object]");
  });

  it('rendering an objuct with a toString capability', function() {
    var compiledTemplate = {
      "name":"to_stringable",
      "tree":[{
        "texts":["object: ",""],
        "tags":[{"index":1,"type":6,"name":"foo"}]
      }]
    };
    var view = {foo: {toString: function(){ return "yo!"; }}};
    var rendered = render(compiledTemplate, view);
    expect(rendered).toBe( "object: yo!");
  });

  it('rendering an array uses default toString behavior', function() {
    var compiledTemplate = {
      "name":"array_value",
      "tree":[{
        "texts":["array: ",""],
        "tags":[{"index":1,"type":6,"name":"foo"}]
      }]
    };
    var rendered = render(compiledTemplate, {foo: ["a","b","c"]});
    expect(rendered).toBe("array: a,b,c");
  });
});
