module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true
  },
  extends: 'eslint:recommended',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  rules: {
    'indent': ['error', 2],
    'linebreak-style': ['error', 'unix'],
    'quotes': ['error', 'single'],
    'semi': ['error', 'always'],
    'no-unused-vars': ['error', { 'argsIgnorePattern': '^_' }],
    'no-console': 'off',
    'max-len': ['error', { 'code': 120 }],
    'max-lines': ['error', { 'max': 800 }],
    'max-lines-per-function': ['error', { 'max': 50 }],
    'complexity': ['error', 10],
    'no-var': 'error',
    'prefer-const': 'error',
    'prefer-arrow-callback': 'error',
    'no-duplicate-imports': 'error',
    'no-template-curly-in-string': 'error',
    'no-unsafe-negation': 'error',
    'valid-typeof': 'error',
    'no-undef': 'error',
    'no-empty': ['error', { 'allowEmptyCatch': true }],
    'no-eq-null': 'error',
    'eqeqeq': ['error', 'always'],
    'no-alert': 'warn',
    'no-eval': 'error',
    'no-implied-eval': 'error',
    'no-new-func': 'error',
    'no-return-await': 'error'
  },
  overrides: [
    {
      files: ['tests/**/*.js'],
      rules: {
        'max-lines-per-function': 'off'
      }
    },
    {
      files: ['e2e-tests/**/*.js'],
      rules: {
        'max-lines-per-function': 'off'
      }
    }
  ],
  ignorePatterns: [
    'node_modules/**',
    'coverage/**',
    'dist/**',
    '.wrangler/**'
  ]
};
