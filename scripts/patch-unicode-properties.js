// scripts/patch-unicode-properties.js
import { existsSync } from 'fs';
import { sync } from 'replace-in-file';

if (existsSync('node_modules/@react-pdf/unicode-properties/package.json')) {
    sync({
        files: 'node_modules/@react-pdf/unicode-properties/package.json',
        from: /dist\/unicode-properties.es.js/g,
        to: 'dist/unicode-properties.esm.js',
    });

    console.log("@react-pdf/unicode-properties - patched!");
}