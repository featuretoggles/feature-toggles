module.exports = function (api) {
    api.cache(true);
    return {
        presets: [
            require("@babel/preset-env")
        ],
        plugins: ["@babel/plugin-proposal-object-rest-spread"]
    }
};