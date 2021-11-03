const path = require('path');
const paths = require('./paths');

module.exports = [
  {
    test: /\.(j|t)sx?$/,
    loader: 'babel-loader',
    include: paths.src,
    // exclude: paths.modules,
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
