'use strict';

class Tree {
  constructor() {
    this.texts = [];
    this.tags = [];
  }

  addText(text) {
    if (text.length) { this.texts.push(text); }
  }

  addTag(tag) {
    tag.index = this.texts.length;
    this.tags.push(tag);
    this.texts.push('');
  }

  toJSON() {
    return {
      texts: this.texts,
      tags: this.tags.map((tag) => { return tag.toJSON(); })
    };
  }
}

module.exports = Tree;
