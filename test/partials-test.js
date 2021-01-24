describe('partials', function() {
  it("basic first-level rendering works", function() {
    var partial = "From the partial--the magic number {{foo}}, magically arrives!";
    var template = "Partial: ({{>basic}})."
    var rendered = Mario.render(template, {foo: 42}, {basic: partial});
    expect(rendered).toBe("Partial: (From the partial--the magic number 42, magically arrives!).");
  });

  it("nesting also works", function() {
    var nested = '{{n}} birds in the hand';
    var partial = 'in the nest lies {{> nested}}'
    var template = 'In the heart of the woods, {{> partial}}'

    var partials = {
      nested: nested,
      partial: partial
    };

    var rendered = Mario.render(template, {n: 13}, partials);
    expect(rendered).toBe('In the heart of the woods, in the nest lies 13 birds in the hand');
  });
});

