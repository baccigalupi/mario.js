describe('Scanner, compiling', function() {
  describe('when there are no tags', function() {
    var scanner, template;

    beforeEach(function() {
      template = "hello world!";
      scanner = new Mario.Scanner(template);
      scanner.compile();
    });

    it('tags are empty', function() {
      expect(scanner.tags.length).toEqual(0);
    });

    it('the disassembly has one part with the whole contents of the template', function() {
      expect(scanner.disassembly.length).toEqual(1);
      expect(scanner.disassembly[0]).toEqual(template);
    });
  });

  describe('when there is one tag', function () {
    var scanner, template;

    beforeEach(function () {
      template = "hello {{sentimental}} world!";
      scanner = new Mario.Scanner(template);
      scanner.compile();
    });

    it('tag length is right', function () {
      expect(scanner.tags.length).toEqual(1);
    });

    it('the disassembly has three parts', function () {
      expect(scanner.disassembly.length).toEqual(3);
    });

    it('has an empty string in place of the tag content', function () {
      expect(scanner.disassembly[1]).toEqual('');
    });

    it('divides the non tag text correctly', function() {
      expect(scanner.disassembly[0]).toEqual('hello ');
      expect(scanner.disassembly[2]).toEqual(' world!');
    });
  });

  describe('when there is just one tag', function() {
    var scanner, template;

    beforeEach(function () {
      template = "{{big_dreams}}";
      scanner = new Mario.Scanner(template);
      scanner.compile();
    });

    it('tag length is correct', function () {
      expect(scanner.tags.length).toEqual(1);
    });

    it('the disassembly has one parts', function () {
      expect(scanner.disassembly.length).toEqual(3);
    });
  });
});
