import type { ReactNode, ComponentType } from 'react';
import type { Size } from 'uilib/types';

export type ImportData = Record<string, any>;

export type Loader = () => Promise<ImportData>;
type RenderFunction = (importData: ImportData) => ReactNode;
export type Props = {
  // Function that returns a Promise which resolves to the content to be lazy loaded.
  loader: Loader;
  // Function that will be called with the loaded node (same as children).
  render?: RenderFunction;
  // Children that will be rendered.
  children?: ReactNode | RenderFunction;
  // Timeout for the Spinner.
  spinnerTimeout?: number;
  // Size of the Spinner
  size?: Size;
  // Element that will be rendered while the content is loading.
  progressElem?: ReactNode;
  // Whether to hide the Spinner while the content is loading.
  hideSpinner?: boolean;
};
export type State = { loading: boolean; spinnerTimeout: boolean };
