// webpack.config.js

var webpack = require('webpack');

var plugins = [
  new webpack.DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
  })
];

if (process.env.COMPRESS) {
  plugins.push(
    new webpack.optimize.UglifyJsPlugin({
      compressor: {
        warnings: false
      },
      output: {
        comments: false
      }
    })
  );
}

module.exports = {
  output: {
    library: 'RsInfiniteScroll',
    libraryTarget: 'var'
  },
  module: {
    preLoaders: [
      {
        test: /\.js$/,
        loader: 'eslint-loader',
        exclude: /node_modules/
      }
    ],
    loaders: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        loaders: ['ng-annotate', 'babel-loader?compact=false']
      }
    ]
  },
  externals: {
    'angular': 'angular'
  },
  resolve: {
    extensions: ['', '.js']
  },
  eslint: {
    failOnError: true,
    configFile: './.eslintrc'
  },
  plugins: plugins
};
