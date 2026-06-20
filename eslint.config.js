import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    // Apply rules specifically to your TypeScript and JavaScript source files
    files: ['src/**/*.ts', 'src/**/*.js'],
    languageOptions: {
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      // Disallow all console logs except errors and warnings
      'no-console': ['error', { allow: ['warn', 'error'] }],
      
      // Optional: Add custom TypeScript adjustments here
      '@typescript-eslint/no-unused-vars': 'warn',
    },
  },
  {
    // Tell ESLint to entirely ignore your build and dependency folders
    ignores: ['dist/**', 'node_modules/**'],
  }
);
