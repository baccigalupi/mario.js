var Mario = {
  render: function(template, view, partials) {
    var scanner = this.cache[template];
    if (!scanner) {
      scanner = new Mario.Scanner(template);
    }
    scanner.compile();
  },
  delimiters: ['{{', '}}'],
  cache: {}
};

Mario.Scanner = function(template) {
  this.template       = template;
  this.disassembly    = [];
  this.tags           = [];
  this.cursor         = 0;
  this.delimiterIndex = 0;
  this.compiled       = false;
  this.outOfRange     = this.template.length + 1;
};

Mario.Scanner.prototype.compile = function compile() {
  var length = this.outOfRange - 1;
  while (this.cursor < length) {
    this.processToken();
  }

  if (this.disassembly.length % 2 === 0) {
    throw Error.new('Mario mismatched tags! Close em up.');
  }

  this.compiled = true;
};

Mario.Scanner.prototype.processToken = function processToken() {
  var tail = this.template.slice(this.cursor);
  var nextTagLocation = tail.indexOf(this.delimiter());
  var nextCursor, nextPart;

  if (nextTagLocation === -1) {
    nextPart   = tail;
    nextCursor = this.outOfRange;
  } else {
    nextPart   = tail.slice(0, nextTagLocation);
    nextCursor = this.cursor + 2 + nextTagLocation;
  }

  if (this.delimiterIndex) {
    this.addTag(nextPart);
  } else {
    this.addText(nextPart);
  }

  this.cursor = nextCursor;
  this.flipDelimiter();
};

Mario.Scanner.prototype.addTag = function addTag(nextPart) {
  this.tags.push({
    content: nextPart,
    index: this.disassembly.length
  });
  this.disassembly.push('');
};

Mario.Scanner.prototype.addText = function addText(nextPart) {
  this.disassembly.push(nextPart);
};

Mario.Scanner.prototype.delimiter = function delimiter() {
  return Mario.delimiters[this.delimiterIndex];
};

Mario.Scanner.prototype.flipDelimiter = function flipDelimiter() {
  this.delimiterIndex = (this.delimiterIndex + 1) % 2;
};

// rendering:
// copy string array
// render each tag and insert in text array
// join them all together
