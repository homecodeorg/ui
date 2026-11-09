import { Img } from 'uilib';

export default () => (
  <div className={S.row}>
    <div className={S.cell}>
      <Img className={S.img} src="https://picsum.photos/id/10/240/240" />
      <span>Loaded</span>
    </div>
    <div className={S.cell}>
      <Img className={S.img} src="/missing-image.png" alt="Missing image" />
      <span>Failed: default icon</span>
    </div>
    <div className={S.cell}>
      <Img
        className={S.img}
        src="/missing-image.png"
        fallback={<div className={S.custom}>png</div>}
      />
      <span>Failed: custom fallback</span>
    </div>
  </div>
);
