import { ThinkingOutline } from 'uilib';

export default () => (
  <>
    <div className={S.block}>
      <div className={S.subtitle}>Hover (active omitted)</div>
      <div className={S.host}>
        <ThinkingOutline />
        Hover me
      </div>
    </div>

    <div className={S.block}>
      <div className={S.subtitle}>active=true</div>
      <div className={S.host}>
        <ThinkingOutline active />
        Always on
      </div>
    </div>

    <div className={S.block}>
      <div className={S.subtitle}>active=false (hover does nothing)</div>
      <div className={S.host}>
        <ThinkingOutline active={false} />
        Idle — hover stays off
      </div>
    </div>

    <div className={S.block}>
      <div className={S.subtitle}>
        gradients: three colors at speeds 0.6 / 1 / 1.7, one reversed
      </div>
      <div className={S.host}>
        <ThinkingOutline
          active
          gradients={[
            { color: '#7c5cff', speed: 0.6 },
            { color: '#00c2ff', speed: 1, phase: 0.33 },
            { color: '#ff4fa3', speed: 1.7, reverse: true },
          ]}
        />
        Multiple gradients
      </div>
    </div>

    <div className={S.block}>
      <div className={S.subtitle}>thickness=1 · spread=8 (tight)</div>
      <div className={S.host}>
        <ThinkingOutline active thickness={1} spread={8} />
        Thin and tight
      </div>
    </div>

    <div className={S.block}>
      <div className={S.subtitle}>thickness=3 · spread=40 (wide)</div>
      <div className={S.host}>
        <ThinkingOutline active thickness={3} spread={40} />
        Thick and wide
      </div>
    </div>

    <div className={S.block}>
      <div className={S.subtitle}>
        per-gradient thickness / spread overrides
      </div>
      <div className={S.host}>
        <ThinkingOutline
          active
          gradients={[
            { speed: 0.5, thickness: 4, spread: 36 },
            { color: '#ffb020', speed: 2, thickness: 1, spread: 6 },
          ]}
        />
        Slow wide + fast thin
      </div>
    </div>
  </>
);
