import { camelCase } from "lodash";
import path from 'path';
import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import filesize from 'rollup-plugin-filesize';
import json from 'rollup-plugin-json';
import license from 'rollup-plugin-license';
import resolve from 'rollup-plugin-node-resolve';
import replace from 'rollup-plugin-replace';
import uglify from 'rollup-plugin-uglify';
import vue from 'rollup-plugin-vue';
import { minify } from "uglify-es";
import sourceMaps from 'rollup-plugin-sourcemaps'
import typescript from 'rollup-plugin-typescript2'

import pack from './package.json';

const pkg = require('./package.json')

const projectName = 'vue-diagrams';

// compute globals from dependencies
const globals =
  pack.dependencies &&
  Object.assign(
    {},
    ...Object.keys(pack.dependencies).map(key => ({
      [key]: camelCase(key)
    }))
  );

const builds = {
  // (CommonJS). Used by bundlers e.g. Webpack & Browserify
  cjs: {
    entry: "src/main.ts",
    dest: `dist/${projectName}.common.js`,
    format: "cjs"
  },
  // (ES Modules). Used by bundlers that support ES Modules,
  // e.g. Rollup & Webpack 2
  esm: {
    entry: "src/main.ts",
    dest: `dist/${projectName}.esm.js`,
    format: "es"
  },
  // build (Browser)
  "umd-dev": {
    entry: "src/main.umd.ts",
    dest: `dist/${projectName}.js`,
    format: "umd",
    env: "development"
  },
  // production build (Browser)
  "umd-prod": {
    entry: "src/main.umd.ts",
    dest: `dist/${projectName}.min.js`,
    format: "umd",
    env: "production"
  }
};

function genConfig(name) {
  const opts = builds[name];
  const config = {
    input: opts.entry,
    external: id => pack.dependencies && pack.dependencies[id], // exclude dependencies from build
    plugins: [
      typescript({ useTsconfigDeclarationDir: true, objectHashIgnoreUnknownHack: true, experimentalDecorators: true }),
      vue({ compileTemplate: true, css: true }),
      resolve({
        browser: true,
        jsnext: true,
        preferBuiltins: false,
        extensions: [".ts", ".json", ".vue"]
      }),
      commonjs(),
      json(),
      babel({
        exclude: "node_modules/**",
        runtimeHelpers: true
      }),
      filesize()
    ].concat(opts.plugins || []),
    output: {
      exports: "named",
      file: opts.dest,
      format: opts.format,
      // define globals in window from external dependencies
      globals,
      name: opts.moduleName || projectName
    }
  };

  if (opts.env) {
    config.plugins.push(
      replace({
        "process.env.NODE_ENV": JSON.stringify(opts.env)
      })
    );

    // minify on production targets
    if (opts.env === 'production') {
      config.plugins.push(uglify({}, minify));
    }
  }

  // output a license to builds
  config.plugins.push(
    license({
      sourceMap: true,
      banner: {
        file: path.resolve("LICENSE.md")
      }
    })
  );

  Object.defineProperty(config, "_name", {
    enumerable: false,
    value: name
  });

  return config;
}

const target = process.env.TARGET || "umd-prod";
module.exports = genConfig(target);

/*
export default {
  input: 'src/main.ts',
  output: [
    { file: pkg.main, name: camelCase(projectName), format: 'umd', sourcemap: true },
    { file: pkg.module, format: 'es', sourcemap: true },
  ],
  // Indicate here external modules you don't wanna include in your bundle (i.e.: 'lodash')
  external: [],
  watch: {
    include: 'src/**',
  },
  plugins: [
    // Allow json resolution
    json(),
    // Compile TypeScript files
    typescript({ useTsconfigDeclarationDir: true }),
    // Allow bundling cjs modules (unlike webpack, rollup doesn't understand cjs)
    commonjs(),
    // Allow node_modules resolution, so you can use 'external' to control
    // which external modules to include in the bundle
    // https://github.com/rollup/rollup-plugin-node-resolve#usage
    resolve(),

    // Resolve source maps to the original source
    sourceMaps(),
  ],
};
*/