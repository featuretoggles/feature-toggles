/* eslint func-names: ["error", "always"] */
module.exports = function config(api) {
  api.cache(true);
  return {
    presets: [require("@babel/preset-env")],
    plugins: ["@babel/plugin-proposal-object-rest-spread"]
  };
};
