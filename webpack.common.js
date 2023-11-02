const path = require('path');

const dist = path.join(__dirname, 'lib-dist');

module.exports = {
  entry: {
    index: './src/index.ts'
  },
  output: {
    //filename: 'bundle.js',
    filename: '[name].js',
    //library: 'web-sdk',
    //libraryTarget: 'module',
    library: {
      name: 'SDK',
      type: 'umd',
      export: 'default'
    },
    chunkFormat: 'array-push',
    path: dist
  },
  /* experiments: {
    outputModule: true
  }, */
  resolve: {
    extensions: ['.ts', '.js']
  },
  plugins: [],
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: [
          {
            loader: 'webpack-strip-block',
            options: {
              start: 'DEV_START',
              end: 'DEV_END'
            }
          },
          {
            loader: 'ts-loader',
            options: {
              configFile: 'wp-tsconfig.json'
            }
          }
        ]
      }
    ]
  },
  optimization: {
    //minimize: false,
    minimizer: ['...'],
    sideEffects: true
    /* splitChunks: {
      chunks: 'all'
    } */
  },
  target: 'web'
  //mode: 'production'
  //mode: 'development'
};
