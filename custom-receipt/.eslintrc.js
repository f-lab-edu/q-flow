module.exports = {
    env: {
        es2021: true,
        node: true
    },
    extends: [
        'standard'
    ],
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaVersion: 13,
        sourceType: 'module'
    },
    plugins: [
        '@typescript-eslint'
    ],
    rules: {
        indent: [2, 4],
        semi: [2, 'never'],
        'no-unused-vars': 'off',
        'no-useless-constructor': 'off',
        camelcase: 'off'
    },
    globals: {
        Express: true
    }
}
