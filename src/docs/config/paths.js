const { realpathSync } = require('fs');
const { resolve } = require('path');

const APP_PATH = realpathSync(process.cwd());

function resolvePath(relativePath) {
  return resolve(APP_PATH, relativePath);
}

module.exports = {
  config: resolvePath('src/docs/config'),
  src: resolvePath('src'),
  docs: resolvePath('src/docs'),
  assets: resolvePath('assets'),
  build: resolvePath('build'),
  buildAssets: resolvePath('build/assets'),
  modules: resolvePath('node_modules'),
};
