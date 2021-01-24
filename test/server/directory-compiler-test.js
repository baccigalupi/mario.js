const fs                = require('fs');
const expect            = require('expect');
const DirectoryCompiler = require(__dirname + '/../../src/server/directory-compiler');

describe('DirectoryCompiler', () => {
  let dir  = __dirname + '/fixtures/templates';
  let dest = __dirname + '/fixtures/templates.js';

  beforeEach(() => {
    try { fs.unlinkSync(dest); } catch(e) { }
  });

  it('pulls together all the files in a directory and parses them', () => {
    let compiled = new DirectoryCompiler(dir).parse();
    let names = compiled.map((element) => { return element.name; })
    expect(names.sort()).toEqual(['foo', 'foo/bar', 'foo/baz', 'foo/zardoz/foo-again'].sort());
  });

  it('exports to a path', () => {
    let compiler = new DirectoryCompiler(dir);
    compiler.parse();
    compiler.export(dest);
    expect(fs.readFileSync(dest)).toEqual('var MarioTemplates = ' + JSON.stringify(compiler.parsed));
  });
});
