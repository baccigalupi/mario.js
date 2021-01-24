const expect   = require('expect');
const Compiler = require(__dirname + '/../../src/server/compiler');

describe('Compiler', () => {
  function compile(template, name) {
    return new Compiler(template, name).parse();
  }

  it("parses to a tree just text", function() {
    let text = "test";
    let compiled = compile(text, 'test');
    expect(compiled).toEqual({
      name: 'test',
      tree: [
        {
          tags: [],
          texts: ['test']
        }
      ]
    });
  });

  it('parses stuff with tags', () => {
    let text = "object: {{foo}}";
    let compiled = compile(text, 'object-foo');
    expect(compiled).toEqual({
      name: 'object-foo',
      tree: [
        {
          tags: [{index: 1, name: "foo", type: 6}],
          texts: ['object: ', '']
        }
      ]
    });
  });

  it('parses sections', () => {
    let text = 'Hello {{#person}}{{name}}, I see your mustache is {{mustache}}{{/person}}.';
    let compiled = compile(text, 'mustachery');
    expect(compiled).toEqual({
      name: 'mustachery',
      tree: [
        { tags: [], texts: ['Hello '] },
        {
          tags: [
            {index: 0, name: 'person', type: 2},
            {index: 1, name: 'name', type: 6},
            {index: 3, name: 'mustache', type: 6},
            {index: 4, name: 'person', type: 4}
          ],

          texts: [
            '',
            '',
            ', I see your mustache is ',
            '',
            '',
            '.'
          ]
        }
      ]
    });
  });

  it('parses partials', () => {
    let text = "Partial: ({{>basic}}).";
    let compiled = compile(text, 'partiality');
    expect(compiled).toEqual({
      name: 'partiality',
      tree: [
        {
          tags: [{index: 1, name: 'basic', type: 1}],
          texts: [
            'Partial: (',
            '',
            ').'
          ]
        }
      ]
    });
  });
});
