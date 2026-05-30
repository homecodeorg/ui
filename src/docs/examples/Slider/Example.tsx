import { useRef, useState } from 'react';
import { Button, Slider } from 'uilib';

export default () => {
  const [progress, setProgress] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(50);
  const rafRef = useRef();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 400 }}>
      <div>
        <div style={{ marginBottom: 8 }}>Playback (showGhost)</div>
        <Slider
          min={0}
          max={1}
          step={0.001}
          value={progress}
          showGhost
          aria-label="Playback progress"
          onChange={setProgress}
          onPointerDown={() => setPlaying(false)}
        />
        <Button onClick={() => setPlaying(p => !p)} style={{ marginTop: 8 }}>
          {playing ? 'Pause' : 'Play'}
        </Button>
      </div>

      <Slider
        label="Speed"
        min={1}
        max={100}
        step={1}
        value={speed}
        onChange={setSpeed}
        aria-label="Speed"
      />
    </div>
  );
};
