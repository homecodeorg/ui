import { useMemo } from 'react';
import timen from 'timen';
import { LiveProvider, LiveEditor, LiveError, LivePreview } from 'react-live';
import cn from 'classnames';
import * as justorm from 'justorm/react';
import * as uilib from 'uilib';
import * as helpers from 'helpers';

import S from '../Code.styl';

const SCOPE = { uilib, React, justorm, timen, helpers };

const Result = justorm.withStore({
  editor: ['execCode', 'scope'],
})(function Result({ store }) {
  const { execCode, scope } = store.editor.originalObject;
  const currScope = useMemo(() => ({ ...SCOPE, ...scope }), [scope]);

  return (
    <div className={S.editorResult}>
      <LiveProvider noInline code={execCode} scope={currScope}>
        <LiveEditor className={cn(S.editor, S.runtime)} />
        <LiveError className={S.error} />
        <LivePreview className={S.preview} />
      </LiveProvider>
    </div>
  );
});

export default Result;
