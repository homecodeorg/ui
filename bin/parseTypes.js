#!/usr/bin/node

const fs = require('fs');
const ts = require('typescript');

let prevIndentLevel = 0;
let ctx = [];
let currNode;
const nodesTree = [];

const componentsNames = fs.readdirSync('src/components', {
  withFileTypes: false,
});

function parseTypes(node, indentLevel, sourceFile, acc = nodesTree[0] || []) {
  const indentation = ' '.repeat(indentLevel);
  const syntaxKind = ts.SyntaxKind[node.kind];
  const nodeText = node.getText(sourceFile);

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

  if (indentLevel < prevIndentLevel) nodesTree.shift();

  console.log(`${indentation} [ ${ctx.join(' - ')} ]`);
  console.log(`${indentation} ${syntaxKind}: ${nodeText}`);
  prevIndentLevel = indentLevel;

  switch (ctx[1]) {
    case 'TypeAliasDeclaration':
      if (ctx[0] === 'Identifier') nodesTree.unshift({});
      break;

    case 'PropertySignature':
      if (ctx[0] === 'Identifier' && !acc[nodeText]) {
        currNode = {};
        acc.push(currNode);
      }

      switch (ctx[0]) {
        case 'Identifier':
          currNode.name = nodeText;
          break;
        case 'QuestionToken':
          currNode.optional = true;
          break;
        case 'StringKeyword':
        case 'BooleanKeyword':
        case 'NumberKeyword':
        case 'ObjectKeyword':
        case 'ArrayKeyword':
        case 'TypeReference':
          currNode.type = nodeText;
          break;
        case 'UnionType':
          currNode.enum = nodeText.split('|').map(item => item.trim());
          break;
      }

      break;
  }

  node.forEachChild(child => {
    parseTypes(child, indentLevel + 1, sourceFile, acc);
  });

  return acc;
}

function parseComponentTypes(name) {
  const file = `src/components/${name}/${name}.types.ts`;

  try {
    const code = fs.readFileSync(file, 'utf8');
    const sourceFile = ts.createSourceFile(
      'test.ts',
      code,
      ts.ScriptTarget.Latest
    );

    return parseTypes(sourceFile, 0, sourceFile);
  } catch (e) {
    if (e.message.includes('ENOENT')) {
      console.log(`File '${file}' not found`);
    }
    // console.log(e);
    return undefined;
  }
}

const types = {};

componentsNames.slice(0, 2).forEach(name => {
  if (!/\./.test(name)) {
    const componentTypes = parseComponentTypes(name);
    if (componentTypes) types[name] = componentTypes;
  }
});

// console.log(types);

fs.writeFileSync('src/docs/types.json', JSON.stringify(types, null, 0));
