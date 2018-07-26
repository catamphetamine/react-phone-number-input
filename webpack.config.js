const inputFileName = process.env.WEBPACK_BUNDLE_TYPE
const outputFileName = 'react-phone-number-input-' + process.env.WEBPACK_BUNDLE_TYPE
const globalVariableName = process.env.WEBPACK_BUNDLE_TYPE === 'smart-input' ? 'react-phone-number-input-smart-input' : 'react-phone-number-input'

module.exports =
{
  entry: './' + inputFileName + '.js',
  devtool: 'source-map',
  output:
  {
    path           : require('path').join(__dirname, '/bundle'),
    filename       : `${outputFileName}.js`,
    library        : globalVariableName,
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