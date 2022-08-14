import { ReactNode } from 'react';

export type Loader = () => Promise<{ default: ReactNode }>;
export type Props = {
  // Function that returns a Promise which resolves to the content to be lazy loaded.
  loader: Loader;
  // Element that will be rendered while the content is loading.
  progressElem?: ReactNode;
};
export type State = { loading: boolean; spinnerTimeout: boolean };
