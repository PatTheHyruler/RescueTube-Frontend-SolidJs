import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import { defineConfig } from 'eslint/config';
import stylistic from '@stylistic/eslint-plugin';
import noRelativeImportPaths from 'eslint-plugin-no-relative-import-paths';
import solid from 'eslint-plugin-solid/configs/typescript';

export default defineConfig([
    {
        files: ['**/*.{js,mjs,cjs,ts}'],
        plugins: { js },
        extends: ['js/recommended'],
    },
    {
        files: ['**/*.{js,mjs,cjs,ts}'],
        languageOptions: { globals: globals.browser },
    },
    tseslint.configs.recommended,
    { ignores: ['dist'] },
    {
        files: ['**/*.{ts,tsx}'],
        ...solid,
    },
    {
        plugins: {
            'no-relative-import-paths': noRelativeImportPaths,
            '@stylistic': stylistic,
        },
        rules: {
            'no-relative-import-paths/no-relative-import-paths': [
                'warn',
                { allowSameFolder: true, rootDir: 'src', prefix: '@' },
            ],
            '@stylistic/object-curly-spacing': ['error', 'always'],
            '@stylistic/comma-dangle': ['error', 'only-multiline'],
            '@stylistic/member-delimiter-style': 'error',
            '@stylistic/semi': ['error', 'always'],
            '@stylistic/no-extra-semi': ['error'],
        },
    },
]);
