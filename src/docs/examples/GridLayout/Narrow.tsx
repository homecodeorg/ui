import { GridLayout } from 'uilib';

// colWidth is 180px

export default () => (
  <GridLayout colWidth={180} gap="var(--p-4)">
    <p className={S.tile}>Narrow 1</p>
    <p className={S.tile}>Narrow 2</p>
    <p className={S.tile}>Narrow 3</p>
    <p className={S.tile}>Narrow 4</p>
    <p className={S.tile}>Narrow 5</p>
  </GridLayout>
);
