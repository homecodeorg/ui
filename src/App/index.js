import { render } from 'react';

import App from './App';

let root;

function init() {
  root = render(<App />, document.getElementById('app-root'), root);
}

if (module.hot) {
  module.hot.accept();
  module.hot.accept('./App', () => requestAnimationFrame(init));
}

init();
