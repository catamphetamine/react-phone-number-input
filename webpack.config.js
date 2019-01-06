let inputFileName
const outputFileName = 'react-phone-number-input-' + process.env.WEBPACK_BUNDLE_TYPE
let globalVariableName = 'react-phone-number-input'

switch (process.env.WEBPACK_BUNDLE_TYPE) {
  case 'native':
    inputFileName = 'min/index.commonjs'
    break
  case 'react-responsive-ui':
    inputFileName = 'react-responsive-ui/index.commonjs'
    break
  case 'smart-input':
    inputFileName = 'smart-input/index.commonjs'
    globalVariableName += '-smart-input'
    break
}

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