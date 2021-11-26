const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const merge = require('webpack-merge');
const path = require('path');
const { src, docs, assets } = require('./paths.js');
const config = require('./webpack.config.js');

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
    entry: [`${src}/App/index.js`],
    output: {
      path: docs,
    },
    plugins: [
      new CopyWebpackPlugin({
        patterns: [
          {
            from: `${assets}/*.css`,
            to: docs,
          },
          {
            from: `${assets}/fonts`,
            to: `${docs}/assets/fonts`,
          },
          {
            from: `${assets}/logo.svg`,
            to: docs,
          },
        ],
      }),
      new HtmlWebpackPlugin({
        // lang: PAGE_LANG,
        // title: PAGE_TITLE,
        baseUrl: isDev ? '/' : '/uilib/',
        filename: 'index.html',
        template: `${assets}/index.html`,
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
