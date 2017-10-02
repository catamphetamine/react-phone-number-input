import webpack from 'webpack'
import path from 'path'

const env = process.env.WEBPACK_ENV

const library_name = 'react-phone-number-input'
let output_file

const plugins = []

if (env === 'build')
{
  plugins.push(new webpack.optimize.UglifyJsPlugin
  ({
    minimize  : true,
    sourceMap : true
  }))

  output_file = `${library_name}.min.js`
}
else
{
  output_file = `${library_name}.js`
}

export default
{
  entry: path.join(__dirname, '/index.js'),
  devtool: 'source-map',
  output:
  {
    path           : path.join(__dirname, '/bundle'),
    filename       : output_file,
    library        : library_name,
    libraryTarget  : 'umd',
    umdNamedDefine : true
  },
  module:
  {
    loaders:
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
  },
  plugins
}