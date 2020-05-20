import { render } from 'preact';

import App from 'components/App/App';

let root;

function init() {
  root = render(<App />, document.getElementById('app-root'), root);
}

if (module.hot) {
  module.hot.accept();
  module.hot.accept('components/App/App', () => requestAnimationFrame(init));
}

init();
