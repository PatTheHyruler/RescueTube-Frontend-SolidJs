import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import { defineConfig } from 'eslint/config';
import noRelativeImportPaths from 'eslint-plugin-no-relative-import-paths';

export default defineConfig([
    { files: ['**/*.{js,mjs,cjs,ts}'], plugins: { js }, extends: ['js/recommended'] },
    { files: ['**/*.{js,mjs,cjs,ts}'], languageOptions: { globals: globals.browser } },
    tseslint.configs.recommended,
    { ignores: ['dist'] },
    {
        plugins: {
            'no-relative-import-paths': noRelativeImportPaths,
        },
        rules: {
            'no-relative-import-paths/no-relative-import-paths': [
                'warn',
                { allowSameFolder: true, rootDir: 'src', prefix: '@' },
            ],
        },
    },
]);
