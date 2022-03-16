const MAP_LIB_TO_VAR = {
  react: 'React',
  'jsutorm/react': 'justorm',
};

export function replaceImportLine(line) {
  const [, vars, from] = line.match(/^import (.*) from '(.*)';/) ?? [];

  if (!from) return line;

  const sourceVar = MAP_LIB_TO_VAR[from] ?? from;

  return `const ${vars} = ${sourceVar};`;
}

export function replaceImports(code) {
  return code.split('\n').map(replaceImportLine).join('\n');
}

export function wrapExample(code, scope) {
  const [defines, example] = code.split('export default ');
  return `
${replaceImports(defines)}

const Example = ${example};

render(<Example/>);
`;
}

export function getPreHeight(editorElem) {
  const height = editorElem?.querySelector('pre')?.offsetHeight;

  if (!height) return '100%';
  return `${height}px`;
}
