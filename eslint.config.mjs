// eslint-config-next v16 ships native flat configs, so the legacy FlatCompat
// bridge is neither needed nor compatible here (it throws on the plugin graph).
import nextCoreWebVitals from 'eslint-config-next/core-web-vitals';
import nextTypescript from 'eslint-config-next/typescript';
import simpleImportSort from 'eslint-plugin-simple-import-sort';

const config = [
  {
    ignores: ['.next/**', 'node_modules/**', 'legacy/**', 'next-env.d.ts', 'public/**'],
  },
  ...nextCoreWebVitals,
  ...nextTypescript,
  {
    plugins: { 'simple-import-sort': simpleImportSort },
    rules: {
      'simple-import-sort/imports': 'warn',
      'simple-import-sort/exports': 'warn',

      // The spec forbids `any`. Surface it as an error, not a warning.
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
    },
  },
];

export default config;
