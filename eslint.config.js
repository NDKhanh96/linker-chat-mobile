// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');
const eslintPluginPrettierRecommended = require('eslint-plugin-prettier/recommended');

module.exports = defineConfig([
    ...expoConfig,
    eslintPluginPrettierRecommended,
    {
        ignores: ['dist/*', '/.expo', 'node_modules/*'],
        files: ['**/*.ts', '**/*.tsx'],
        languageOptions: {
            parserOptions: {
                project: true,
                tsconfigRootDir: process.cwd(),
            },
        },
        rules: {
            'prettier/prettier': 'error',
            'no-console': ['warn', { allow: ['warn', 'error', 'clear'] }],
            'no-debugger': 'error',
            'no-dupe-keys': 'error',
            'no-duplicate-case': 'error',
            'no-empty': 'error',
            'no-extra-semi': 'error',
            'no-func-assign': 'error',
            'no-obj-calls': 'error',
            'no-sparse-arrays': 'error',
            'no-unreachable': 'error',
            'valid-typeof': 'warn',
            curly: 'error',
            eqeqeq: 'warn',
            'no-else-return': 'warn',
            'no-eval': 'error',
            'semi-spacing': 'error',
            'keyword-spacing': 'error',
            'space-infix-ops': 'error',
            'prefer-const': 'error',
            'no-restricted-imports': [
                'error',
                {
                    patterns: ['.*'],
                },
            ],
            'object-curly-spacing': ['error', 'always'],
            'padding-line-between-statements': [
                'error',
                {
                    blankLine: 'always',
                    prev: '*',
                    next: 'return',
                },
                {
                    blankLine: 'always',
                    prev: ['const', 'let', 'var'],
                    next: '*',
                },
                {
                    blankLine: 'any',
                    prev: ['const', 'let', 'var'],
                    next: ['const', 'let', 'var'],
                },
                {
                    blankLine: 'always',
                    prev: 'directive',
                    next: '*',
                },
                {
                    blankLine: 'any',
                    prev: 'directive',
                    next: 'directive',
                },
            ],
            'react/jsx-newline': [
                'error',
                { prevent: false }, // 2 thẻ cùng cấp phải cách nhau 1 dòng.
            ],
            '@typescript-eslint/no-floating-promises': 'warn',
            '@typescript-eslint/no-unsafe-assignment': 'warn',
            '@typescript-eslint/no-unsafe-member-access': 'warn',
            '@typescript-eslint/no-unsafe-call': 'warn',
            '@typescript-eslint/no-unsafe-argument': 'warn',
            '@typescript-eslint/no-explicit-any': 'error',
            '@typescript-eslint/no-unused-vars': [
                'error',
                {
                    argsIgnorePattern: '^_',
                    varsIgnorePattern: '^_',
                },
            ],
        },
    },
]);
