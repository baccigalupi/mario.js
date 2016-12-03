// Tests mostly taken from Hogan.js and adapted to jasmine
// Hogan.js has an extensive end-to-end test suite for mustachery!
describe('basic rendering', function() {
  it("renders just text", function() {
    var text = "test";
    expect(Mario.render(text)).toBe(text);
  });

  it("renders just a tag", function() {
    var text = "{{string}}";
    var s = Mario.render(text, {string: "---" });
    expect(s).toBe("---");
  });

  it('renders when the tag is at the end', function() {
    var text = "hello {{string}}";
    var s = Mario.render(text, {string: "---" });
    expect(s).toBe("hello ---");
  });

  it('renders when the tag is at the beginning', function() {
    var text = "{{string}} |||";
    var s = Mario.render(text, {string: "---" });
    expect(s).toBe("--- |||");
  });

  it("renders one tag surrounded by text", function() {
    var text = "test {{foo}} test";
    var s = Mario.render(text, {foo:'bar'});
    expect(s).toBe("test bar test");
  });

  it("elminates whitespace inside the tag", function() {
    var text = "{{ string }}";
    var s = Mario.render(text, {string: "---" });
    expect(s).toBe("---");
  });

  it("preserves white space outside the tag", function() {
    var text = "  {{string}}\n";
    var s = Mario.render(text, {string: "---" });
    expect(s).toBe("  ---\n");
  });
});

describe('Rendering multiple tags with basic types', function() {
  it("many string variables render correctly", function() {
    var text = "test {{foo}} test {{bar}} test {{baz}} test {{foo}} test";
    var s = Mario.render(text, {foo:'42', bar: '43', baz: '44'});
    expect(s).toBe("test 42 test 43 test 44 test 42 test");
  });

  it("many numeric variable render correctly", function() {
    var text = "integer: {{foo}} float: {{bar}} negative: {{baz}}";
    var s = Mario.render(text, {foo: 42, bar: 42.42, baz: -42});
    expect(s).toBe( "integer: 42 float: 42.42 negative: -42");
  });
});

describe('rendering non-string and non-numerics', function() {
  it('rendering a plain object is dissatisfying', function() {
    var text = "object: {{foo}}";
    var s = Mario.render(text, {foo: {}});
    expect(s).toBe("object: [object Object]");
  });

  it('rendering an objuct with a toString capability', function() {
    var text = "object: {{foo}}";
    var view = {foo: {toString: function(){ return "yo!"; }}};
    var s = Mario.render(text, view);
    expect(s).toBe( "object: yo!");
  });

  it('rendering an array uses default toString behavior', function() {
    var text = "array: {{foo}}";
    var s = Mario.render(text, {foo: ["a","b","c"]});
    expect(s).toBe("array: a,b,c");
  });
});
