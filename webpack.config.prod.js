/* global __dirname, require, module */

const webpack = require('webpack')
const path = require('path')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

const config = {
  mode: 'production',
  entry: path.join(__dirname, '/src/index.js'),
  output: {
    path: path.join(__dirname, '/lib'),
    filename: 'mediaObject.js',
    library: 'mediaObject',
    libraryTarget: 'umd',
    umdNamedDefine: true
  },
  module: {
    rules: [
      {test: /(\.jsx|\.js)$/, loader: 'babel-loader', exclude: /(node_modules|bower_components)/}
    ]
  },
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        cache: true,
        parallel: true,
        sourceMap: true
      })
    ]
  },
  externals: {

  }
}

module.exports = config
