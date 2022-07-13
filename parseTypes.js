const fs = require('fs');
const ts = require('typescript');

// const filePath = 'src/components/Button/Button.types.ts';
// const code = fs.readFileSync(filePath, 'utf8');

let prevIndentLevel = 0;
let ctx = [];
let currNode;

const componentsNames = fs.readdirSync('src/components', {
  withFileTypes: false,
});

function parseTypes(node, indentLevel, sourceFile, acc = {}) {
  const indentation = '-'.repeat(indentLevel);
  const syntaxKind = ts.SyntaxKind[node.kind];
  const nodeText = node.getText(sourceFile);

  console.log(`${indentation} ${syntaxKind}: ${nodeText}`);

  if (indentLevel === 0) {
    ctx = [];
  } else if (indentLevel > prevIndentLevel) {
    ctx.unshift(syntaxKind);
  } else {
    if (indentLevel < prevIndentLevel) {
      ctx = ctx.slice(-indentLevel);
    }
    ctx[0] = syntaxKind;
  }

  prevIndentLevel = indentLevel;
  console.log('ctx', ctx);

  // if (ctx[0] === 'TypeAliasDeclaration') {
  //   node.forEachChild(child => {
  //     parseTypes(child, indentLevel + 1, sourceFile, acc);
  //   });
  // }

  if (ctx[1] === 'TypeAliasDeclaration') {
    if (ctx[0] === 'Identifier') {
      acc[nodeText] = {};
    }

    node.forEachChild(child => {
      parseTypes(child, indentLevel + 1, sourceFile, acc[nodeText]);
    });
  }
  if (ctx[1] === 'PropertySignature') {
    currNode = acc[nodeText] = {};

    if (indentLevel === prevIndentLevel) {
      currNode[nodeText] = {};
    }
  } else {
    node.forEachChild(child => {
      parseTypes(child, indentLevel + 1, sourceFile, acc);
    });
  }

  // if (ctx[1] === 'TypeReference') {])

  return acc;
}

function parseComponentTypes(name) {
  try {
    const file = `src/components/${name}/${name}.types.ts`;
    const code = fs.readFileSync(file, 'utf8');
    const sourceFile = ts.createSourceFile(
      'test.ts',
      code,
      ts.ScriptTarget.Latest
    );

    return parseTypes(sourceFile, 0, sourceFile);
  } catch (e) {
    console.log(e);
    return undefined;
  }
}

componentsNames.slice(1, 2).forEach(name => {
  const types = {};

  if (!/\./.test(name)) {
    types[name] = parseComponentTypes(name);
  }

  console.log(types);
});
