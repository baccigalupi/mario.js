'use strict';
var MarioClient = function(compiledTemplate, view, partials) {
  this.tree = compiledTemplate.tree;
  this.view = view || {};
  this.partials = partials || {};
}

MarioClient.prototype.render = function render() {
  var content = [];
  var length = this.tree.length;
  var i;
  for (i = 0; i < length; i++) {
    content.push(this.renderTree(this.tree[i]));
  }
  return String.prototype.concat.apply('', content);
};

MarioClient.prototype.renderTree = function(compiled) {
  return new MarioClient.Tree(compiled, this.view, this.partials).render();
}

MarioClient.Tree = function(compiled, view, partials) {
  this.tags = compiled.tags;
  this.texts = compiled.texts;
  this.content = this.texts.slice(0);
  this.view = view;
  this.partials = partials;
}

MarioClient.Tree.prototype.render = function renderTree() {
  var tagLength = this.tags.length;
  var i;
  for (i = 0; i < tagLength; i++) {
    this.substitute(i);
  }
  return String.prototype.concat.apply('', this.content);
}

MarioClient.Tree.prototype.substitute = function substitute(i) {
  let tag = this.tags[i];
  this.content[tag.index] = new MarioClient.Tag(tag).render(this.view, this.partials);
};


//MarioClient.Disassembly.prototype.render = function renderDisassembly(view, partials) {
  //var content  = this.texts.slice(0);
  //var tagLength = this.tags.length;
  //var i;
  //for (i = 0; i < tagLength; i++) {
    //this.substitute(content, this.tags[i], view, partials);
  //}
  //return String.prototype.concat.apply('', content);
//};

//MarioClient.Disassembly.prototype.substitute = function substituteTagContent(content, tag, view, partials) {
  //content[tag.index] = tag.render(view, partials);
//};

//MarioClient.Variable = function(key, view) {
  //this.key = key;
  //this.view = view;
  //this.value = view[key];
  //if (key === '.') { this.value = view; }
//};

//MarioClient.Variable.prototype.evaluate = function evaluate() {
  //if (this.isComplexKey()) { this.nestedValue(); }
  //this.stripFalseyValues();
  //return this.value;
//};

//MarioClient.Variable.prototype.isComplexKey = function isComplexKey() {
  //if (this.key === '.') { return false; }
  //var keys = this.key.split('.');
  //this.complexKey = keys;
  //return keys.length - 1 ? true : false;
//};

//MarioClient.Variable.prototype.nestedValue = function nestedValue() {
  //var length = this.complexKey.length;
  //var i;
  //var temp = this.view;
  //for (i = 0; i < length; i++) {
    //if (temp) {
      //temp = temp[this.complexKey[i]];
    //}
  //}
  //this.value = temp;
//};

//MarioClient.Variable.prototype.stripFalseyValues = function stripFalseyValues() {
  //if (!this.value && this.value !== 0) {
    //this.value = '';
  //}
//};

function evaluate(key, view) {
  var value = view[key];
  var isComplex;
  var keys = [];

  if (key === '.') {
    value = view;
    isComplex = false;
  } else {
    keys = key.split('.');
    isComplex = keys.length - 1 ? true : false;
  }

  if (isComplex) {
    var length = keys.length;
    var i;
    var temp = view;
    for (i = 0; i < length; i++) {
      if (temp) {
        temp = temp[keys[i]];
      }
    }
    value = temp;
  }

  if (!value && value !== 0) {
    value = '';
  }
  return value;
}

MarioClient.Tag = function(complilation) {
  this.index = complilation.index;
  this.name = complilation.name;
  this.type = complilation.type;
  this.tree = complilation.tree;
};

MarioClient.Tag.prototype.render = function renderTag(view, partials) {
  var rendered;
  if (this.type === 1) {
    rendered = this.partial(view, partials);
  } else if (this.type === 2) {
    rendered = this.section(view, partials);
  } else if (this.type === 3) {
    rendered = this.antiSection(view, partials);
  } else if (this.type === 5) {
    rendered = this.evaluation(view);
  } else {
    rendered = this.escapedEvaluation(view);
  }
  return rendered;
};

MarioClient.Tag.prototype.evaluation = function evaluation(view) {
  return evaluate(this.name, view);
};

MarioClient.Tag.prototype.escapedEvaluation = function escapedEvaluation(view) {
  var value = evaluate(this.name, view);
  return this.escape(value);
};

MarioClient.Tag.prototype.partial = function renderPartial(view, partials) {
  var partial = partials[this.name];
  var rendeded;
  if (partial) {
    rendeded = new MarioClient(partial, view, partials).render();
  }
  return rendeded || '';
};

MarioClient.Tag.prototype.sectionView = function sectionView(fullView, partials) {
  var view = this.evaluation(fullView, partials);
  if (Array.isArray(view) && !view.length) { return false; }
  return view;
};

MarioClient.Tag.prototype.section = function renderSection(fullView, partials) {
  var view = this.sectionView(fullView, partials);
  if (!view) { return ''; }
  var content;
  if (Array.isArray(view)) {
    content = this.renderArraySection(view, partials);
  } else {
    content = this.tree.render(view, partials);
  }
  return content;
};

MarioClient.Tag.prototype.renderArraySection = function renderArraySection(view, partials) {
  var content = [];
  var length = view.length;
  var i;
  for (i = 0; i < length; i++) {
    content.push(this.tree.render(view[i], partials));
  }
  return String.prototype.concat.apply('', content);
};

MarioClient.Tag.prototype.antiSection = function renderAntiSection(fullView, partials) {
  var view = this.sectionView(fullView, partials);
  if (view) { return ''; }
  return this.tree.render(fullView, partials);
};

MarioClient.Tag.prototype.escape = function escapeHTML(value) {
  if (value.toString) {
    value = value.toString();
  }

  return String(value).replace(MarioClient.Tag.escapeRegex, MarioClient.Tag.escape);
};

MarioClient.Tag.escapeRegex = /[&<>"'`=\/]/g;
MarioClient.Tag.escapeMap = {
  '&':  '&amp;',
  '<':  '&lt;',
  '>':  '&gt;',
  '"':  '&quot;',
  '\'': '&#39;',
  '/':  '&#x2F;',
  '`':  '&#x60;',
  '=':  '&#x3D;'
};

MarioClient.Tag.escape = function escape(value) {
  return MarioClient.Tag.escapeMap[value];
};

module.exports = MarioClient;
