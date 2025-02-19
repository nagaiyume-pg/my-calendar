module.exports = function (api) {
  api.cache(true);
  return {
    presets: [['@babel/preset-env', 'babel-preset-expo', {targets: {node: 'current'}}]],
    plugins: [
      ['babel-plugin-react-docgen-typescript', { exclude: 'node_modules' }],
    ],
  };
};
