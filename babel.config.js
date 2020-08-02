const IS_PROD = ['production'].includes(process.env.NODE_ENV);
const plugins = [
  '@babel/plugin-syntax-dynamic-import',
  'lodash',
  [
    'import',
    {
      libraryName: 'vant',
      libraryDirectory: 'es',
      style: true,
    },
    'vant',
  ],
];

if (IS_PROD) {
  // plugins.push('transform-remove-console');
}

module.exports = {
  presets: [
    [
      '@vue/app',
      {
        polyfills: ['es6.string.includes', 'es6.promise', 'es6.symbol', 'es6.object.assign'],
      },
    ],
  ],
  plugins: plugins,
};
