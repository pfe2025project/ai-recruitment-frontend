const { existsSync } = require('fs');
const replace = require('replace-in-file');

if (existsSync('node_modules/@react-pdf/unicode-properties/package.json')) {
  try {
    const results = replace.sync({
      files: 'node_modules/@react-pdf/unicode-properties/package.json',
      from: /dist\/unicode-properties\.es\.js/g,
      to: 'dist/unicode-properties.esm.js',
    });
    console.log('@react-pdf/unicode-properties - patched!', results);
  } catch (error) {
    console.error('Error patching unicode-properties:', error);
  }
}
