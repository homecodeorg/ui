#!/usr/bin/node

const fs = require('fs');

let level = 'root';
const levelsData = [];
const getCurrLevelData = () => levelsData[0];
const endFieldRgx = /^}(.*);$/;
const MATCHERS = {
  root(line) {
    const match = line.match(/(type|interface) (\w+) = (.*)/);

    if (match) {
      const [, kind, name, value] = match;
      // console.log([kind, name, value]);
      const data = getCurrLevelData();

      levelsData.unshift((data[name] = { kind }));

      if (/&/.test(value)) this.extends(value.replace(/ {/, ''));

      if (/{$/.test(value)) level = 'field';
    }
  },
  extends(line) {
    getCurrLevelData().extends = line
      .split('&')
      .map(s => s.trim())
      .filter(Boolean);
  },
  preFieldComment: null,
  field(line) {
    const trimedLine = line.trim();

    if (/^\/\//.test(trimedLine)) {
      this.preFieldComment = trimedLine;
      return;
    }

    if (endFieldRgx.test(line)) return this.endField(line);

    const match = line.match(/(\w+)(\?|): (\n|.+)/);

    if (match) {
      let [, name, question, value] = match;
      const fieldData = (getCurrLevelData()[name] = { value });

      if (this.preFieldComment) {
        fieldData.comment = this.preFieldComment;
        this.preFieldComment = null;
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
    const match = line.match(endFieldRgx);

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
    // console.log(getCurrLevelData());
    // console.log(level, line);
    MATCHERS[level](line);
  });

  return levelsData.shift();
}

function parseComponentTypes(name) {
  const file = `src/components/${name}/${name}.types.ts`;

  // console.log('file', file);

  try {
    const code = fs.readFileSync(file, 'utf8');
    // const code = `export type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
    //   className?: string;
    //   children: ReactNode;
    //   prefixElem?: JSX.Element; // Element to be prepended to the children
    //   size?: 's' | 'm' | 'l';
    //   // comment before:
    //   asd: number;
    //   variant?:
    //   | 'clear'
    //   | 'default'
    //   | 'primary';
    //   inputProps?: Omit<
    //     InputProps,
    //     'value' | 'onChange' | 'onFocus' | 'onBlur' | 'size'
    //   >;
    //   getInputVal?: (params: {
    //     isFocused: boolean;
    //     searchVal: string;
    //     selected: Selected;
    //   }) => string;
    // };
    // `;
    return parseTypes(code);
  } catch (e) {
    if (e.message.includes('ENOENT')) {
      console.log(`${file} not found`);
    }
    // console.log(e);
    return undefined;
  }
}

const types = {};
// const componentsNames = ['Button'];
const componentsNames = fs.readdirSync('src/components', {
  withFileTypes: false,
});

componentsNames.forEach(name => {
  if (!/\./.test(name)) {
    const componentTypes = parseComponentTypes(name);
    if (componentTypes) types[name] = componentTypes;
  }
});

// console.log(types);

fs.writeFileSync('src/docs/types.json', JSON.stringify(types, null, 0));
