var path = require('path');
var webpack = require('webpack');

module.exports = {

  devtool: 'inline-source-map',

  entry: {
    demo: path.join(__dirname, 'demo.js')
  },

  output: {
    path          : 'demo/__build__',
    filename      : '[name].js',
    chunkFilename : '[id].chunk.js',
    publicPath    : '/__build__/'
  },

  module: {
    loaders: [{
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        loaders: ['ng-annotate', 'babel-loader?compact=false']
    }]
  },

  resolve: {
    alias: {
      'rs-infinite-scroll': '../src/rs-infinite-scroll.js'
    }
  },

  plugins: [
    new webpack.optimize.CommonsChunkPlugin('shared.js'),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
    })
  ]

};
