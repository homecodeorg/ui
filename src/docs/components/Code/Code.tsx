import { useState, useEffect, useRef, useCallback } from 'react';
import { useStore } from 'justorm/react';
import cn from 'classnames';
import { Scroll, Portal, Button, Icon, LS } from 'uilib';

import FullscreenButton from './FullscreenButton/FullscreenButton';
import Editor from './Editor/Editor';
import Result from './Result/Result';
import STORE from './store';

import S from './Code.styl';
import Background from './Background';

type Props = {
  id: string;
  code: string;
  scope?: object;
};

function readStoredEdit(id: string, initialCode: string) {
  const stored = STORE.getEditedCode(id);
  if (
    typeof stored === 'string' &&
    stored.length > 0 &&
    stored !== initialCode
  ) {
    return stored;
  }
  return '';
}

export const Code = ({ id, scope, code: initialCode }: Props) => {
  const { app, editor } = useStore({ app: [], editor: ['isFullscreen'] });

  const [isBgEnabled, setIsBgEnabled] = useState(
    LS.get('codeBgDisabled') as unknown as boolean
  );
  const [showLineNumbers, setShowLineNumbers] = useState(
    Boolean(LS.get('codeEditorLineNumbers'))
  );
  const [code, setCode] = useState('');
  const [editedCode, setEditedCode] = useState('');
  const [showEdited, setShowEdited] = useState(false);

  // Skip clearing stored edits when code is set programmatically (toggle / init).
  const skipInitialRevertClearRef = useRef(false);

  useEffect(() => {
    const stored = readStoredEdit(id, initialCode);
    STORE.scope = scope;
    skipInitialRevertClearRef.current = true;

    if (stored) {
      setEditedCode(stored);
      setShowEdited(true);
      setCode(stored);
      STORE.setActiveCode(stored);
    } else {
      setEditedCode('');
      setShowEdited(false);
      setCode(initialCode);
      STORE.setActiveCode(initialCode);
    }
  }, [id, scope, initialCode]);

  useEffect(() => {
    app.updateGradient();
  }, []);

  const onEditorChange = useCallback(
    (next: string) => {
      if (next === initialCode) {
        setCode(next);
        STORE.setActiveCode(next);
        if (!skipInitialRevertClearRef.current) {
          setEditedCode('');
          setShowEdited(false);
          STORE.clearEditedCode(id);
        }
        skipInitialRevertClearRef.current = false;
        return;
      }

      skipInitialRevertClearRef.current = false;

      // Any edit of the original (or further edits) replaces the stored version
      setCode(next);
      setEditedCode(next);
      setShowEdited(true);
      STORE.onChange(id, next);
    },
    [id, initialCode]
  );

  const onToggleEdited = () => {
    skipInitialRevertClearRef.current = true;

    if (showEdited) {
      setShowEdited(false);
      setCode(initialCode);
      STORE.setActiveCode(initialCode);
      return;
    }

    setShowEdited(true);
    setCode(editedCode);
    STORE.setActiveCode(editedCode);
  };

  const onColorButtonClick = () => {
    setIsBgEnabled(!isBgEnabled);
    LS.set('codeBgDisabled', !isBgEnabled);
  };

  const onLineNumbersClick = () => {
    const next = !showLineNumbers;
    setShowLineNumbers(next);
    LS.set('codeEditorLineNumbers', next);
  };

  const isFullscreen = () => editor.isFullscreen;

  const renderContent = content =>
    isFullscreen() ? <Portal>{content}</Portal> : content;

  const hasEdited = Boolean(editedCode) && editedCode !== initialCode;

  return renderContent(
    <div
      className={cn(
        S.root,
        isFullscreen() && S.fullscreen,
        isBgEnabled && S.colorBg
      )}
      key="code"
    >
      {isBgEnabled && <Background />}
      <Scroll
        y
        fadeSize="m"
        className={S.editorContainer}
        offset={{ y: { before: 14, after: 14 } }}
      >
        <Editor
          id={id}
          code={code}
          showLineNumbers={showLineNumbers}
          onChange={onEditorChange}
        />
      </Scroll>
      <Result />
      <div className={S.toolbar}>
        {hasEdited && (
          <Button
            onClick={onToggleEdited}
            className={S.editedButton}
            title={showEdited ? 'Show original code' : 'Show edited code'}
            aria-label={showEdited ? 'Show original code' : 'Show edited code'}
            aria-pressed={showEdited}
          >
            <Icon type="edit" />
          </Button>
        )}
        <FullscreenButton isFullscreen={isFullscreen()} />
        <Button
          onClick={onLineNumbersClick}
          className={S.lineNumbersButton}
          title="Toggle line numbers"
          aria-label="Toggle line numbers"
          aria-pressed={showLineNumbers}
        >
          <Icon type="table" />
        </Button>
        <Button
          onClick={onColorButtonClick}
          className={S.colorButton}
          title="Toggle background color"
        >
          <Icon type="colors" />
        </Button>
      </div>
    </div>
  );
};
