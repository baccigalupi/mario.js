'use strict';

const Tree = require(__dirname + '/tree');
const Tag  = require(__dirname + '/tag');

const DELIMETER   = ['{{', '}}', '}}}'];

class Compiler {
  constructor(template, name) {
    this.template       = template;
    this.name           = name;
    this.ast            = [new Tree()];

    this.cursor = 0;
    this.delimiterIndex = 0;
    this.outOfRange     = this.template.length + 1;
  }

  parse() {
    let length = this.outOfRange - 1;
    while (this.cursor < length) {
      this.processToken();
    }
    return {
      name: this.name,
      tree: this.ast.map((subtree) => { return subtree.toJSON(); })
    };
  }

  processToken() {
    let tail            = this.template.slice(this.cursor);
    let nextTagLocation = tail.indexOf(this.delimiter());

    this.extractNextToken(tail, nextTagLocation);
    this.addToken();
    this.advanceCursor(nextTagLocation);

    if (nextTagLocation >= 0) {
      this.flipDelimiter(tail);
    }
  }

  extractNextToken(tail, location) {
    if (location === undefined || location === -1) {
      this.nextToken = tail;
    } else {
      this.nextToken = tail.slice(0, location);
    }
  }

  addToken() {
    if (this.delimiterIndex > 0) { // start of tag found, seeking ending
      this.orchestrateDisassemblies();
    } else {
      this.addText();
    }
  }

  advanceCursor(nextTagLocation) {
    if (nextTagLocation >= 0) {
      this.cursor = this.cursor + this.delimiter().length + nextTagLocation;
    } else {
      this.cursor = this.outOfRange;
    }
  }

  addText() {
    this.currentTree().addText(this.nextToken);
  }

  orchestrateDisassemblies() {
    let tag = new Tag(this.nextToken);
    let currentTree = this.currentTree();
    if (tag.type === 2 || tag.type === 3) {
      this.startSection(tag);
    } else if (tag.type === 4 && tag.name === currentTree.key) {
      this.endSection();
    } else {
      currentTree.addTag(tag);
    }
  }

  startSection(tag) {
    let newTree = new Tree(tag.name);
    newTree.addTag(tag);
    this.ast.push(newTree);
  }

  endSection() {
    let tree = this.ast.pop();
    let baseTag = tree.tags[0];
    tree.tags = tree.tags.slice(1);
    baseTag.currentTree = currentTree;
    this.currentTree().addTag(baseTag);
  }

  currentTree() {
    return this.ast[this.ast.length - 1];
  }

  delimiter() {
    return DELIMETER[this.delimiterIndex];
  }

  flipDelimiter(tail) {
    if (this.delimiterIndex === 2 || this.delimiterIndex === 1) {
      this.delimiterIndex = 0;
    } else {
      this.delimiterIndex = 1;
    }

    if (this.delimiterIndex === 1 && this.nextToken === '' && tail[2] === '{') {
      this.delimiterIndex = 2;
    }
  }
}

module.exports = Compiler;
