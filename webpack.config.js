const library_name = 'react-phone-number-input'

export default
{
  entry: '/index.js',
  devtool: 'source-map',
  output:
  {
    path           : require('path').join(__dirname, '/bundle'),
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