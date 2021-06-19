const CracoLessPlugin = require("craco-less");

module.exports = {
  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            modifyVars: {
              "@btn-font-weight": "500",
              "@btn-border-radius-base": "6px",
              "@layout-header-background": "#19181A",
              "@layout-body-background": "#19181A",
              "@body-background": "#19181A",
            },
            javascriptEnabled: true,
          },
        },
      },
    },
  ],
};
