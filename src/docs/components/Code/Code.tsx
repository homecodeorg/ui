import { Component, useState, useEffect, useRef } from 'react';
import { useStore } from 'justorm/react';
import cn from 'classnames';
import compare from 'compareq';
import { Scroll, uid, Portal, Button, Icon, LS } from 'uilib';

import FullscreenButton from './FullscreenButton/FullscreenButton';
import Editor from './Editor/Editor';
import Result from './Result/Result';

import S from './Code.styl';
import Background from './Background';

type Props = {
  id: string;
  code: string;
  scope?: object;
};

export const Code = ({ id, scope, code: initialCode }: Props) => {
  const { app, editor } = useStore({ app: [], editor: ['isFullscreen'] });

  const editorId = useRef(`editor-${uid.generateUID()}`);

  const [isBgEnabled, setIsBgEnabled] = useState(
    LS.get('codeBgDisabled') as unknown as boolean
  );
  const [code, setCode] = useState('');

  useEffect(() => {
    setCode(editor.getEditedCode(id) || initialCode);
    editor.scope = scope;
    editor.onChange(editorId.current, code);
    app.updateGradient();
  }, []);

  useEffect(() => {
    editor.scope = scope;
    setCode(editor.getEditedCode(id) || initialCode);
  }, [id, scope]);

  const onColorButtonClick = () => {
    setIsBgEnabled(!isBgEnabled);
    LS.set('codeBgDisabled', !isBgEnabled);
  };

  const isFullscreen = () => editor.isFullscreen;

  const renderContent = content =>
    isFullscreen() ? <Portal>{content}</Portal> : content;

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
        yScrollbarClassName={S.scrollbar}
        offset={{ y: { before: 14, after: 14 } }}
      >
        <Editor id={id} code={code} />
      </Scroll>
      <Result />
      <div className={S.toolbar}>
        <FullscreenButton isFullscreen={isFullscreen()} />
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
