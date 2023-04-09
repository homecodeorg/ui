import { Component, FC, ReactNode } from 'react';

type AnyProps = Record<string, any>;
type ComponentType = FC<AnyProps> | typeof Component<AnyProps>;

export type RedirectProps = {
  to: string;
};

export type RouteProps = {
  path: string;
  component: ComponentType;
  exact?: boolean;
} & Partial<RedirectProps>;

export type Props = {
  store?: any;
  // Every child of Router component must have `path` property.
  children: ReactNode;
  // Used in [Link](//components/Link) component to generate correct href for relative paths.
  basePath?: string;
  // Render first matched route.
  single?: boolean;
};
