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
      react: 'preact/compat',
      'react-dom': 'preact/compat',
    },
  },
  module: {
    rules,
  },
  plugins: plugins,
  optimization: {
    moduleIds: 'named',
    minimize: false,
  },
};

module.exports = config;
