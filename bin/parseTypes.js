#!/usr/bin/node

import fs from 'fs';

let level = 'root';
const levelsData = [];
const getCurrLevelData = () => levelsData[0];
const endFieldRgx = /^}(|.*);$/;
const MATCHERS = {
  root(line) {
    const match = line.match(/(type|interface) (\w+) = (.*)/);

    if (match) {
      const [, kind, name, value] = match;
      const data = getCurrLevelData();

      console.log([kind, name, value]);
      levelsData.unshift((data[name] = { kind }));

      if (/&/.test(value)) this.extends(value.replace(/ {/, ''));

      const isMultilineAngle = /</.test(value) && !/>/.test(value);
      const isMultilineParenthesis = /\(/.test(value) && !/\)/.test(value);

      // multiline type value
      if (isMultilineAngle || isMultilineParenthesis) {
        if (isMultilineAngle) this.multilineCloseBrace = '>';
        if (isMultilineParenthesis) this.multilineCloseBrace = ')';

        getCurrLevelData().value = value;
        level = 'typeValue';
        return;
      }

      // single line type
      if (/;$/.test(line)) {
        data[name] = { value: value.replace(/;$/, ''), isPlain: true };
        levelsData.shift();
      } else level = 'field'; // dive into field level
    }
  },
  typeValue(line) {
    const data = getCurrLevelData();

    data.value += line;

    console.log('-', this.multilineCloseBrace);

    const rgx = new RegExp(`\\${this.multilineCloseBrace}`);

    if (rgx.test(line)) {
      console.log('--');

      if (/;$/.test(line)) {
        console.log('---;');
        level = 'root';
        levelsData.shift();
      } else if (/& {$/.test(line)) {
        console.log('---& {');
        level = 'field';
        data.ext = data.value.split('&').map(s => s.trim());
        delete data.value;
        this.clearExtends(data);
      }
    }
  },
  extends(line) {
    const data = getCurrLevelData();
    const items = line
      .split('&')
      .map(s => s.trim())
      .filter(Boolean);

    if (data.ext) data.ext.push(...items);
    else data.ext = items;

    if (/&$/.test(line.trim())) level = 'extends';
    if (/& {$/.test(line.trim())) {
      level = 'field';
      this.clearExtends(data);
    }
  },
  clearExtends(node) {
    if (node.ext[node.ext.length - 1].trim() === '{') node.ext.pop();
  },
  preFieldComment: '',
  field(line) {
    const trimedLine = line.trim();

    if (/^\/\//.test(trimedLine)) {
      const comment = trimedLine.replace(/^\/\//, '').trim();
      this.preFieldComment += (this.preFieldComment ? '\n' : '') + comment;
      return;
    }

    if (endFieldRgx.test(trimedLine)) return this.endField(line);

    const match = line.match(/(\w+)(\?|): (\n|.+)/);

    if (match) {
      let [, name, question, value] = match;
      const fieldData = (getCurrLevelData()[name] = { value });

      if (this.preFieldComment) {
        fieldData.comment = this.preFieldComment;
        this.preFieldComment = '';
      }

      this.value(fieldData);

      // console.log([name, question, value]);

      if (question) fieldData.optional = true;
    }
  },
  value(fieldData) {
    if (/\/\//.test(fieldData.value)) {
      const [val, comment] = fieldData.value.split(/\/\//);
      fieldData.comment = comment.trim();
      fieldData.value = val.trim();
    }

    if (/ \| /.test(fieldData.value))
      fieldData.enum = this.enum(fieldData.value);

    if (!/;$/.test(fieldData.value)) {
      const braces = fieldData.value.match(/\<|\{|\(/);

      if (braces) this.subfieldBraces.push(...braces);

      // console.log('=value', fieldData.value);
      levelsData.unshift(fieldData);
      level = 'subfield';
    } else {
      fieldData.value = fieldData.value.replace(/;$/, '');
    }
  },
  subfieldBraces: [],
  subfield(line) {
    getCurrLevelData().value += line.trim();

    const braces = line.match(/\>|\}|\)/g);

    if (braces) this.subfieldBraces.splice(-braces.length);

    if (this.subfieldBraces.length === 0 && /;$/.test(line)) {
      level = 'field';
      levelsData.shift();
    }
  },
  endField(line) {
    const match = line.trim().match(endFieldRgx);

    if (match[1]) this.extends(match[1]);

    level = 'root';
    levelsData.shift();
  },
  enum(value) {
    return value.split(' | ').map(s => s.trim());
  },
};

function parseTypes(code) {
  levelsData.push({});

  code.split('\n').forEach(line => {
    console.log(levelsData);
    // console.log(getCurrLevelData());
    console.log(`::${level}`, line);
    MATCHERS[level](line);
  });

  // console.log('>>>', levelsData);

  return levelsData.shift();
}

function parseComponentTypes(file) {
  try {
    const code = fs.readFileSync(file, 'utf8');
    // const code = fs.readFileSync('bin/test.ts', 'utf8');

    return parseTypes(code);
  } catch (e) {
    if (e.message.includes('ENOENT')) {
      console.log(`${file} not found`);
    }
    // console.log(e);
    return undefined;
  }
}

const readDir = (dir, cb) =>
  fs.readdirSync(dir, { withFileTypes: false }).forEach(name => {
    if (!/\./.test(name)) cb(dir, name);
  });

function parseComponentDir(dir, name) {
  console.log('parseComponentDir', dir, name);

  const componentDir = `${dir}/${name}`;
  const componentTypes = parseComponentTypes(
    `${componentDir}/${name}.types.ts`
  );

  readDir(componentDir, parseComponentDir);

  if (componentTypes) types[name] = componentTypes;
}

const types = {
  global: parseComponentTypes('src/types.ts'),
  // ...parseComponentTypes('bin/test.ts'),
};

readDir('src/components', parseComponentDir);

// console.log(types);
fs.writeFileSync('src/docs/types.json', JSON.stringify(types, null, 0));
