import { Heading, Link } from 'uilib';
import { ComponentLayout, TypesTable } from 'docs/components';

import example from '!!raw-loader!./Example';

const name = 'VideoPlayer';

const Docs = () => (
  <>
    <p>
      Video player with buffering progress, playback controls, fullscreen, and
      keyboard shortcuts. While playing, the control bar slides under the bottom
      edge until hover; the progress scrubber stays visible. Current time and
      volume are persisted via localStorage.{' '}
      <Link inline href="/demo">
        Demo
      </Link>
    </p>

    <Heading id="props" text="Props" />
    <TypesTable scope={name} type="Props" />

    <Heading id="keyboard" text="Keyboard" />
    <ul>
      <li>
        <code>Space</code> — toggle play/pause
      </li>
      <li>
        <code>←</code> / <code>→</code> — seek ±min(5s, 10% duration)
        (100ms debounce)
      </li>
      <li>
        <code>↑</code> / <code>↓</code> — volume ±10% (shows volume popup,
        hides after 300ms)
      </li>
    </ul>

    <Heading id="gestures" text="Gestures" />
    <ul>
      <li>Single click / tap on video — play/pause</li>
      <li>Double-click / double-tap on video — toggle fullscreen</li>
      <li>Hover or focus volume control — vertical volume slider</li>
    </ul>
  </>
);

export default () => (
  <ComponentLayout
    name={name}
    docs={Docs}
    examples={[{ id: 'demo', label: 'Demo', code: example }]}
  />
);
