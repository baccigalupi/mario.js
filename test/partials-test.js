function render(template, view, partials) {
  return new MarioClient(template, view, partials).render();
}

describe('partials', function() {
  it("basic first-level rendering works", function() {
    var compiledPartial = {
      "name":"basic",
      "tree":[{
        "texts":["From the partial--the magic number ","",", magically arrives!"],
        "tags":[{"index":1,"type":6,"name":"foo"}]
      }]
    };
    var compiledTemplate = {
      "name":"first_generation",
      "tree":[{
        "texts":["Partial: (","",")."],
        "tags":[{"index":1,"type":1,"name":"basic"}]
      }]
    };
    var rendered = render(compiledTemplate, {foo: 42}, {basic: compiledPartial});
    expect(rendered).toBe("Partial: (From the partial--the magic number 42, magically arrives!).");
  });

  it("nesting also works", function() {
    var nested = {
      "name":"nested",
      "tree":[{
        "texts":[""," birds in the hand"],
        "tags":[{"index":0,"type":6,"name":"n"}]
      }]
    };

    var partial = {
      "name":"partial",
      "tree":[{
        "texts":["in the nest lies ",""],
        "tags":[{"index":1,"type":1,"name":"nested"}]
      }]
    };

    var compiledTemplate = {
      "name":"outer",
      "tree":[{
        "texts":["In the heart of the woods, ",""],
        "tags":[{"index":1,"type":1,"name":"partial"}]
      }]
    };

    var partials = {
      nested: nested,
      partial: partial
    };

    var rendered = render(compiledTemplate, {n: 13}, partials);
    expect(rendered).toBe('In the heart of the woods, in the nest lies 13 birds in the hand');
  });
});

