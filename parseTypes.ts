const fs = require('fs');
const ts = require('typescript');

// const filePath = 'src/components/Button/Button.types.ts';
// const code = fs.readFileSync(filePath, 'utf8');

let prevIndentLevel = 0;

const componentsNames = fs.readdirSync('src/components', {
  withFileTypes: false,
});

function parseComponentTypes(name) {
  try {
    const file = `src/components/${name}/${name}.types.ts`;
    const code = fs.readFileSync(file, 'utf8');
    const sourceFile = ts.createSourceFile(
      'test.ts',
      code,
      ts.ScriptTarget.Latest
    );

    return parseTypes({}, sourceFile, 0, sourceFile);
  } catch (e) {
    console.log(e);
    return undefined;
  }
}

function parseTypes(acc = {}, node, indentLevel, sourceFile) {
  const indentation = '-'.repeat(indentLevel);
  const syntaxKind = ts.SyntaxKind[node.kind];
  const nodeText = node.getText(sourceFile);
  console.log(`${indentation} ${syntaxKind}: ${nodeText}`);

  if (indentLevel === 2 && syntaxKind === 'Indentifier') {
    acc[nodeText] = {};
  }

  node.forEachChild(child => {
    parseTypes(acc[nodeText], child, indentLevel + 1, sourceFile);
  });

  return acc;
}

componentsNames.slice(1, 2).forEach(name => {
  const types = {};

  if (!/\./.test(name)) {
    types[name] = parseComponentTypes(name);
  }

  console.log(types);
});
