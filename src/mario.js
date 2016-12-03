var Mario = {
  render: function(template, view, partials) {
    var scanner = this.cache[template];
    if (!scanner) { scanner = new Mario.Scanner(template); }
    return new Mario.RenderEngine(scanner, view, partials).run();
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
  if (this.compiled) { return; }

  var length = this.outOfRange - 1;
  while (this.cursor < length) {
    this.processToken();
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
  var tagContent = nextPart.replace(/\s/g, '');
  this.tags.push({
    name: tagContent,
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

Mario.RenderEngine = function(scanner, view, partials) {
  this.scanner  = scanner;
  this.view     = view || {};
  this.partials = partials || {};
};

Mario.RenderEngine.prototype.run = function run() {
  this.scanner.compile();
  this.content  = this.scanner.disassembly.slice(0);

  var tags = this.scanner.tags;
  var tagLength = tags.length;
  var i;
  for (i = 0; i < tagLength; i++) {
    this.substitute(tags[i]);
  }
  return this.content.join('');
};

Mario.RenderEngine.prototype.substitute = function substitute(tag) {
  this.content[tag.index] = new Mario.Variable(tag.name, this.view).evaluate(); //this.evaluate(rawValue);
};

Mario.Variable = function(key, view) {
  this.key = key;
  this.view = view;
  this.value = view[key];
}

Mario.Variable.prototype.evaluate = function evaluate() {
  if (this.isComplexKey()) {
    this.nestedValue();
  }

  if (this.isLambda()) {
    this.lambdaValue();
  } else {
    this.stripFalseyValues();
  }
  return this.value;
}

Mario.Variable.prototype.isComplexKey = function isComplexKey() {
  var keys = this.key.split('.');
  this.complexKey = keys;
  return !!(keys.length - 1);
}

Mario.Variable.prototype.nestedValue = function nestedValue() {
  var length = this.complexKey.length;
  var i;
  var temp = this.view;
  for (i = 0; i < length; i++) {
    if (temp) {
      temp = temp[this.complexKey[i]]
    }
  }
  this.value = temp;
}

Mario.Variable.prototype.isLambda = function isLambda() {
  return Object.prototype.toString.call(this.value) === '[object Function]';
}

Mario.Variable.prototype.lambdaValue = function lambdaValue() {
  this.value = this.value();
  this.stripFalseyValues();
}

Mario.Variable.prototype.stripFalseyValues = function stripFalseyValues() {
  if (!this.value && this.value !== 0) {
    this.value = '';
  }
}
