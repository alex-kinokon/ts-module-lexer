#!/usr/bin/env node
const { config } = require('./babel-config');

require('@babel/register')({
  extensions: ['.ts', '.js'],
  ...config,
  plugins: [
    ['@babel/plugin-transform-modules-commonjs', { strict: true }],
    ...config.plugins
  ]
});
