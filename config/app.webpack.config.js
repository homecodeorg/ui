const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const merge = require('webpack-merge');
const path = require('path');
const paths = require('./paths');
const config = require('./webpack.config');

module.exports = (env, argv) => {
  const isDev = argv.mode === 'development';

  if (isDev) {
    Object.assign(config, {
      devtool: 'source-map',
      devServer: {
        hot: true,
        port: 8181,
        historyApiFallback: true,
        open: true,
      },
    });
  }

  return merge(config, {
    entry: [`${paths.src}/App/index.js`],
    output: {
      path: paths.build,
    },
    plugins: [
      new CopyWebpackPlugin({
        patterns: [
          {
            from: `${paths.assets}/*.css`,
            to: paths.build,
          },
          {
            from: `${paths.assets}/fonts`,
            to: `${paths.build}/fonts`,
          },
          {
            from: `${paths.assets}/logo.svg`,
            to: paths.build,
          },
        ],
      }),
      new HtmlWebpackPlugin({
        // lang: PAGE_LANG,
        // title: PAGE_TITLE,
        filename: 'index.html',
        template: `${paths.assets}/index.html`,
        minify: {
          removeComments: true,
          collapseWhitespace: true,
          removeRedundantAttributes: true,
          useShortDoctype: true,
          removeEmptyAttributes: true,
          removeStyleLinkTypeAttributes: true,
          keepClosingSlash: true,
          minifyJS: true,
          minifyCSS: true,
          minifyURLs: true,
        },
      }),
    ],
  });
};
