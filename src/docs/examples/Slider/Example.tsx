import { useRef, useState } from 'react';
import { Button, Slider } from 'uilib';

export default () => {
  const [progress, setProgress] = useState(0.35);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(50);
  const rafRef = useRef();

  const timelineMarkers = [
    { key: 'start', value: 0, label: 'Start' },
    { key: 'mid', value: 0.5, label: 'Midpoint' },
    { key: 'end', value: 1, label: 'End' },
  ];

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 24,
        maxWidth: 400,
      }}
    >
      <div>
        <div style={{ marginBottom: 8 }}>Playback (showGhost + markers)</div>
        <Slider
          min={0}
          max={1}
          step={0.001}
          value={progress}
          showGhost
          markers={timelineMarkers}
          aria-label="Playback progress"
          onChange={setProgress}
          onMarkerClick={setProgress}
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
