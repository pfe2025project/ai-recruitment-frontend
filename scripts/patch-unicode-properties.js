const { existsSync } = require('fs');

(async () => {
  const { sync } = await import('replace-in-file');

  if (existsSync('node_modules/@react-pdf/unicode-properties/package.json')) {
    sync({
      files: 'node_modules/@react-pdf/unicode-properties/package.json',
      from: /dist\/unicode-properties.es.js/g,
      to: 'dist/unicode-properties.esm.js',
    });

    console.log("@react-pdf/unicode-properties - patched!");
  }
})();
