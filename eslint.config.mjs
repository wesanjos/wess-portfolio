import nextVitals from 'eslint-config-next/core-web-vitals';
import importPlugin from 'eslint-plugin-import';

export default [
  ...nextVitals,
  {
    ignores: ['.next/**', 'out/**', 'build/**', 'node_modules/**'],
  },
  {
    files: ['**/*.{js,jsx,mjs}'],
    plugins: { import: importPlugin },
    settings: {
      'import/resolver': { node: { extensions: ['.js', '.jsx', '.mjs'] } },
    },
    rules: {
      'import/no-unresolved': 'error',
      'no-unused-vars': 'error',
    },
  },
];
