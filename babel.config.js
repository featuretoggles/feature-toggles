/* eslint func-names: ["error", "always"] */
module.exports = function config(api) {
  api.cache(true);
  return {
    presets: [
      require("@babel/preset-env", {
        targets: {
          esmodules: true
        }
      })
    ],
    plugins: [
      "@babel/plugin-proposal-object-rest-spread",
      "@babel/plugin-transform-runtime"
    ],
    ignore: ["**/__tests__/", "**/__testfixtures__/"]
  };
};
