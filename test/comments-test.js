it('eliminates comments', function() {
  var template = "{{! figure out what should go here}}";
  expect(Mario.render(template)).toEqual('');
});
