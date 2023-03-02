// NOTE: Example simulate low network speed
import { Lazy } from 'uilib';

export default () => (
  <Lazy loader={LazyComponentExample} progressElem="Loading..." />
);
