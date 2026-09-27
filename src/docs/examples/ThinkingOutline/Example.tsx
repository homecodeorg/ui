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
  </>
);
