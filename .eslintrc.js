module.exports = {
    env: {
        browser: true,
        es2021: true,
    },
    extends: ['airbnb-base', 'plugin:prettier/recommended'],
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaVersion: 12,
        sourceType: 'module',
    },
    plugins: ['@typescript-eslint', 'import', 'prettier'],
    rules: {
        'prettier/prettier': ['error', { singleQuote: true }],
        'no-console': 'off',
        'no-plusplus': 'off',
        'no-shadow': 'off',
        'no-unused-vars': 'off',
        'no-continue': 'off',
        'no-alert': 'off',
        'import/extensions': [
            'error',
            'ignorePackages',
            {
                ts: 'never',
            },
        ],
        'max-len': [
            'error',
            120,
            4,
            {
                ignoreUrls: true,
                ignoreComments: false,
                ignoreRegExpLiterals: true,
                ignoreStrings: true,
                ignoreTemplateLiterals: true,
                ignorePattern: '<path([sS]*?)/>',
            },
        ],
    },
    settings: {
        'import/resolver': {
            typescript: {},
        },
    },
};
