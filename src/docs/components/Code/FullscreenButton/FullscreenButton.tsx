import { useCallback } from 'react';
import { withStore } from 'justorm/react';
import { Button, Icon } from 'uilib';
import cn from 'classnames';

import S from './FullscreenButton.styl';

const FullscreenButton = withStore({
  editor: [],
})(function FullscreenButton({ store: { editor }, isFullscreen }) {
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
      className={cn(S.root, isFullscreen && S.fullscreen)}
      onClick={toggleFullscreen}
      variant="clear"
      title="Fullscreen"
      square
    >
      <Icon type="fullscreen" />
    </Button>
  );
});

export default FullscreenButton;
