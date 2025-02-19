import { useCallback } from 'react';
import { LiveEditor } from 'react-live';
import { useStore } from 'justorm/react';

import vsDark from 'prism-react-renderer/themes/vsDark';
import vsLight from 'prism-react-renderer/themes/vsLight';

import S from '../Code.styl';
import STORE from '../store';

export default function Editor({ id, code }) {
  const { app } = useStore({ app: ['theme'] });

  const onChange = useCallback(newCode => {
    if (newCode !== STORE.editedCode) {
      STORE.onChange(id, newCode);
    }
  }, []);

  if (!code) return null;

  return (
    <LiveEditor
      className={S.editor}
      id={id}
      code={code}
      language="typescript"
      theme={app.theme === 'dark' ? vsDark : vsLight}
      onChange={onChange}
    />
  );
}
