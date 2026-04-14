import { useCallback } from 'react';
import { LiveEditor } from 'react-live';

import vsDark from 'prism-react-renderer/themes/vsDark';
import vsLight from 'prism-react-renderer/themes/vsLight';

import { useTheme } from 'uilib';

import S from '../Code.styl';
import STORE from '../store';

export default function Editor({ id, code }) {
  const { theme } = useTheme();

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
      theme={theme === 'dark' ? vsDark : vsLight}
      onChange={onChange}
    />
  );
}
