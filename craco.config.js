const CracoLessPlugin = require("craco-less");
const path = require('path');

module.exports = {
  webpack: {
    configure: (webpackConfig, { env, paths }) => {
      paths.appBuild = webpackConfig.output.path = path.resolve("docs");
      return webpackConfig; 
    },
  },
  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            modifyVars: { "@primary-color": "#1DA57A" },
            javascriptEnabled: true,
          },
        },
      },
    },
  ],
};
