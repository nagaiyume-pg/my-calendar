module.exports = function (api) {
    api.cache(true);
    return {
        presets: ["babel-preset-expo"],
        plugins: [
            ["babel-plugin-react-docgen", { exclude: "node_modules" }],
        ],
    };
};