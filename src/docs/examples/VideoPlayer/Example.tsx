import { VideoPlayer } from 'uilib';

const DEMO_SRC =
  'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.webm';

export default () => (
  <div style={{ maxWidth: 720 }}>
    <VideoPlayer src={DEMO_SRC} storageKey="docs:VideoPlayer:flower" />
    <p style={{ marginTop: 12, opacity: 0.75, fontSize: 13 }}>
      Click — play/pause. Double-click/tap — fullscreen. Hover volume for
      vertical slider; ↑/↓ also opens it (hides after 300ms). Space /
      ←→ seek / ↑↓ volume. Playing hides controls until hover.
    </p>
  </div>
);
