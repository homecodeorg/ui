const path = require('path');
const paths = require('./paths');

module.exports = [
  {
    test: /\.(j|t)sx?$/,
    loader: 'babel-loader',
    include: paths.src,
    exclude: paths.modules,
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
    exclude: paths.modules,
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
];
