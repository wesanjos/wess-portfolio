const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

// These are the packages already present before the Kanpai implementation.
const existing = new Set(['datocms-structured-text-utils', 'gsap', 'loadsh', 'lodash', 'next', 'react', 'react-datocms', 'react-dom', 'sass']);
const manifest = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'package.json'), 'utf8'));
const added = Object.keys(manifest.dependencies).filter((name) => !existing.has(name));
assert.deepEqual(added, [], `Dependências novas: ${added.join(', ')}`);

const existingDev = new Set(['eslint', 'eslint-config-airbnb', 'eslint-config-next', 'eslint-config-prettier', 'eslint-plugin-import', 'eslint-plugin-jsx-a11y', 'eslint-plugin-react', 'eslint-plugin-react-hooks', 'prettier', '@playwright/test']);
const addedDev = Object.keys(manifest.devDependencies).filter((name) => !existingDev.has(name));
assert.deepEqual(addedDev, [], `Dependências de desenvolvimento novas: ${addedDev.join(', ')}`);
