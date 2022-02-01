declare module '*.png';
declare module '*.svg';
declare module '*.json';
declare module 'justorm/react';
declare module 'lodash.pick';
declare module 'lodash.omit';
declare module 'compareq';
declare module 'timen';
declare module 'nanoid';
declare module '!!raw-loader!*' {
  const contents: string;
  export default contents;
}

// to remove warnings from examples:
declare module '@foreverido/uilib' {
  const contents: object; // TODO: use types from `/dist/types`
  export default contents;
}
