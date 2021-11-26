import fs from 'fs';
import glob from 'glob';
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

export default {
  // preserveModules: true,
  input: 'index.ts',
  output: [
    // {
    //   dir: pkg.main,
    //   format: 'cjs',
    //   // exports: 'named',
    // },
    {
      dir: pkg.module,
      format: 'es',
      // format: 'iife',
      // exports: 'named',
      preserveModules: true,
    },
  ],
  external: [
    'react',
    'react',
    'timen',
    'justorm',
    'compareq',
    'classnames',
    'nanoid',
    'lodash.omit',
    'lodash.pick',
  ],
  plugins: [
    del({ targets: './lib/*' }),

    externals({ deps: true }),
    resolve(),
    commonjs(),

    svgr(),
    styles({ modules: true }),
    // stylusCssModules({ output: 'index.css' }),
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

    typescript({
      useTsconfigDeclarationDir: true,
      tsconfig: 'tsconfig.json',
    }),
    // babel({
    //   babelHelpers: 'bundled',
    //   include: path.resolve('src/components'),
    //   extensions: ['.js', '.ts', '.jsx', '.tsx'],
    // }),
    uglify(),
  ],
};
