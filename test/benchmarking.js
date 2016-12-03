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


