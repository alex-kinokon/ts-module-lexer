#!/usr/bin/env node
// @ts-check
import fs from 'fs';
import assert from 'assert';
import babel from '@babel/core';
import esbuild from 'esbuild';
import { config } from './babel-config.js';

const res = babel.transformFileSync('lexer.ts', config);
assert(res?.code != null);
fs.writeFileSync('lexer.js', res.code);

const files = fs
  .readdirSync('test/samples')
  .map(f => `test/samples/${f}`)
  .filter(x => x.endsWith('.js'))
  .map(file => {
    const source = fs.readFileSync(file);
    return {
      file,
      code: source.toString(),
      size: source.byteLength
    };
  });

esbuild.buildSync({
  stdin: {
    contents: `
      import { parse } from './lexer.js';

      const files = ${JSON.stringify(files)};

      Object.assign(globalThis, { parse, files });
    `,
    resolveDir: process.cwd()
  },
  bundle: true,
  outfile: './profile.js',
  target: 'esnext',
  platform: 'browser',
  format: 'cjs'
});
