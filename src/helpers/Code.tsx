import { Sandpack } from '@codesandbox/sandpack-react';
// import 'style-loader!@codesandbox/sandpack-react/dist/index.css';

export function Code({ files }) {
  return (
    <Sandpack
      template="react-ts"
      files={files}
      options={{ initMode: 'user-visible' }}
      // customSetup={{ entry: '/index.tsx', main: '/index.tsx' }}
    />
  );
}
