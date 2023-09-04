module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
  },
  parserOptions: {
    parser: '@babel/eslint-parser',
    requireConfigFile: false,
  },
  extends: [ '@nuxtjs', 'plugin:nuxt/recommended', 'prettier' ],
  plugins: [],
  // add your custom rules here
  rules: {
    curly: [ 'warn', 'multi-or-nest' ],
    'default-param-last': 'off',
    'arrow-parens': [ 'warn', 'as-needed' ],
    'no-prototype-builtins': 'off',
    'object-curly-spacing': [ 'warn', 'always' ],
    'array-bracket-spacing': [ 'warn', 'always', {
      singleValue: false,
      objectsInArrays: false,
      arraysInArrays: true
    }]
  },
}
