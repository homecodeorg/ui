import { useCallback } from 'react';
import { withStore } from 'justorm/react';
import { Button, Icon } from 'uilib';

import S from './FullscreenButton.styl';

const FullscreenButton = withStore({
  editor: [],
})(function FullscreenButton({ store: { editor } }) {
  const onKeyDown = useCallback(e => {
    if (e.key === 'Escape') {
      editor.isFullscreen = false;
    }
  }, []);

  const toggleFullscreen = useCallback(() => {
    editor.isFullscreen = !editor.isFullscreen;

    if (editor.isFullscreen) {
      document.addEventListener('keydown', onKeyDown);
    } else {
      document.removeEventListener('keydown', onKeyDown);
    }
  }, []);

  return (
    <Button
      className={S.root}
      onClick={toggleFullscreen}
      variant="clear"
      square
    >
      <Icon type="fullscreen" size="l" />
    </Button>
  );
});

export default FullscreenButton;
