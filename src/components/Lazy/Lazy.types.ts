import type { ReactNode } from 'react';
import type { Size } from 'uilib/types';

export type Loader = () => Promise<{ default: ReactNode }>;
export type Props = {
  // Function that returns a Promise which resolves to the content to be lazy loaded.
  loader: Loader;
  // Size of the Spinner
  size?: Size;
  // Element that will be rendered while the content is loading.
  progressElem?: ReactNode;
  // Whether to hide the Spinner while the content is loading.
  hideSpinner?: boolean;
};
export type State = { loading: boolean; spinnerTimeout: boolean };
