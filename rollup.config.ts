import fs from 'fs';
import glob from 'glob';
import pick from 'lodash.pick';
// import path from 'path';

// import cleaner from 'rollup-plugin-cleaner';
import del from 'rollup-plugin-delete';
import { uglify } from 'rollup-plugin-uglify';

import externals from 'rollup-plugin-node-externals';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';

import styles from 'rollup-plugin-styles';
// import postcss from 'rollup-plugin-postcss';
// import stylusCssModules from 'rollup-plugin-stylus-css-modules';
// import svg from 'rollup-plugin-svg';
import svgr from '@svgr/rollup';
import json from '@rollup/plugin-json';

// import dts from '@guanghechen/postcss-modules-dts';
import dts from 'rollup-plugin-dts';

// import { babel } from '@rollup/plugin-babel';
import typescript from 'rollup-plugin-typescript2';

import pkg from './package.json';

/* initialize CSS files because of a catch-22 situation:
   https://github.com/rollup/rollup/issues/1404 */
glob.sync('src/**/*.styl').forEach(css => {
  // Use forEach because https://github.com/rollup/rollup/issues/1873
  const definition = `${css}.d.ts`;
  if (!fs.existsSync(definition))
    fs.writeFileSync(
      definition,
      'const mod: { [cls: string]: string }\nexport default mod\n'
    );
});

const external = [
  'react',
  'react-dom',
  'moment',
  'timen',
  'justorm',
  'compareq',
  'classnames',
  'nanoid',
  'lodash.omit',
  'lodash.pick',
];

const { COMPRESS } = process.env;

export default [
  {
    // preserveModules: true,
    input: 'index.ts',
    output: [
      // {
      //   dir: pkg.main,
      //   format: 'cjs',
      //   name: 'uilib',
      //   sourcemap: true,
      //   // exports: 'named',
      // },
      {
        dir: pkg.module,
        format: 'esm',
        // format: 'iife',
        // exports: 'named',
        sourcemap: Boolean(COMPRESS),
        preserveModules: true,
      },
    ],
    external,
    plugins: [
      del({ targets: './dist/*' }),

      externals({ deps: true }),
      resolve(),
      commonjs(),

      json(),

      svgr(),
      styles({ modules: true }),
      // stylusCssModules({ output: 'index.css' }),

      typescript({
        useTsconfigDeclarationDir: true,
        tsconfig: 'tsconfig.json',
      }),
      // postcss({
      //   // minimize: true,
      //   modules: true,
      //   // use: {
      //   //   sass: null,
      //   //   stylus: null,
      //   //   less: null,
      //   // },
      //   // extract: true,
      // }),
      // babel({
      //   babelHelpers: 'bundled',
      //   include: path.resolve('src/components'),
      //   extensions: ['.js', '.ts', '.jsx', '.tsx'],
      // }),

      COMPRESS && uglify(),

      generateLocalLib(),
    ],
  },
  // {
  //   input: 'dist/types/index.d.ts',
  //   output: [{ file: 'dist/index.d.ts', format: 'esm' }],
  //   // external: [/\.css$/],
  //   plugins: [resolve({ extensions: ['.ts', '.js'] }), dts()],
  // },
];

function generateLocalLib() {
  return {
    name: 'generate-local-lib',
    writeBundle: (options, bundle) => {
      const libJSON = Object.entries(bundle).reduce(
        (acc, [path, { code }]) => ({
          ...acc,
          [`/node_modules/@foreverido/uilib/${path}`]: code,
        }),
        {
          '/package.json': JSON.stringify(pkg),
        }
      );

      fs.writeFile('src/docs/localLib.json', JSON.stringify(libJSON), () => {});
    },
  };
}
