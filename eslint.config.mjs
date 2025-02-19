import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';
import pluginReact from 'eslint-plugin-react';
import pluginPrettier from 'eslint-plugin-prettier';
import prettierConfig from 'eslint-config-prettier';

/** @type {import('eslint').Linter.Config[]} */
export default [
  { files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'] },
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
  {
    'react/react-in-jsx-scope': 'off',
  },
  // Prettierの設定
  pluginPrettier.configs.recommended, // Prettierの推奨設定を適用
  prettierConfig, // ESLintとPrettierの競合を避ける設定
  {
    // Prettierルールをエラーとして扱う
    'prettier/prettier': 'error',
  },
];
