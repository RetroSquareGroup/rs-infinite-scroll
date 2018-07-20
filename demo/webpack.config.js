var path = require('path');
var webpack = require('webpack');

module.exports = {
  mode: 'production',
  entry: {
    demo: path.join(__dirname, 'demo.js')
  },
  output: {
    path          : path.join(__dirname, '__build__'),
    filename      : '[name].js',
    chunkFilename : '[id].chunk.js',
    publicPath    : '/__build__/'
  },
  module: {
    rules: [{
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        loaders: ['babel-loader?compact=false']
    }]
  },
  resolve: {
    alias: {
      'rs-infinite-scroll': '../src/rs-infinite-scroll.js'
    }
  },
};
