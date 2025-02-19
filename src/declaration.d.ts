declare module '*.png';
declare module '*.svg';
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
