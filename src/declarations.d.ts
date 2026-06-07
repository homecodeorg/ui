declare module '*.png';
declare module '*.json';
declare module 'lodash.pick';
declare module 'lodash.omit';
declare module 'compareq';
declare module 'timen';
declare module 'nanoid';

declare module 'helpers'; // examples of current component
declare module '/src';

declare module '!!raw-loader!*' {
  const contents: string;
  export default contents;
}

declare module '*.svg' {
  import React from 'react';
  const SVG: React.FC<React.SVGProps<SVGSVGElement>>;
  export default SVG;
}

declare module '*.styl' {
  const content: { [className: string]: string };
  export default content;
}

declare module 'justorm/react' {
  import type React from 'react';

  export type StoreConfig =
    | string
    | string[]
    | Record<string, string[]>
    | Array<string | Record<string, string[]>>;

  export function createStore<T extends Record<string, any>>(
    instance: string | React.Component<any, any>,
    obj: T
  ): T;
  export function useStore<T = Record<string, any>>(config?: StoreConfig): T;
  export function withStore(
    config?: StoreConfig
  ): (
    WrappedComponent: React.FunctionComponent<any>
  ) => React.FunctionComponent<any>;
}
