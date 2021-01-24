function render(template, view, partials) {
  return new MarioClient(template, view, partials).render();
}

it('eliminates comments', function() {
  var compiledTemplate = {
    "name":"comment",
    "tree":[{
      "texts":[""],
      "tags":[{"index":0,"type":6,"name":"!figureoutwhatshouldgohere"}]
    }]
  };
  expect(render(compiledTemplate)).toEqual('');
});
