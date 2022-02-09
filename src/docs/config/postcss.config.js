import postcssPresetEnv from 'postcss-preset-env';
import cssnano from 'cssnano';

const isProduction = process.env.NODE_ENV === 'production';

export const exec = true;
export const sourceMap = isProduction ? false : 'inline';
export const minimize = isProduction;
export const plugins = [
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
];
