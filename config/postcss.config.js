const postcssPresetEnv = require('postcss-preset-env');
const cssnano = require('cssnano');

const isProduction = process.env.NODE_ENV === 'production';

module.exports = {
  exec: true,
  sourceMap: isProduction ? false : 'inline',
  minimize: isProduction,
  plugins: [
    postcssPresetEnv({
      stage: 3,
    }),
    isProduction &&
      cssnano({
        preset: [
          'default',
          {
            discardComments: {
              removeAll: true,
            },
          },
        ],
      }),
  ],
};
