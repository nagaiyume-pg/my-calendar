import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';
import pluginReact from 'eslint-plugin-react';
import pluginPrettier from 'eslint-plugin-prettier';
import prettierConfig from 'eslint-config-prettier';

/** @type {import('eslint').Linter.Config[]} */
export default [
  // 対象ファイル
  { files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'] },

  // グローバル設定
  { languageOptions: { globals: globals.browser } },

  // eslint:recommended 設定の手動適用
  {
    rules: {
      ...pluginJs.configs.recommended.rules,
    },
  },

  // TypeScript関連の設定
  {
    rules: {
      ...tseslint.configs.recommended.rules,
    },
  },

  // react/recommended 設定の手動適用
  {
    rules: {
      ...pluginReact.configs.recommended.rules,
    },
  },

  // Prettier設定
  pluginPrettier.configs.recommended, // Prettierの推奨設定を適用
  prettierConfig, // ESLintとPrettierの競合を避ける設定

  // Prettierルールをエラーとして扱う
  {
    rules: {
      'prettier/prettier': 'error',
    },
  },
];
