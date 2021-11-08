const fs = require('fs');
const path = require('path');

const APP_PATH = fs.realpathSync(process.cwd());

function resolvePath(relativePath) {
  return path.resolve(APP_PATH, relativePath);
}

module.exports = {
  config: resolvePath('config'),
  src: resolvePath('src'),
  server: resolvePath('server'),
  docs: resolvePath('docs'),
  dist: resolvePath('dist'),
  assets: resolvePath('assets'),
  modules: resolvePath('node_modules'),
};
