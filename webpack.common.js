const path = require('path');

const dist = path.join(__dirname, 'dist');

module.exports = {
  entry: {
    index: './src/index.ts'
  },
  output: {
    //filename: 'bundle.js',
    filename: '[name].js',
    //library: 'web-sdk',
    libraryTarget: 'umd',
    path: dist
  },
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
          'ts-loader'
        ]
      }
    ]
  },
  optimization: {
    minimize: false,
    minimizer: ['...'],
    sideEffects: true,
    splitChunks: {
      chunks: 'all'
    }
  },
  target: 'node'
  //mode: 'production'
  //mode: 'development'
};
