const webpack = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
// const TerserPlugin = require('terser-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
  .BundleAnalyzerPlugin;
// const BabelMinifyPlugin = require('babel-minify-webpack-plugin');

const isProduction = process.env.NODE_ENV === 'production';

const plugins = [
  new CleanWebpackPlugin(),
  new webpack.ProvidePlugin({
    h: ['preact', 'h'],
  }),
  new MiniCssExtractPlugin({
    filename: isProduction ? '[name].[hash].css' : '[name].css',
    chunkFilename: isProduction ? '[id].[hash].css' : '[id].css',
  }),
];

if (process.env.BUNDLE_ANALYZER) {
  plugins.push(
    new BundleAnalyzerPlugin({
      openAnalyzer: !isProduction,
      reportFilename: !isProduction,
    })
  );
}

module.exports = plugins;
