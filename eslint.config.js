// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');
const eslintPluginPrettierRecommended = require('eslint-plugin-prettier/recommended');

module.exports = defineConfig([
    expoConfig,
    eslintPluginPrettierRecommended,
    {
        ignores: ['dist/*', '/.expo', 'node_modules/*'],
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
            '@typescript-eslint/no-unused-vars': [
                'error',
                {
                    argsIgnorePattern: '^_',
                    varsIgnorePattern: '^_',
                },
            ],
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
        },
    },
]);
