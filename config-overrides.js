const path = require('path');
const rewireReactHotLoader = require("react-app-rewire-hot-loader");

module.exports = {
  paths: function(paths, env) {
    paths.appIndexJs = path.resolve(__dirname, 'web/index.tsx');
    paths.appSrc = path.resolve(__dirname, 'web');
    paths.appTypeDeclarations = path.resolve(__dirname, 'web/react-app-env.d.ts');
    return paths;
  },
  override: function(config, env) {
    config = rewireReactHotLoader(config, env);
    return config;
  }
};