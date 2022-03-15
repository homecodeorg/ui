import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import * as justorm from 'justorm/react';
import cn from 'classnames';

import { LiveProvider, LiveEditor, LiveError, LivePreview } from 'react-live';

import vsDark from 'prism-react-renderer/themes/vsDark';
import vsLight from 'prism-react-renderer/themes/vsLight';

import { Scroll, uid } from 'uilib';

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

function getPreHeight(editorElem) {
  const height = editorElem?.querySelector('pre')?.offsetHeight;

  if (!height) return '100%';
  return `${height}px`;
}

export const Code = withStore({ app: 'theme' })(({ code, scope, store }) => {
  const { theme } = store.app;

  const id = useMemo(() => `editor-${uid.generateUID()}`, []);
  const currScope = useMemo(() => ({ ...SCOPE, ...scope }), [scope]);

  const [editedCode, setCode] = useState(code);
  const [height, setHeight] = useState('100%');

  const updateHeight = useCallback(() => {
    const editorElem = document.getElementById(id);
    setHeight(getPreHeight(editorElem));
  }, []);

  const onChange = useCallback(code => {
    setCode(code);
    updateHeight();
  }, []);

  useEffect(() => {
    updateHeight();
  }, []);

  return (
    <div className={S.root}>
      <style>{`#${id} > textarea { height: ${height} !important; }`}</style>
      <Scroll
        y
        className={S.editorContainer}
        offset={{ y: { before: 20, after: 20 } }}
      >
        <LiveEditor
          className={cn(S.editor, S.user)}
          id={id}
          code={editedCode}
          language="typescript"
          theme={theme === 'dark' ? vsDark : vsLight}
          onChange={onChange}
        />
      </Scroll>
      <LiveProvider
        noInline
        code={wrapExample(editedCode, scope)}
        scope={currScope}
      >
        <LiveEditor className={cn(S.editor, S.runtime)} />
        <LiveError className={S.error} />
        <LivePreview className={S.preview} />
      </LiveProvider>
    </div>
  );
});
