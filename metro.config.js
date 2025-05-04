const { withNativeWind: withNativeWind } = require('nativewind/metro');

/* eslint-env node */
const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

module.exports = withNativeWind(config, {
    input: './global.css',
});
