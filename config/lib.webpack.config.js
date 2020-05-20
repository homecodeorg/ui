const path = require('path');
const paths = require('./paths');
const config = require('./webpack.config');

module.exports = (env, argv) => {
  return Object.assign(config, {
    entry: [`${paths.src}/index.ts`],
    output: {
      path: paths.dist,
      filename: 'index.js',
      libraryTarget: 'umd',
      library: 'ui-components',
    },
    externals: {
      preact: 'commonjs2 preact',
      justorm: 'commonjs2 justorm',
    },
    optimization: {
      usedExports: true,
    },
  });
};
