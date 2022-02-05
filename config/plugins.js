const { ProvidePlugin } = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

const isProduction = process.env.NODE_ENV === 'production';

const plugins = [
  new CleanWebpackPlugin(),
  new ProvidePlugin({
    React: 'react',
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
