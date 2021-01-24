function render(template, view, partials) {
  return new MarioClient(template, view, partials).render();
}

describe('tags left incomplete', function() {
  it('it tries to match it anyway', function() {
    var compiledTemplate = {
      "name":"incomplete_tag",
      "tree":[{
        "texts":["Hello ",""],
        "tags":[{"index":1,"type":6,"name":"who"}]
      }]
    };
    expect(render(compiledTemplate)).toEqual('Hello ');
    expect(render(compiledTemplate, {who: 'world'})).toEqual('Hello world');
  });

  it('sometimes tag completion does not work, and that is ok', function() {
    var compiledTemplate = {
      "name":"hanging_chad",
      "tree":[{
        "texts":["Hello ",""],
        "tags":[{"index":1,"type":6,"name":"who}isyou"}]
      }]
    };
    var rendered = render(compiledTemplate, {who: 'world'});
    expect(rendered).toEqual('Hello ');
  });
});

describe('escaping', function() {
  it('it passes through without opinion: \\u2028', function() {
    var text = '{{foo}}\u2028{{bar}}';
    var compiledTemplate = {
      "name":"unisex",
      "tree":[{
        "texts":["","\u2028",""],
        "tags":[{"index":0,"type":6,"name":"foo"},{"index":2,"type":6,"name":"bar"}]
      }]
    };
    var rendered = render(compiledTemplate, {foo: 'foo', bar: 'bar'});
    expect(rendered).toBe( 'foo\u2028bar');
  });

  it('it escapes dangerous html chars', function() {
    var compiledTemplate = {
       "name":"taggy",
       "tree":[{
         "texts":[""],"tags":[{"index":0,"type":6,"name":"foo"}]
       }]
     };
    var rendered = render(compiledTemplate, {foo: '< > <div> \' \" &'});
    expect(rendered).toBe('&lt; &gt; &lt;div&gt; &#39; &quot; &amp;');
  });

  it('puts mustache into mustache for meta-magic', function() {
     var compiledTemplate = {
       "name":"taggy",
       "tree":[{
         "texts":[""],"tags":[{"index":0,"type":6,"name":"foo"}]
       }]
     };
    var rendered = render(compiledTemplate, {foo:'{{what}}'});
    expect(rendered).toBe( '{{what}}');
  });

  it('passes through unescaped with a triple stache', function() {
    var compiledTemplate = {
       "name":"taggy",
       "tree":[{
         "texts":[""],"tags":[{"index":0,"type":5,"name":"foo"}]
       }]
     };
    var rendered = render(compiledTemplate, {foo: '< > <div> \' \" &'});
    expect(rendered).toBe('< > <div> \' \" &');
  });
});
