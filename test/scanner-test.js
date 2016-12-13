describe('Mario.Scanner', function() {
  it('parses an empty string', function() {
    var scanner = Mario.compile('');
    var disassembly = scanner.disassembly();
    expect(disassembly.tags.length).toEqual(0);
    expect(disassembly.texts.length).toEqual(0);
    expect(scanner.delimiter()).toEqual('{{');
  });

  it('parses just text', function() {
    var scanner = Mario.compile('just text');
    var disassembly = scanner.disassembly();
    expect(disassembly.tags.length).toEqual(0);
    expect(disassembly.texts.length).toEqual(1);
    expect(scanner.delimiter()).toEqual('{{');
  });

  it('parses just a tag', function() {
    var scanner = Mario.compile('{{just_tag}}');
    var disassembly = scanner.disassembly();
    expect(disassembly.tags.length).toEqual(1);
    expect(disassembly.texts.length).toEqual(1); // placeholder
    expect(scanner.delimiter()).toEqual('{{');
  });

  it('parses a tag with white space around it', function() {
    var scanner = Mario.compile('  {{just_tag}}   ');
    var disassembly = scanner.disassembly();
    expect(disassembly.tags.length).toEqual(1);
    expect(disassembly.texts.length).toEqual(3);
    expect(scanner.delimiter()).toEqual('{{');
  });

  it('parses a triple stache', function() {
    var scanner = new Mario.Scanner('{{{tripel}}}');

    scanner.processToken();
    var disassembly = scanner.disassembly();
    expect(disassembly.tags.length).toEqual(0);
    expect(disassembly.texts.length).toEqual(0);
    expect(scanner.delimiter()).toEqual('}}}');

    scanner.processToken();
    disassembly = scanner.disassembly();
    expect(disassembly.tags.length).toEqual(1);
    expect(disassembly.texts.length).toEqual(1);
    expect(scanner.delimiter()).toEqual('{{');
  });
});
