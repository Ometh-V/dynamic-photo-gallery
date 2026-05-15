#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const PHOTOS_DIR = path.join(__dirname, 'photos');
const MANIFEST_PATH = path.join(__dirname, 'manifest.json');
const IMAGE_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.gif', '.webp', '.avif', '.svg']);

const files = fs.readdirSync(PHOTOS_DIR).filter(file => {
  const ext = path.extname(file).toLowerCase();
  return IMAGE_EXTENSIONS.has(ext);
}).sort();

const manifest = files.map(file => `photos/${file}`);

fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2) + '\n');

console.log(`manifest.json updated — ${manifest.length} photo(s) found.`);
