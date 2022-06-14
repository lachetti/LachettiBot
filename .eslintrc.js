module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir : __dirname,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint/eslint-plugin'],
  extends: [
    'plugin:@typescript-eslint/recommended',
  ],
  root: true,
  env: {
    node: true,
  },
  ignorePatterns: ['.eslintrc.js'],
  rules: {
    '@typescript-eslint/consistent-type-definitions': 'error',
    '@typescript-eslint/member-delimiter-style': [
      'error',
      {
        'multiline': {
          'delimiter': 'semi',
          'requireLast': true
        },
        'singleline': {
          'delimiter': 'semi',
          'requireLast': true
        }
      }
    ],
    '@typescript-eslint/naming-convention': [
      'error',
      {
        'selector': 'property',
        'modifiers': ['private'],
        'format': ['camelCase'],
        'leadingUnderscore': 'allow'
      },
      {
        'selector': 'variable',
        'format': ['camelCase', 'PascalCase']
      },
      {
        'selector': 'variable',
        'modifiers': ['const'],
        'format': ['PascalCase', 'camelCase', 'UPPER_CASE'],
      },
    ],
    '@typescript-eslint/no-empty-function': 'off',
    '@typescript-eslint/no-empty-interface': 'error',
    '@typescript-eslint/no-inferrable-types': [
      'error',
      {
        'ignoreParameters': true
      }
    ],
    '@typescript-eslint/no-misused-new': 'error',
    '@typescript-eslint/no-non-null-assertion': 'error',
    '@typescript-eslint/no-shadow': 'error',
    '@typescript-eslint/no-unused-expressions': 'error',
    '@typescript-eslint/prefer-function-type': 'error',
    '@typescript-eslint/semi': [
      'error',
      'always'
    ],
    '@typescript-eslint/type-annotation-spacing': 'error',
    '@typescript-eslint/unified-signatures': 'error',
    'brace-style': [
      'error',
      '1tbs'
    ],
    'constructor-super': 'error',
    'curly': 'error',
    'dot-notation': 'off',
    'eqeqeq': [
      'error',
      'smart'
    ],
    '@typescript-eslint/indent': ['error', 2],
    'indent': ['error', 2, {'SwitchCase': 1}],
    'padding-line-between-statements': [
      'error',
      { blankLine: 'always', prev: '*', next: 'return' },
      { blankLine: 'always', prev: ['const', 'let'], next: '*'},
      { blankLine: 'any', prev: ['const', 'let'], next: ['const', 'let']},
      { blankLine: 'always', prev: ['case', 'default', 'for', 'function', 'if', 'switch', 'while', 'try'], next: '*' },
      { blankLine: 'always', prev: '*', next: ['case', 'default', 'for', 'function', 'if', 'switch'] },
    ],
    'space-before-function-paren': ['error', {
      'anonymous': 'never',
      'named': 'never',
      'asyncArrow': 'always'
    }],
    'no-multiple-empty-lines': ['error', {
      'max': 1, 'maxEOF': 1, 'maxBOF': 0
    }],
    'no-debugger': 'error',
    'no-trailing-spaces': 'error',
    '@typescript-eslint/quotes': ['error', 'single'], // Одинарные кавычки для строк
    // Предупреждение об использовании console за исключением console.error
    // 'no-console': ['warn', {'allow': ['error']}],
    'no-console': 'off'
  },
};
