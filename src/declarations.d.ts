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
