const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const { merge } = require('webpack-merge');
const paths = require('./paths.js');
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
    entry: [`${paths.src}/App/index.js`],
    output: {
      path: paths.docs,
    },
    resolve: {
      modules: ['node_modules', paths.src],
      alias: {
        uilib: paths.src,
        'docs/helpers': `${paths.docs}/helpers`,
        theme: `${paths.src}/theme.styl`,
      },
    },
    plugins: [
      new webpack.DefinePlugin({
        isDEV: JSON.stringify(isDev),
      }),
      new CopyWebpackPlugin({
        patterns: [
          {
            from: `${paths.assets}/*.css`,
            to: paths.docs,
          },
          {
            from: `${paths.assets}/fonts`,
            to: `${paths.docs}/assets/fonts`,
          },
          {
            from: `${paths.assets}/logo.svg`,
            to: paths.docs,
          },
        ],
      }),
      new HtmlWebpackPlugin({
        // lang: PAGE_LANG,
        // title: PAGE_TITLE,
        baseUrl: isDev ? '/' : '/uilib/',
        // filename: 'index.html',
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
