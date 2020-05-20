const path = require('path');

const paths = require('./paths');
const rules = require('./rules');
const plugins = require('./plugins');

const config = {
  resolve: {
    modules: [paths.src, 'node_modules'],
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.css'],
    alias: {
      src: paths.src,
      theme: `${paths.src}/theme.styl`,
    },
  },
  module: {
    rules,
  },
  plugins: plugins,
};

module.exports = config;
