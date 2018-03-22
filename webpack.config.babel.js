import webpack from 'webpack'
import path from 'path'

const library_name = 'react-phone-number-input'

export default
{
  entry: path.join(__dirname, '/index.js'),
  devtool: 'source-map',
  output:
  {
    path           : path.join(__dirname, '/bundle'),
    filename       : `${library_name}.min.js`,
    library        : library_name,
    libraryTarget  : 'umd',
    umdNamedDefine : true
  },
  module:
  {
    rules:
    [{
      test    : /(\.js)$/,
      loader  : 'babel-loader',
      exclude : /node_modules/
    }]
  },
  externals:
  {
    // Use external version of React
    "react"     : "React",
    "react-dom" : "ReactDOM"
  }
}