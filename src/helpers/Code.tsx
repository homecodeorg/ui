import pkg from '/package.json';
import { Sandpack } from '@codesandbox/sandpack-react';
import sandpackCSS from '!!raw-loader!@codesandbox/sandpack-react/dist/index.css';
import helpers from '!!raw-loader!helpers';

import localLib from 'src/localLib.json';

const style = document.createElement('style');
style.innerText = sandpackCSS;
document.body.appendChild(style);

const indexFile = `
import React from 'react';
import ReactDOM from 'react-dom';

import App from './App';
ReactDOM.render(<App />, document.getElementById('root'));
`;

const commonFiles = {
  '/index.tsx': indexFile,
  '/helpers.ts': helpers,
};

const customSetup = {
  dependencies: {
    classnames: pkg.dependencies.classname,
  },
  entry: '/index.tsx',
  main: '/App.tsx',
};

if (isDEV) {
  Object.assign(commonFiles, localLib);
} else {
  customSetup.dependencies['@foreverido/uilib'] = pkg.version;
}

('./node_modules/@foreverido/uilib');

type Files = {
  [name: string]: string;
};

function prepareFiles(files: Files) {
  if (!isDEV) return files;

  return Object.entries(files).reduce(
    (acc, [path, content]) => ({
      ...acc,
      [path]: content.replace(
        '@foreverido/uilib',
        '/node_modules/@foreverido/uilib'
      ),
    }),
    {}
  );
}

export default function Code({ files }) {
  return (
    <Sandpack
      theme="dark"
      template="react-ts"
      files={{ ...commonFiles, ...prepareFiles(files) }}
      customSetup={customSetup}
      options={{
        showTabs: true,
        openPaths: Object.keys(files),
        initMode: 'user-visible',
      }}
    />
  );
}
