const path = require('path');
module.exports = {
  paths: function(paths, env) {
    paths.appIndexJs = path.resolve(__dirname, 'web/index.tsx');
    paths.appSrc = path.resolve(__dirname, 'web');
    paths.appTypeDeclarations = path.resolve(__dirname, 'web/react-app-env.d.ts');
    return paths;
  },
};