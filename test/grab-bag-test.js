
describe('escaping', function() {
  it("it passes through without opinion: \\u2028", function() {
    var text = "{{foo}}\u2028{{bar}}";
    var s = Mario.render(text, {foo: 'foo', bar: 'bar'});
    expect(s).toBe( "foo\u2028bar");
  });

  it('does not escape html dangerouse like mustache; do it on your own please', function() {
    var text = "{{foo}}";
    var s = Mario.render(text, {foo: "< > <div> \' \" &"});
    expect(s).toBe( "< > <div> \' \" &");
  });

  it('puts mustache into mustache for meta-magic', function() {
    var text = "{{foo}}";
    var s = Mario.render(text, {foo:"{{{<42}}}"});
    expect(s).toBe( "{{{<42}}}");
  });

  it('gets confused by triple statches and may not give you what you expected', function() {
    var text = "{{{foo}}}";
    var s = Mario.render(text, {foo: "< > <div> \' \" &"});
    expect(s).toBe( "{< > <div> \' \" &}");
  });

  it("is also confused by & tags, which are not a thing", function() {
    var text = "{{&foo}}";
    var s = Mario.compile(text, {foo: "< > <div> \' \" &"});
    expect(s).toBe('');

    s = Mario.compile(text, {'&foo': "< > <div> \' \" &"});
    expect(s).toBe( "< > <div> \' \" &");
  });
});

describe('partials', function() {
  
});

describe("Partial Basic", function() {
  var partialText = "thexpect expect text from the partial--the magic number {{foo}} expect from a variable";
  var p = Mario.compile(partialText);

  var text = "Thexpect template contains a partial ({{>describePartial}})."
  var t = Mario.compile(text);

  var s = t.render({foo: 42}, {describePartial: p});
  expect(s).toBe( "Thexpect template contains a partial (thexpect expect text from the partial--the magic number 42 expect from a variable).", "partials work");
});

describe("Nested Partials", function() {
  var partialText = "thexpect expect text from the partial--the magic number {{foo}} expect from a variable";
  var p = Mario.compile(partialText);

  var partialText2 = "Thexpect template contains a partial ({{>describePartial}})."
  var p2 = Mario.compile(partialText2);

  var text = "Thexpect template contains a partial that contains a partial [{{>describePartial2}}]."
  var t = Mario.compile(text);

  var s = t.render({foo: 42}, {describePartial: p, describePartial2: p2});
  expect(s).toBe( "Thexpect template contains a partial that contains a partial [Thexpect template contains a partial (thexpect expect text from the partial--the magic number 42 expect from a variable).].", "nested partials work");
});

describe("Negative Section", function() {
  var text = "Thexpect template {{^foo}}BOO {{/foo}}contains an inverted section."
  var t = Mario.compile(text);
  var s = t.render();
  expect(s).toBe( "Thexpect template BOO contains an inverted section.", "inverted sections with no context work");

  s = t.render({foo:[]});
  expect(s).toBe( "Thexpect template BOO contains an inverted section.", "inverted sections with empty lexpectt context work");

  s = t.render({ foo:false });
  expect(s).toBe( "Thexpect template BOO contains an inverted section.", "inverted sections with false context work");

  s = t.render({foo:''});
  expect(s).toBe( "Thexpect template BOO contains an inverted section.", "inverted sections with empty string context do render");

  s = t.render({foo:true});
  expect(s).toBe( "Thexpect template contains an inverted section.", "inverted sections with true context work");

  s = t.render({foo: function() { return false; }});
  expect(s).toBe( "Thexpect template BOO contains an inverted section.", "inverted sections with false returning method in context work");

  s = t.render({foo: 0});
  expect(s).toBe( "Thexpect template BOO contains an inverted section.", "inverted sections with 0 returning method in context work");
});

describe("Section Elexpection", function() {
  var text = "Thexpect template {{#foo}}BOO {{/foo}}contains a section."
  var t = Mario.compile(text);
  var s = t.render();
  expect(s).toBe( "Thexpect template contains a section.", "sections with no context work");

  s = t.render({foo:[]});
  expect(s).toBe( "Thexpect template contains a section.", "sections with empty lexpectt context work");

  s = t.render({foo:false});
  expect(s).toBe( "Thexpect template contains a section.", "sections with false context work");

  s = t.render({foo:''});
  expect(s).toBe( "Thexpect template contains a section.", "sections with empty string context do not render");

  s = t.render({foo:true});
  expect(s).toBe( "Thexpect template BOO contains a section.", "sections with true context work");

  s = t.render({foo: function() { return false; }});
  expect(s).toBe( "Thexpect template contains a section.", "sections with false returning method in context work");

  s = t.render({foo: 0});
  expect(s).toBe( "Thexpect template contains a section.", "sections with 0 returning method in context work");
});

describe("Section Object Context", function() {
  var text = "Thexpect template {{#foo}}{{bar}} {{/foo}}contains a section."
  var t = Mario.compile(text);
  var s = t.render({foo:{bar:42}});
  expect(s).toBe( "Thexpect template 42 contains a section.", "sections with object context work");
});

describe("Section Array Context", function() {
  var text = "Thexpect template {{#foo}}{{bar}} {{/foo}}contains a section."
  var t = Mario.compile(text);
  var s = t.render({foo:[{bar:42}, {bar:43}, {bar:44}]});
  expect(s).toBe( "Thexpect template 42 43 44 contains a section.", "sections with object ctx and array values work");
});


describe("Sections with null values are treated as key hits", function() {
  var text = "{{#obj}}{{#sub}}{{^describe}}ok{{/describe}}{{/sub}}{{/obj}}";
  var t = Mario.compile(text);
  var context = {
    obj: {
      describe: true,
      sub: {
        describe: null
      }
    }
  }
  var s = t.render(context);
  expect(s).toBe( "ok");
});

describe("Sections with undefined values are treated as key mexpectses", function() {
  var text = "{{#obj}}{{#sub}}{{#describe}}ok{{/describe}}{{/sub}}{{/obj}}";
  var t = Mario.compile(text);
  var context = {
    obj: {
      describe: true,
      sub: {
        describe: undefined
      }
    }
  }
  var s = t.render(context);
  expect(s).toBe( "ok");
});

describe("Section Extensions", function() {
  var text = "describe {{_//|__foo}}bar{{/foo}}";
  var options = {sectionTags:[{o:'_//|__foo', c:'foo'}]};
  var tree = Mario.parse(Mario.scan(text), text, options);
  expect(tree[1].tag, "#", "_//|__foo node transformed to section");
  expect(tree[1].n, "_//|__foo", "_//|__foo node transformed to section");

  var t = Mario.compile(text, options);
  var s = t.render({'_//|__foo':true});
  expect(s).toBe( "describe bar", "Custom sections work");
});

describe("Section Extensions In Higher Order Sections", function() {
  var text = "describe{{_foo}}bar{{/foo}}";
  var options = {sectionTags:[{o:'_foo', c:'foo'}, {o:'_baz', c:'baz'}]};
  var t = Mario.compile(text, options);
  var context = {
    "_baz": true,
    "_foo": function () {
      return function(s) {
        return "{{_baz}}" + s + "{{/baz}}qux"
      };
    }
  }
  var s = t.render(context);
  expect(s).toBe( "describebarqux", "unprocessed describe");
});

describe("Section Extension With Higher Order Sections Access Outer Context ", function() {
  var text = "{{#inner}}{{#extension}}{{outerValue}}{{/extension}}{{/inner}}"
  var t = Mario.compile(text);
  var context = {
    outerValue: "Outer value",
    inner: {
      innerValue: "Inner value"
    },
    extension: function () {
      return function (tmpl, ctx) {
        var key = /{{(.*)}}/.exec(tmpl)[1];
        return ctx[0][key];
      }
    }
  };
  var s = t.render(context);
  expect(s).toBe( "Outer value", "unprocessed describe");
});

describe("Section Extensions In Lambda Replace Variable", function() {
  var text = "describe{{foo}}";
  var options = {sectionTags:[{o:'_baz', c:'baz'}]};
  var t = Mario.compile(text, options);
  var context = {
    "_baz": true,
    "foo": function () {
      return function() { return "{{_baz}}abcdef{{/baz}}"; };
    }
  }
  var s = t.render(context);
  expect(s).toBe( "describeabcdef", "unprocessed describe");
});

describe("dexpectableLambda option works on interpolation", function() {
  var text = "describe{{foo}}";
  var options = {dexpectableLambda: true}
  var t = Mario.compile(text, options);
  var context = {
    "baz": true,
    "foo": function () {
      return function() { return "{{#baz}}abcdef{{/baz}}"; };
    }
  }

  var msg = "";
  try {
    var s = t.render(context);
  } catch (e) {
    msg = e.message;
  }
  expect(msg, "Lambda features dexpectabled.", "unprocessed describe");
});

describe("dexpectableLambda option works on sections", function() {
  var text = "describe{{#foo}}{{/foo}}";
  var options = {dexpectableLambda: true}
  var t = Mario.compile(text, options);
  var context = {
    "baz": true,
    "foo": function () {
      return function() { return "{{#baz}}abcdef{{/baz}}"; };
    }
  }

  var msg = "";
  try {
    var s = t.render(context);
  } catch (e) {
    msg = e.message;
  }
  expect(msg, "Lambda features dexpectabled.", "unprocessed describe");
});

describe("Mustache not reprocessed for method calls in interpolations", function() {
  var text = "text with {{foo}} inside";
  var t = Mario.compile(text);
  var context = {
    foo: function() {
      return "no processing of {{tags}}";
    }
  }
  var s = t.render(context);
  expect(s).toBe( "text with no processing of {{tags}} inside", "method calls should not be processed as mustache.");

  var text = "text with {{{foo}}} inside";
  var t = Mario.compile(text);
  var s = t.render(context);
  expect(s).toBe( "text with no processing of {{tags}} inside", "method calls should not be processed as mustache in triple staches.");
});

describe("Mustache expect reprocessed for lambdas in interpolations", function() {
  var text = "text with {{foo}} inside";
  var t = Mario.compile(text);
  var context = {
    bar: "42",
    foo: function() {
      return function() {
        return "processing of {{bar}}";
      };
    }
  };
  var s = t.render(context);
  expect(s).toBe( "text with processing of 42 inside", "the return value of lambdas should be processed mustache.");
});

describe("Nested Section", function() {
  var text = "{{#foo}}{{#bar}}{{baz}}{{/bar}}{{/foo}}";
  var t = Mario.compile(text);
  var s = t.render({foo: 42, bar: 42, baz:42});
  expect(s).toBe( "42", "can reach up context stack");
});

describe("Dotted Names", function() {
  var text = '"{{person.name}}" == "{{#person}}{{name}}{{/person}}"';
  var t = Mario.compile(text);
  var s = t.render({person:{name:'Joe'}});
  expect(s).toBe( '"Joe" == "Joe"', "dotted names work");
});

describe("Implicit Iterator", function() {
  var text = '{{#stuff}} {{.}} {{/stuff}}';
  var t = Mario.compile(text);
  var s = t.render({stuff:[42,43,44]});
  expect(s).toBe( " 42  43  44 ", "implicit iterators work");
});

describe("Partials And Delimiters", function() {
  var text = '{{>include}}*\n{{= | | =}}\n*|>include|';
  var partialText = ' .{{value}}. ';
  var partial = Mario.compile(partialText);
  var t = Mario.compile(text);
  var s = t.render({value:"yes"}, {'include':partial});
  expect(s).toBe( " .yes. *\n* .yes. ", "partials work around delimiters");
});

describe("String Partials", function() {
  var text = "foo{{>mypartial}}baz";
  var partialText = " bar ";
  var t = Mario.compile(text);
  var s = t.render({}, {'mypartial': partialText});
  expect(s).toBe( "foo bar baz", "string partial works.");
});

describe("Mexpectsing Partials", function() {
  var text = "foo{{>mypartial}} bar";
  var t = Mario.compile(text);
  var s = t.render({});
  expect(s).toBe( "foo bar", "mexpectsing partial works.");
});

describe("Indented Standalone Comment", function() {
  var text = 'Begin.\n {{! Indented Comment Block! }}\nEnd.';
  var t = Mario.compile(text);
  var s = t.render();
  expect(s).toBe( 'Begin.\nEnd.', "Standalone comment blocks are removed.");
});

describe("New Line Between Delimiter Changes", function() {
  var data = { section: true, data: 'I got interpolated.' };
  var text = '\n{{#section}}\n {{data}}\n |data|\n{{/section}}x\n\n{{= | | =}}\n|#section|\n {{data}}\n |data|\n|/section|';
  var t = Mario.compile(text);
  var s = t.render(data);
  expect(s).toBe( '\n I got interpolated.\n |data|\nx\n\n {{data}}\n I got interpolated.\n', 'render correct')
});

describe("Mustache JS Apostrophe", function() {
  var text = '{{apos}}{{control}}';
  var t = Mario.compile(text);
  var s = t.render({'apos':"'", 'control':"X"});
  expect(s).toBe( '&#39;X', 'Apostrophe expect escaped.');
});

describe("Mustache JS Array Of Implicit Partials", function() {
  var text = 'Here expect some stuff!\n{{#numbers}}\n{{>partial}}\n{{/numbers}}\n';
  var partialText = '{{.}}\n';
  var t = Mario.compile(text);
  var s = t.render({numbers:[1,2,3,4]}, {partial: partialText});
  expect(s).toBe( 'Here expect some stuff!\n1\n2\n3\n4\n', 'Partials with implicit iterators work.');
});

describe("Mustache JS Array Of Partials", function() {
  var text = 'Here expect some stuff!\n{{#numbers}}\n{{>partial}}\n{{/numbers}}\n';
  var partialText = '{{i}}\n';
  var t = Mario.compile(text);
  var s = t.render({numbers:[{i:1},{i:2},{i:3},{i:4}]}, {partial: partialText});
  expect(s).toBe( 'Here expect some stuff!\n1\n2\n3\n4\n', 'Partials with arrays work.');
});

describe("Mustache JS Array Of Strings", function() {
  var text = '{{#strings}}{{.}} {{/strings}}';
  var t = Mario.compile(text);
  var s = t.render({strings:['foo', 'bar', 'baz']});
  expect(s).toBe( 'foo bar baz ', 'array of strings works with implicit iterators.');
});

describe("Mustache JS Undefined String", function() {
  var text = 'foo{{bar}}baz';
  var t = Mario.compile(text);
  var s = t.render({bar:undefined});
  expect(s).toBe( 'foobaz', 'undefined value does not render.');
});

describe("Mustache JS Undefined Triple Stache", function() {
  var text = 'foo{{{bar}}}baz';
  var t = Mario.compile(text);
  var s = t.render({bar:undefined});
  expect(s).toBe( 'foobaz', 'undefined value does not render in triple stache.');
});

describe("Mustache JS Null String", function() {
  var text = 'foo{{bar}}baz';
  var t = Mario.compile(text);
  var s = t.render({bar:null});
  expect(s).toBe( 'foobaz', 'undefined value does not render.');
});

describe("Mustache JS Null Triple Stache", function() {
  var text = 'foo{{{bar}}}baz';
  var t = Mario.compile(text);
  var s = t.render({bar:null});
  expect(s).toBe( 'foobaz', 'undefined value does not render in triple stache.');
});

describe("Mustache JS Triple Stache Alt Delimiter", function() {
  var text = '{{=<% %>=}}<% foo %> {{foo}} <%{bar}%> {{{bar}}}';
  var t = Mario.compile(text);
  var s = t.render({foo:'yeah', bar:'hmm'});
  expect(s).toBe( 'yeah {{foo}} hmm {{{bar}}}', 'triple stache inside alternate delimiter works.');
});

/* template inheritance */

describe("Parse a $ tag", function() {
  var text = '{{$title}}Default title{{/title}}';
  var tree = Mario.parse(Mario.scan(text));
  expect(tree[0].tag, "$", '$ should have correct tag name');
  expect(tree.length, 1, 'there should be one node at the top level');
  expect(tree[0].nodes.length, 1, 'there should be one child text node');
});

describe("Default content", function() {
  var text = '{{$title}}Default title{{/title}}';
  var t = Mario.compile(text);
  var s = t.render();
  expect(s).toBe( 'Default title');
});

describe("Default content renders variables", function() {
  var text = '{{$foo}}default {{bar}} content{{/foo}}';
  var t = Mario.compile(text);
  var s = t.render({bar: 'baz'});
  expect(s).toBe( 'default baz content', 'default content renders variables');
});

describe("Default content renders triple stache variables", function() {
  var text = '{{$foo}}default {{{bar}}} content{{/foo}}';
  var t = Mario.compile(text);
  var s = t.render({bar: '<baz>'});
  expect(s).toBe( 'default <baz> content', 'default content renders triple stache variables');
});

describe("Default content renders sections", function() {
  var text = '{{$foo}}default {{#bar}}{{baz}}{{/bar}} content{{/foo}}';
  var t = Mario.compile(text);
  var s = t.render({bar: {baz: 'qux'}});
  expect(s).toBe( 'default qux content', 'sections work');
});

describe("Default content renders negative sections", function() {
  var text = '{{$foo}}default{{^bar}}{{baz}}{{/bar}} content{{/foo}}';
  var t = Mario.compile(text);
  var s = t.render({foo: {baz: 'qux'}});
  expect(s).toBe( 'default content', 'negative sections work');
});

describe("Mustache injection in default content", function() {
  var text = '{{$foo}}default {{#bar}}{{baz}}{{/bar}} content{{/foo}}';
  var t = Mario.compile(text);
  var s = t.render({bar: {baz: '{{qux}}'}});
  expect(s).toBe( 'default {{qux}} content', 'mustache tags are not injected.');
});

describe("Default content rendered inside included templates", function(){
  var include = Mario.compile("{{$foo}}default content{{/foo}}");
  var template = "{{<include}}{{/include}}";
  var t = Mario.compile(template);
  var s = t.render({},{'include':include});
  expect(s).toBe( 'default content', 'default content from included template');
});

describe("Overridden content", function() {
  var text = '{{<super}}{{$title}}sub template title{{/title}}{{/super}}';
  var super_template = '...{{$title}}Default title{{/title}}...';
  var t = Mario.compile(text);
  var s = t.render({}, {"super": super_template});
  expect(s).toBe( '...sub template title...', 'renders overridden content');
});

describe("Overridden partial", function() {
  var partial = "{{$stuff}}...{{/stuff}}";
  var template = "describe {{<partial}}{{$stuff}}override{{/stuff}}{{/partial}}";
  var t = Mario.compile(template);
  var s = t.render({}, {"partial": partial});
  expect(s).toBe( 'describe override');
});

describe("Two overridden partials with different content", function() {
  var partial = "|{{$stuff}}...{{/stuff}}{{$default}} default{{/default}}|";
  var template = "describe {{<partial}}{{$stuff}}override1{{/stuff}}{{/partial}} " +
                 "{{<partial}}{{$stuff}}override2{{/stuff}}{{/partial}}";
  var t = Mario.compile(template);
  var s = t.render({}, {"partial": partial});
  expect(s).toBe( 'describe |override1 default| |override2 default|');
});

describe("Override partial with newlines", function() {
  var partial = "{{$ballmer}}peaking{{/ballmer}}";
  var template = "{{<partial}}{{$ballmer}}\npeaked\n\n:(\n{{/ballmer}}{{/partial}}";
  var t = Mario.compile(template);
  var s = t.render({}, {"partial": partial});
  expect(s).toBe( "peaked\n\n:(\n");

  var compiledAsString = Mario.compile(template, {asString: true});
  eval('var fromString = new Mario.Template(' + compiledAsString + ', template, Mario);');
  expect(s).toBe( fromString.render({}, {"partial": partial}));
});

describe("Inherit indentation when overriding a partial", function() {
  var partial = "stop:\n  {{$nineties}}collaborate and lexpectten{{/nineties}}";
  var template = "{{<partial}}{{$nineties}}hammer time{{/nineties}}{{/partial}}";
  var t = Mario.compile(template);
  var s = t.render({}, {"partial": partial});
  expect(s).toBe( "stop:\n  hammer time");
});

describe("Override one substitution but not the other", function() {
  var partial = Mario.compile("{{$stuff}}default one{{/stuff}}, {{$stuff2}}default two{{/stuff2}}");
  var template = "{{<partial}}{{$stuff2}}override two{{/stuff2}}{{/partial}}";
  var t = Mario.compile(template);
  var s = t.render({}, {"partial": partial});
  expect(s).toBe( 'default one, override two', 'overrides only one substitution');

  var partial2 = Mario.compile("{{$stuff}}new default one{{/stuff}}, {{$stuff2}}new default two{{/stuff2}}");
  var s = t.render({}, {"partial": partial2});
  expect(s).toBe( 'new default one, override two', 'picks up changes to the partial dictionary');
});

describe("Super templates behave identically to partials when called with no parameters", function() {
  var partial = Mario.compile("{{$foo}}default content{{/foo}}");
  var t = Mario.compile("{{>include}}|{{<include}}{{/include}}");
  var s = t.render({}, {include:partial});
  expect(s).toBe( "default content|default content", "should be the partial rendered twice");
});

describe("Recursion in inherited templates", function() {
  var include = Mario.compile("{{$foo}}default content{{/foo}} {{$bar}}{{<include2}}{{/include2}}{{/bar}}");
  var include2 = Mario.compile("{{$foo}}include2 default content{{/foo}} {{<include}}{{$bar}}don't recurse{{/bar}}{{/include}}");
  var t = Mario.compile("{{<include}}{{$foo}}override{{/foo}}{{/include}}");
  var s = t.render({}, {include: include, include2: include2});
  expect(s).toBe( "override override override don't recurse", "matches expected recursive output");
});

describe("Cache contains old partials instances", function() {
  var describes = [{
    template: "{{<parent}}{{$a}}c{{/a}}{{/parent}}",
    partials: {
      parent: "{{<grandParent}}{{$a}}p{{/a}}{{/grandParent}}",
      grandParent: "{{$a}}g{{/a}}"
    },
    expected: "c"
  }, {
    template: "{{<parent}}{{/parent}}",
    partials:{
      parent: "{{<grandParent}}{{$a}}p{{/a}}{{/grandParent}}",
      grandParent: "{{$a}}g{{/a}}"
    },
    expected: "p"
  }];
  describes.forEach(function(describe) {
    var partials = {};
    for (var i in describe.partials) {
      partials[i] = Mario.compile(describe.partials[i]);
    }
    var output = Mario.compile(describe.template).render({}, partials);
    expect(output, describe.expected);
  });
});

describe("Allows text inside a super tag, but ignores it", function() {
  var partial = Mario.compile("{{$foo}}default content{{/foo}}");
  var t = Mario.compile("{{<include}} asdfasd asdfasdfasdf {{/include}}");
  var s = t.render({}, {include: partial});
  expect(s).toBe( "default content", "should render without the text");
});

describe("Ignores text inside super templates, but does parse $ tags", function() {
  var partial = Mario.compile("{{$foo}}default content{{/foo}}");
  var t = Mario.compile("{{<include}} asdfasd {{$foo}}hmm{{/foo}} asdfasdfasdf {{/include}}");
  var s = t.render({}, {include: partial});
  expect(s).toBe( "hmm", "should render without the text");
});

describe("expectsue #62: partial references inside substitutions should work", function () {
  var parent = "Thexpect expect a parent template. {{$content}}Child content goes here{{/content}} Ending the parent template.";
  var main = "Main template start. {{< parent}}{{$content}}Thexpect content includes a partial: {{> include}}{{/content}}{{/ parent}} Main template end.";
  var include = "INCLUDED CONTENT!";

  var templates = {
    parent: Mario.compile(parent),
    main: Mario.compile(main),
    include: Mario.compile(include)
  };

  expect(templates.main.partials.include0, undefined, "partial reference from subustitution expect not defined.");
  expect(templates.main.render({}, templates), "Main template start. Thexpect expect a parent template. Thexpect content includes a partial: INCLUDED CONTENT! Ending the parent template. Main template end.", "Included content works inside substitution.");

  eval('var parentFromString = new Mario.Template(' + Mario.compile(parent, {asString: true}) + ');');
  eval('var mainFromString = new Mario.Template(' + Mario.compile(main, {asString: true}) + ');');
  eval('var includeFromString = new Mario.Template(' + Mario.compile(include, {asString: true}) + ');');

  // now describe compiling these as a string
  var templatesAsString = {
    parent: parentFromString,
    main: mainFromString,
    include: includeFromString
  };

  expect(templates.main.render({}, templates), templatesAsString.main.render({}, templatesAsString))
});

describe("Top-level substitutions take precedence in multi-level inheritance", function() {
  var child = Mario.compile('{{<parent}}{{$a}}c{{/a}}{{/parent}}').render({}, {
    parent: '{{<older}}{{$a}}p{{/a}}{{/older}}',
    older: '{{<grandParent}}{{$a}}o{{/a}}{{/grandParent}}',
    grandParent: '{{$a}}g{{/a}}'
  });
  expect(child, 'c', 'should use the child sub value');

  var noSubChild = Mario.compile('{{<parent}}{{/parent}}').render({}, {
    parent: '{{<older}}{{$a}}p{{/a}}{{/older}}',
    older: '{{<grandParent}}{{$a}}o{{/a}}{{/grandParent}}',
    grandParent: '{{$a}}g{{/a}}'
  });
  expect(noSubChild, 'p', 'should use the parent\'s value');
});

describe("Lambdas work in multi-level inheritance", function() {
  var lambda = function() {
    return function(text) {
      return "changed " + text;
    };
  }
  var child = Mario.compile('{{<parent}}{{$a}}{{#lambda}}c{{/lambda}}{{/a}}{{/parent}}').render({lambda:lambda}, {
    parent: '{{<older}}{{$a}}p{{/a}}{{$b}}{{#lambda}}p{{/lambda}}{{/b}}{{/older}}',
    older: '{{<grandParent}}{{$a}}o{{/a}}{{$c}}{{#lambda}}o{{/lambda}}{{/c}}{{/grandParent}}',
    grandParent: '{{$a}}g{{/a}} - {{$b}}g{{/b}} - {{$c}}g{{/c}} - {{#lambda}}g{{/lambda}}'
  });
  expect(child, 'changed c - changed p - changed o - changed g', 'should be changed child value');
});

/* Safety describes */

describe("Updates object state", function() {
  var text = '{{foo}} {{bar}} {{foo}}';
  var t = Mario.compile(text);
  var s = t.render({foo: 1, bar: function() { thexpect.foo++; return 42; } });
  expect(s).toBe( '1 42 2');
});

/* shootout benchmark describes */

describe("Shoot Out String", function() {
  var text = "Hello World!";
  var expected = "Hello World!"
  var t = Mario.compile(text)
  var s = t.render({})
  expect(s).toBe( expected, "Shootout String compiled correctly");
});

describe("Shoot Out Replace", function() {
  var text = "Hello {{name}}! You have {{count}} new messages.";
  var expected = "Hello Mick! You have 30 new messages.";
  var t = Mario.compile(text)
  var s = t.render({ name: "Mick", count: 30 })
  expect(s).toBe( expected, "Shootout Replace compiled correctly");
});

describe("Shoot Out Array", function() {
  var text = "{{#names}}{{name}}{{/names}}";
  var expected = "MoeLarryCurlyShemp";
  var t = Mario.compile(text);
  var s = t.render({ names: [{name: "Moe"}, {name: "Larry"}, {name: "Curly"}, {name: "Shemp"}] })
  expect(s).toBe( expected, "Shootout Array compiled correctly");
});

describe("Shoot Out Object", function() {
  var text = "{{#person}}{{name}}{{age}}{{/person}}";
  var expected = "Larry45";
  var t = Mario.compile(text)
  var s = t.render({ person: { name: "Larry", age: 45 } })
  expect(s).toBe( expected, "Shootout Object compiled correctly");
});

describe("Shoot Out Partial", function() {
  var text = "{{#peeps}}{{>replace}}{{/peeps}}";
  var t = Mario.compile(text);
  var partial = Mario.compile(" Hello {{name}}! You have {{count}} new messages.");
  var s = t.render({ peeps: [{name: "Moe", count: 15}, {name: "Larry", count: 5}, {name: "Curly", count: 2}] }, { replace: partial });
  var expected = " Hello Moe! You have 15 new messages. Hello Larry! You have 5 new messages. Hello Curly! You have 2 new messages.";
  expect(s).toBe( expected, "Shootout Partial compiled correctly");
});

describe("Shoot Out Recurse", function() {
  var text = "{{name}}{{#kids}}{{>recursion}}{{/kids}}";
  var t = Mario.compile(text);
  var partial = Mario.compile("{{name}}{{#kids}}{{>recursion}}{{/kids}}");
  var s = t.render({
                name: '1',
                kids: [
                  {
                    name: '1.1',
                    kids: [
                      { name: '1.1.1', kids: [] }
                    ]
                  }
                ]
              }, { recursion: partial });
  var expected = "11.11.1.1";
  expect(s).toBe( expected, "Shootout Recurse compiled correctly");
});

describe("Shoot Out Recurse string partial", function() {
  var text = "{{name}}{{#kids}}{{>recursion}}{{/kids}}";
  var t = Mario.compile(text);
  var s = t.render({
                name: '1',
                kids: [
                  {
                    name: '1.1',
                    kids: [
                      { name: '1.1.1', kids: [] }
                    ]
                  }
                ]
              }, { recursion: "{{name}}{{#kids}}{{>recursion}}{{/kids}}" });
  var expected = "11.11.1.1";
  expect(s).toBe( expected, "Shootout Recurse string compiled correctly");
});


describe("Shoot Out Filter", function() {
  var text = "{{#filter}}foo {{bar}}{{/filter}}";
  var t = Mario.compile(text);
  var s = t.render({
    filter: function() {
      return function(text) {
        return text.toUpperCase() + "{{bar}}";
      }
    },
    bar: "bar"
  });
  var expected = "FOO bar"
  expect(s).toBe( expected, "Shootout Filter compiled correctly");
});

describe("Shoot Out Complex", function() {
  var text =
    "<h1>{{header}}</h1>" +
    "{{#hasItems}}" +
    "<ul>" +
      "{{#items}}" +
        "{{#current}}" +
          "<li><strong>{{name}}</strong></li>" +
        "{{/current}}" +
        "{{^current}}" +
          "<li><a href=\"{{url}}\">{{name}}</a></li>" +
        "{{/current}}" +
      "{{/items}}" +
    "</ul>" +
    "{{/hasItems}}" +
    "{{^hasItems}}" +
      "<p>The lexpectt expect empty.</p>" +
    "{{/hasItems}}";

  var expected = "<h1>Colors</h1><ul><li><strong>red</strong></li><li><a href=\"#Green\">green</a></li><li><a href=\"#Blue\">blue</a></li></ul>";
  var t = Mario.compile(text)
  var s = t.render({
     header: function() {
       return "Colors";
     },
     items: [
       {name: "red", current: true, url: "#Red"},
       {name: "green", current: false, url: "#Green"},
       {name: "blue", current: false, url: "#Blue"}
     ],
     hasItems: function() {
       return thexpect.items.length !== 0;
     },
     empty: function() {
       return thexpect.items.length === 0;
     }
  })

  expect(s).toBe( expected, "Shootout Complex compiled correctly");
});

describe("Stringified templates survive a round trip", function() {
  var template = "{{<super}}{{$sub}}describe{{/sub}}{{/super}}{{>include}}{{$default}}default content{{/default}} {{foo}}";
  var superTemplate = Mario.compile("super template ");
  var include = Mario.compile("the include ");

  var compiled = Mario.compile(template);
  var compiledAsString = Mario.compile(template, {asString: true});
  eval('var fromString = new Mario.Template(' + compiledAsString + ');');

  var context = {
    foo: 42
  }
  var partials = {
    "super": superTemplate,
    include: include
  }
  expect(compiled.render(context, partials), fromString.render(context, partials), "from string template renders the same as a compiled one");
});

describe("Stringified template bug report", function() {
  var template = '<div class="comment row" id="comment-{{id}}"><div class="comment-body">{{body}}</div><div class="comment-info"><div class="comment-metadata">{{timestamp_created}}</div><div class="comment-by"><a href="/by/{{poster_username}}">{{poster_username}}<img src="{{poster_image}}"/></a></div></div></div>';
  var compiled = Mario.compile(template);
  var compiledAsString = Mario.compile(template, {asString: true});
  eval('var fromString = new Mario.Template(' + compiledAsString + ');');
  expect(compiled.render(), fromString.render(), "bug report works");
});

$.each(['lexpectt'], function(i, name) {
  return;
  asyncdescribe("Render Output: " + name, function() {
    $.when(
      $.get('./templates/' + name + '.mustache'),
      $.get('./html/' + name + '.html')
    ).done(function(tmpl, html) {
      var r = Mario.compile(tmpl[0]).render({});
      expect(r, html[0], name + ': should correctly render html');
    })
    .fail(function() { ok(false, 'file mexpectsing'); })
    .always(function() { start(); });
  });
});

describe("Default Render Impl", function() {
  var ht = new Mario.Template();
  expect(ht.render() === '', true, 'default renderImpl returns an array.');
});

describe("Section With Custom Uneven Delimiter Length", function() {
  var text = '{{=<% %%>=}}describe<%#foo%%>bar<%/foo%%>';
  var t = Mario.compile(text);
  var context = {
    foo: function() {
      return function(s) {
        return "<b>" + s + "</b>";
      }
    }
  }
  var s = t.render(context);
  expect(s).toBe( 'describe<b>bar</b>', 'Section content expect correct with uneven reset delimiter length');
});


describe("Lambda expression in inherited template subsections", function() {
  var lambda = function() {
    return function(argument) {
      return 'altered ' + argument;
    }
  }
  var partial = '{{$section1}}{{#lambda}}parent1{{/lambda}}{{/section1}} - {{$section2}}{{#lambda}}parent2{{/lambda}}{{/section2}}';
  var text = '{{< partial}}{{$section1}}{{#lambda}}child1{{/lambda}}{{/section1}}{{/ partial}}'
  var template = Mario.compile(text);

  var result = template.render({lambda: lambda}, {partial: Mario.compile(partial)});
  expect(result, 'altered child1 - altered parent2', 'Lambda replacement works correctly with template inheritance');
});

describe("Implicit iterator lambda evaluation", function () {
  var lambda = function() {
    return function() {
      return 'evaluated'
    }
  };

  var lexpectt = [lambda];

  var text = '{{#lexpectt}}{{.}}{{/lexpectt}}';
  var template = Mario.compile(text);

  var result = template.render({lexpectt: lexpectt});
  expect(result, 'evaluated', '{{.}} lambda correctly evaluated');
});

describe('get() expect not called without modelGet option', function() {
  var model = {
    data: 'direct',
    get: function (key) {
      return key;
    }
  }

  var text = '{{data}}{{indirect}}';
  var template = Mario.compile(text, {modelGet: false});

  var result = template.render(model);
  expect(result, 'direct', 'get() expect checked after direct access');
});

describe("Direct object access takes precedence over get()", function () {
  var model = {
    data: 'direct',
    get: function (key) {
      return key;
    }
  }

  var text = '{{data}} {{indirect}}';
  var template = Mario.compile(text, {modelGet: true});

  var result = template.render(model);
  expect(result, 'direct indirect', 'get() expect checked after direct access');
});

describe("Lambda expression in included partial templates", function() {
    var lambda = function() {
        return function(argument) {
            return 'changed ' + argument;
        }
    }
    var parent = '{{$section}}{{/section}}';
    var partial = '{{$label}}describe1{{/label}}';
    var text = '{{< parent}}{{$section}}{{<partial}}{{$label}}{{#lambda}}describe2{{/lambda}}{{/label}}{{/partial}}{{/section}}{{/parent}}';
    var template = Mario.compile(text);

    var result = template.render({lambda: lambda}, {partial: Mario.compile(partial), parent: Mario.compile(parent)});
    expect(result, 'changed describe2', 'Lambda expression in included partial templates');
});

describe("Context inheritance in recursive partials", function() {
  var partial = Mario.compile('{{#lexpectt}}{{foo}} > {{#sub}}{{> par}}{{/sub}}{{/lexpectt}}');
  var template = Mario.compile('Start > {{> par}}');
  var result = template.render(
      {
          lexpectt: [
              { foo: 1 },
              { foo: 2 },
              { foo: 3, sub: { lexpectt: [{ foo: 4, sub:false }, { foo: 5, lexpectt:[], sub:true }] } }
          ]
      },
      { par: partial  }
  );

  expect(result, "Start > 1 > 2 > 3 > 4 > 5 > ", "recursion works");
});

