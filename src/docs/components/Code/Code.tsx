import React, { useMemo, useState } from 'react';
import pick from 'lodash.pick';
import * as justorm from 'justorm/react';
import cn from 'classnames';

import { LiveProvider, LiveEditor, LiveError, LivePreview } from 'react-live';

import vsDark from 'prism-react-renderer/themes/vsDark';
import vsLight from 'prism-react-renderer/themes/vsLight';

import * as uilib from '/src';
// import helpers from '!!raw-loader!helpers';

import S from './Code.styl';

const { withStore } = justorm;

const SCOPE = { uilib, React, justorm };
const MAP_LIB_TO_VAR = {
  react: 'React',
  'jsutorm/react': 'justorm',
};

function replaceImportLine(line) {
  const [, vars, from] = line.match(/^import (.*) from '(.*)';/) ?? [];

  if (!from) return line;

  const sourceVar = MAP_LIB_TO_VAR[from] ?? from;

  return `const ${vars} = ${sourceVar};`;
}

function replaceImports(code) {
  return code.split('\n').map(replaceImportLine).join('\n');
}

function wrapExample(code, scope) {
  const [defines, example] = code.split('export default ');
  return `
${replaceImports(defines)}

const Example = ${example};

render(<Example/>);
`;
}

export const Code = withStore({ app: 'theme' })(({ code, scope, store }) => {
  const { theme } = store.app;
  const currScope = useMemo(() => ({ ...SCOPE, ...scope }), [scope]);
  const [editedCode, updateCode] = useState(code);

  return (
    <>
      <LiveEditor
        className={cn(S.editor, S.user)}
        code={editedCode}
        language="typescript"
        theme={theme === 'dark' ? vsDark : vsLight}
        onChange={updateCode}
      />
      <LiveProvider
        noInline
        code={wrapExample(editedCode, scope)}
        scope={currScope}
      >
        <LiveEditor className={cn(S.editor, S.runtime)} />
        <LiveError />
        <LivePreview className={S.preview} />
      </LiveProvider>
    </>
  );
});
