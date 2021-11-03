const path = require('path');

const paths = require('./paths');
const rules = require('./rules');
const plugins = require('./plugins');

const config = {
  resolve: {
    modules: [paths.src, 'node_modules'],
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.css', '.styl'],
    alias: {
      src: paths.src,
      theme: `${paths.src}/theme.styl`,
    },
  },
  module: {
    rules,
  },
  plugins: plugins,
  optimization: {
    moduleIds: 'named',
  },
};

module.exports = config;
