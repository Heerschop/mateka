module.exports_disable = {
  // ...
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: [
          {
            loader: 'webpack-preprocessor-loader',
            options: {
              debug:  process.env.DEBUG === 'true',
              directives: {
                secret: false,
              },
              params: {
                debug: process.env.DEBUG,
              },
              verbose: true,
            },
          },
        ],
      },
    ],
  },
};
