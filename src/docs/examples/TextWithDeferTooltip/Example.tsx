import { TextWithDeferTooltip } from 'uilib';

const LONG_LABEL =
  'This is a long label that should overflow and show a tooltip on hover.';

export default () => (
  <>
    <div className={S.block}>
      <div className={S.subtitle}>Default (single line)</div>
      <div className={S.box}>
        <TextWithDeferTooltip className={S.clamped}>
          {LONG_LABEL}
        </TextWithDeferTooltip>
      </div>
    </div>

    <div className={S.block}>
      <div className={S.subtitle}>Over trigger</div>
      <div className={S.wideBox}>
        <TextWithDeferTooltip className={S.clampedMulti} maxWidth={560} overTrigger>
          {LONG_LABEL} {LONG_LABEL}
        </TextWithDeferTooltip>
      </div>
    </div>

    <div className={S.block}>
      <div className={S.subtitle}>Short text (no tooltip)</div>
      <div className={S.box}>
        <TextWithDeferTooltip className={S.clamped}>Short</TextWithDeferTooltip>
      </div>
    </div>
  </>
);
