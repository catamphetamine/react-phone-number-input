const library_name = 'react-phone-number-input-' + process.env.WEBPACK_BUNDLE_TYPE

module.exports =
{
  entry: './' + process.env.WEBPACK_BUNDLE_TYPE + '.js',
  devtool: 'source-map',
  output:
  {
    path           : require('path').join(__dirname, '/bundle'),
    filename       : `${library_name}.js`,
    library        : 'react-phone-number-input',
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