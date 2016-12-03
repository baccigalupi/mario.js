describe('tags left incomplete', function() {
  it('it tries to match it anyway', function() {
    var template = 'Hello {{who';
    var rendered = Mario.render(template);
    expect(rendered).toEqual('Hello ');
    expect(Mario.render(template, {who: 'world'})).toEqual('Hello world')
  });

  it('sometimes tag completion does not work, and that is ok', function() {
    var template = 'Hello {{who} is you';
    var rendered = Mario.render(template);
    expect(rendered).toEqual('Hello ');
  });
});

describe('escaping, (it does not do it)', function() {
  it("it passes through without opinion: \\u2028", function() {
    var text = "{{foo}}\u2028{{bar}}";
    var s = Mario.render(text, {foo: 'foo', bar: 'bar'});
    expect(s).toBe( "foo\u2028bar");
  });

  it('does not escape html like full mustache; do it on your own please', function() {
    var text = "{{foo}}";
    var s = Mario.render(text, {foo: "< > <div> \' \" &"});
    expect(s).toBe( "< > <div> \' \" &");
  });

  it('puts mustache into mustache for meta-magic', function() {
    var text = "{{foo}}";
    var s = Mario.render(text, {foo:"{{what}}"});
    expect(s).toBe( "{{what}}");
  });

  it('gets confused by triple statches and may not give you what you expected', function() {
    var text = "{{{foo}}}";
    var s = Mario.render(text, {foo: "who"});
    expect(s).toBe( "}"); // last { ends up in the tag name
  });

  it("is also confused by & tags, which are not a thing", function() {
    var text = "{{&foo}}";
    var s = Mario.render(text, {foo: "< > <div> \' \" &"});
    expect(s).toBe('');

    s = Mario.render(text, {'&foo': "< > <div> \' \" &"});
    expect(s).toBe( "< > <div> \' \" &");
  });
});
