'use strict';

const fs        = require('fs');
const p         = require('path');
const Compiler  = require('./compiler');

class DirectoryCompiler {
  constructor(dir) {
    this.dir = dir;
  }

  parse() {
    this.parsed = this.readDir(this.dir)
    return this.parsed;
  }

  export(filePath) {
    fs.writeFileSync(filePath, 'var MarioTemplates = ' + JSON.stringify(this.parsed));
  }

  readDir(dir) {
    let nestedCompilation = fs.readdirSync(dir).map((path) => {
      let fullPath = dir + '/' + path;
      let stat = fs.statSync(fullPath);
      return this.compiledPath(fullPath, stat);
    });

    return this.flattenCompilation(nestedCompilation);
  }

  compiledPath(fullPath, stat) {
    let compiled;
    if (stat.isDirectory()) {
      compiled = this.readDir(fullPath);
    } else {
      compiled = this.compileFile(fullPath);
    }
    return compiled;
  }

  compileFile(path) {
    let template = fs.readFileSync(path).toString();
    let name = this.extractName(path);
    return new Compiler(template, name).parse();
  }

  extractName(path) {
    return path
      .replace(this.dir, '')
      .replace(/^\//, '')
      .replace(p.extname(path), '');
  }

  flattenCompilation(nestedCompilation, flattened) {
    flattened = flattened || [];
    nestedCompilation.forEach((compilation) => {
      if (compilation.name) {
        flattened.push(compilation);
      } else {
        this.flattenCompilation(compilation, flattened);
      }
    });
    return flattened;
  }
}

module.exports = DirectoryCompiler;
