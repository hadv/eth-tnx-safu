// eslint.config.js
const js = require('@eslint/js');
const ts = require('@typescript-eslint/eslint-plugin');
const tsParser = require('@typescript-eslint/parser');

module.exports = [
  // Configuration for ESLint config file itself
  {
    files: ['eslint.config.js'],
    languageOptions: {
      globals: {
        require: 'readonly',  // Define require for Node.js
        module: 'writable',   // Define module for CommonJS exports
      },
    },
  },

  // Base JavaScript configuration for other JS files
  js.configs.recommended,

  // TypeScript-specific configuration
  {
    files: ['*.ts'],
    languageOptions: {
      parser: tsParser,
      sourceType: 'module',
      globals: {
        console: 'readonly', // Define console for Node.js
      },
    },
    plugins: {
      '@typescript-eslint': ts,
    },
    rules: {
      ...ts.configs.recommended.rules,
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': ['warn'],
      'no-undef': 'error',
    },
  },

  // Jest-specific configuration for test files
  {
    files: ['*.test.ts'],
    languageOptions: {
      parser: tsParser,
      sourceType: 'module',
      globals: {
        describe: 'readonly',
        it: 'readonly',
        expect: 'readonly',
      },
    },
    rules: {
      ...ts.configs.recommended.rules,
    },
  },

  // Node.js-specific configuration for other JS config files (e.g., jest.config.js)
  {
    files: ['*.js'],
    languageOptions: {
      globals: {
        require: 'readonly',
        module: 'writable',
      },
    },
  },

  // Ignore certain files
  {
    ignores: ['node_modules/', 'dist/'],
  },
];