const path = require('path');

module.exports = {
  entry: './scripts/index.js',
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'dist/'),
    library: {
      type: 'module'
    }
  },
  experiments: {
    outputModule: true,
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              ['@babel/preset-env', {
                targets: '> 0.25%, not dead', // adjust this to your needs
                useBuiltIns: 'usage', // only include polyfills your code needs
                corejs: 3, // specify the version of core-js
              }]
            ]
          }
        }
      },
    ]
  },
  mode: 'production',
};
