module.exports = {
  env: {
    browser: true,
    es6: true,
    node: true
  },
  extends: ["airbnb-base"],
  globals: {
    Atomics: "readonly",
    SharedArrayBuffer: "readonly"
  },
  parser: "babel-eslint",
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: "module"
  },
  extends: ["prettier"],
  plugins: ["prettier"],
  rules: {
    "prettier/prettier": ["error"]
  }
};
