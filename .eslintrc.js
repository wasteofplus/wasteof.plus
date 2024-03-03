module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
    webextensions: true
  },
  extends: ['standard'],
  overrides: [
    {
      env: {
        node: true
      },
      files: ['.eslintrc.{js,cjs}'],
      parserOptions: {
        sourceType: 'script'
      }
    }
  ],
  parserOptions: {
    ecmaVersion: 'latest'
  },
  rules: {},
  globals: {
    $nuxt: true,
    io: true
  }
}
