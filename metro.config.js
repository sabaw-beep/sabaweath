// Learn more https://docs.expo.dev/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Fix import.meta error by preferring CommonJS versions
// This tells Metro to use CJS builds instead of ESM (which use import.meta)
config.resolver = {
  ...config.resolver,
  unstable_conditionNames: ['require', 'react-native', 'browser'],
};

module.exports = config;

