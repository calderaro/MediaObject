var path = require('path')
var webpack = require('webpack')

module.exports = {
  entry: [
    'webpack-hot-middleware/client',
    path.join(__dirname, './src/examples/app.js')
  ],
  output: {
    path: path.resolve('lib'),
    filename: 'mediaobject.js',
    publicPath: '/lib/'
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('development')
      }
    })
  ],
  module: {
    rules: [
      { test: /\.js$/, use: ['babel-loader'], include: path.join(__dirname, 'src') },
      { test: /\.(css)$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: { modules: true, importLoaders: 1, localIdentName: '[name]__[local]___[hash:base64:5]' }
          },
          'postcss-loader'
        ]
      }
    ]
  }
}
