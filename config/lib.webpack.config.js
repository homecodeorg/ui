const merge = require('webpack-merge');
const path = require('path');
const paths = require('./paths');
const config = require('./webpack.config');

module.exports = (env, argv) => {
  return merge(config, {
    mode: 'production',
    entry: [`${paths.src}/index.ts`],
    output: {
      path: paths.dist,
      filename: 'index.js',
      libraryTarget: 'umd',
      library: '@truerenton/uilib',
    },
    externals: /preact|justorm|lodash|classnames/i,
    // externalsType: 'module',
    experiments: {
      outputModule: true,
    },
    // externals: {
    //   preact: 'commonjs preact',
    //   justorm: 'commonjs justorm',
    //   'lodash.omit': 'commonjs lodash.omit',
    // },
    optimization: {
      // minimize: true,
      usedExports: true,
      innerGraph: true,
      sideEffects: true,
    },
  });
};
