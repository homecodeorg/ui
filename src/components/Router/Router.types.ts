import { ReactNode } from 'react';

export type Props = {
  store?: any;
  // Every child of Router component must have `path` property.
  children: ReactNode;
  // Used in [Link](//components/Link) component to generate correct href for relative paths.
  rootPath?: string;
};
