import { TextShimmer } from 'uilib';

export default () => (
  <>
    <div className={S.block}>
      <div className={S.subtitle}>Default</div>
      <TextShimmer>Loading suggestion…</TextShimmer>
    </div>

    <div className={S.block}>
      <div className={S.subtitle}>Slow</div>
      <TextShimmer duration={5}>
        Preparing workspace
      </TextShimmer>
    </div>

    <div className={S.block}>
      <div className={S.subtitle}>active=false</div>
      <TextShimmer active={false}>Plain text when idle</TextShimmer>
    </div>
  </>
);
