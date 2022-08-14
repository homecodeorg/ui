import { createRequire } from 'module';
const require = createRequire(import.meta.url);

import webpack from 'webpack';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import HtmlWebpackPartialsPlugin from 'html-webpack-partials-plugin';
import ReactRefreshPlugin from '@pmmmwh/react-refresh-webpack-plugin';

// @ts-ignore
import pkg from '../../../package.json' assert { type: 'json' };
import paths from './paths.ts';

export default (env, argv) => {
  const isDev = argv.mode === 'development';
  const config = {
    entry: [paths.docs],
    output: {
      path: paths.build,
    },

    resolve: {
      modules: [paths.src, paths.docs, 'node_modules'],
      extensions: ['.js', '.ts', '.tsx', '.styl'],
      alias: {
        'docs/components': `${paths.docs}/components`,
        uilib: paths.src,
        theme: `${paths.src}/theme.styl`,
      },
    },

    optimization: {
      moduleIds: 'named',
      minimize: false,
    },

    module: {
      rules: [
        {
          test: /\.tsx?$/,
          loader: 'babel-loader',
          include: [paths.src, paths.docs],
          // exclude: paths.modules,
          options: {
            plugins: [isDev && require.resolve('react-refresh/babel')].filter(
              Boolean
            ),
          },
        },
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader'],
        },
        {
          test: /\.styl$/,
          use: [
            'style-loader',
            { loader: 'css-modules-typescript-loader' },
            {
              loader: 'css-loader',
              options: {
                modules: {
                  localIdentName: '[name]__[local]___[hash:base64:5]',
                },
              },
            },
            {
              loader: 'postcss-loader',
              options: {
                postcssOptions: {
                  ident: 'postcss',
                  plugins: [
                    ['postcss-preset-env', { stage: 3, autoprefixer: true }],
                  ],
                },
              },
            },
            {
              loader: 'stylus-loader',
            },
          ],
        },
        {
          test: /\.svg$/,
          exclude: paths.modules,
          oneOf: [
            {
              issuer: /\.(t|j)sx?$/,
              use: [
                {
                  loader: 'babel-loader',
                },
                {
                  loader: 'react-svg-loader',
                },
              ],
            },
            {
              loader: 'file-loader',
              options: {
                name: 'static/[name].[ext]',
                outputPath: 'images/',
              },
            },
          ],
        },
        {
          test: /\.(woff|woff2|eot|ttf)$/,
          use: {
            loader: 'file-loader',
            options: {
              name: 'static/[name].[ext]',
              outputPath: 'images/',
            },
          },
        },
      ],
    },

    plugins: [
      isDev && new ReactRefreshPlugin(),

      new CleanWebpackPlugin(),

      new webpack.ProvidePlugin({
        React: 'react',
      }),

      new webpack.DefinePlugin({
        isDEV: JSON.stringify(isDev),
        VERSION: JSON.stringify(pkg.version),
      }),

      new CopyWebpackPlugin({
        patterns: [
          {
            from: `${paths.assets}/*.css`,
            to: paths.build,
          },
          {
            from: `${paths.assets}/fonts`,
            to: `${paths.build}/assets/fonts`,
          },
          {
            from: `${paths.assets}/logo.svg`,
            to: paths.build,
          },
        ],
      }),

      !isDev &&
        new HtmlWebpackPartialsPlugin({
          path: `${paths.assets}/analytics.html`,
          location: 'body',
          priority: 'low',
        }),

      new HtmlWebpackPlugin({
        // lang: PAGE_LANG,
        // title: PAGE_TITLE,
        baseUrl: '/',
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

      new MiniCssExtractPlugin({
        filename: isDev ? '[name].css' : '[name].[hash].css',
        chunkFilename: isDev ? '[id].css' : '[id].[hash].css',
      }),
    ].filter(Boolean),
  };

  if (isDev) {
    Object.assign(config, {
      devtool: 'source-map',
      devServer: {
        hot: true,
        port: 8181,
        historyApiFallback: true,
        // open: true,
      },
    });
  }

  return config;
};
