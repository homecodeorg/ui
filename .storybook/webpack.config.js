const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const srcPath = path.resolve(__dirname, '../src');
const assetsPath = path.resolve(__dirname, '../assets');
const buildPath = path.resolve(__dirname, '../build');
const modulesPath = path.resolve(__dirname, '../node_modules');

const isProduction = process.env.NODE_ENV === 'production';

module.exports = ({ config }) => {
  const svgLoaderRule = config.module.rules.find(rule =>
    rule.test.test('.svg')
  );

  svgLoaderRule.test = new RegExp(
    svgLoaderRule.test.toString().replace(/svg\|/, '')
  );

  return merge(config, {
    resolve: {
      modules: [srcPath, 'node_modules'],
      extensions: ['.js', '.jsx', '.ts', '.tsx', '.css'],
      alias: {
        src: srcPath,
      },
    },
    module: {
      rules: [
        {
          test: /\m.stories\.tsx$/,
          enforce: 'pre',
          loaders: [
            {
              loader: require.resolve('@storybook/addon-storysource/loader'),
              options: {
                parser: 'typescript',
                exclude: /\.stories\.tsx$/,
              },
            },
          ],
        },
        {
          test: /\.(j|t)sx?$/,
          loader: 'babel-loader',
          include: srcPath,
          exclude: modulesPath,
        },
        {
          test: /\.styl$/,
          use: [
            'style-loader',
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
                config: {
                  path: path.resolve(__dirname, './postcss.config.js'),
                },
              },
            },
            {
              loader: 'stylus-loader',
              options: {
                preferPathResolver: 'webpack',
              },
            },
          ],
        },
        {
          test: /\.svg$/,
          exclude: modulesPath,
          oneOf: [
            {
              issuer: /\.(j|t)sx?$/,
              use: [
                {
                  loader: 'babel-loader',
                },
                {
                  loader: 'preact-svg-loader',
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
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NamedModulesPlugin(),
      new CleanWebpackPlugin(),
      new webpack.ProvidePlugin({
        h: ['preact', 'h'],
      }),
      new CopyWebpackPlugin([
        {
          from: `${assetsPath}/*.css`,
          to: './',
        },
        {
          from: `${assetsPath}/fonts`,
          to: './fonts',
        },
        {
          from: `${assetsPath}/logo.svg`,
          to: './',
        },
      ]),
      new MiniCssExtractPlugin({
        filename: isProduction ? '[name].[hash].css' : '[name].css',
        chunkFilename: isProduction ? '[id].[hash].css' : '[id].css',
      }),
    ],
  });
};
