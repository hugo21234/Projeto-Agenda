const path = require('path');

module.exports = {
  entry: './webpackage/src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'public/assets')
  }
};
