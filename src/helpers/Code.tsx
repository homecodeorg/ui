import { Sandpack } from '@codesandbox/sandpack-react';
import sandpackCSS from '!!raw-loader!@codesandbox/sandpack-react/dist/index.css'; // TODO: use Vite instead of Webpack
import helpers from '!!raw-loader!helpers';

const style = document.createElement('style');
style.innerText = sandpackCSS;
document.body.appendChild(style);

const commonFiles = {
  '/helpers.ts': helpers,
};

const customSetup = {
  dependencies: { '@foreverido/uilib': 'latest' },
  entry: '/index.tsx',
  main: '/App.tsx',
};

export default function Code({ files }) {
  return (
    <Sandpack
      template="react-ts"
      files={{ ...commonFiles, ...files }}
      customSetup={customSetup}
      options={{
        showTabs: true,
        openPaths: Object.keys(files),
        initMode: 'user-visible',
      }}
    />
  );
}
