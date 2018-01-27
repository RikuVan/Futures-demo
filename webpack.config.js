const { join, resolve } = require('path')
const webpack = require('webpack')

const __DEV__ = process.env.NODE_ENV !== 'production';


module.exports = {

  entry: './src',

  devtool: __DEV__ && 'cheap-module-eval-source-map',
  
  output: {
    path: join(__dirname, 'public'),
    filename: 'bundle.js'
  },
  
  resolve: {
    extensions: ['.js', '.jsx'],
    alias: {
      'react': 'preact-compat',
      'react-dom': 'preact-compat',
      // Not necessary unless you consume a module using `createClass`
      'create-react-class': 'preact-compat/lib/create-react-class'
    }
  },
  
  module: {
    rules: [
      {
        test: /\.js?$/,
        loaders: [ 'babel-loader' ],
        include: [
          resolve(__dirname, './src'),
          resolve(__dirname, './node_modules/preact-compat'),
        ],
      }
    ],
  },
  
  plugins: [
     new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
    }),
    (! __DEV__) && new webpack.optimize.UglifyJsPlugin(),
  
  ]
  .filter(p => p)
}
