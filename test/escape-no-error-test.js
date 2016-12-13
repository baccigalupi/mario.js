describe('tags left incomplete', function() {
  it('it tries to match it anyway', function() {
    var template = 'Hello {{who';
    var rendered = Mario.render(template);
    expect(rendered).toEqual('Hello ');
    expect(Mario.render(template, {who: 'world'})).toEqual('Hello world');
  });

  it('sometimes tag completion does not work, and that is ok', function() {
    var template = 'Hello {{who} is you';
    var rendered = Mario.render(template);
    expect(rendered).toEqual('Hello ');
  });
});

describe('escaping', function() {
  it('it passes through without opinion: \\u2028', function() {
    var text = '{{foo}}\u2028{{bar}}';
    var s = Mario.render(text, {foo: 'foo', bar: 'bar'});
    expect(s).toBe( 'foo\u2028bar');
  });

  it('it escapes dangerous html chars', function() {
    var text = '{{foo}}';
    var s = Mario.render(text, {foo: '< > <div> \' \" &'});
    expect(s).toBe('&lt; &gt; &lt;div&gt; &#39; &quot; &amp;');
  });

  it('puts mustache into mustache for meta-magic', function() {
    var text = '{{foo}}';
    var s = Mario.render(text, {foo:'{{what}}'});
    expect(s).toBe( '{{what}}');
  });

  it('passes through unescaped with a triple stache', function() {
    var text = '{{{foo}}}';
    var s = Mario.render(text, {foo: '< > <div> \' \" &'});
    expect(s).toBe('< > <div> \' \" &');
  });
});
