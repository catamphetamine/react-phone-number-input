const fs = require('fs')
const path = require('path')

var autoprefixer = require('autoprefixer')
var postcssCustomProperties = require('postcss-custom-properties')
var postcss = require('postcss')

RegExp.escape = function (string) {
	const specials = new RegExp("[.*+?|()\\[\\]{}\\\\]", "g")
	return string.replace(specials, "\\$&")
}

String.prototype.replace_all = function (what, with_what) {
	const regexp = new RegExp(RegExp.escape(what), "g")
	return this.replace(regexp, with_what)
}

function transformStyle(inPath, outPath) {
  outPath = outPath || inPath
  const text = fs.readFileSync(path.join(__dirname, inPath), 'utf8')
  return postcss([
    autoprefixer(),
    postcssCustomProperties()
  ]).process(text, { from: undefined }).then((result) => {
    result.warnings().forEach((warn) => console.warn(warn.toString()))
    fs.writeFileSync(path.join(__dirname, outPath), result.css)
  })
}

Promise.all([
  transformStyle('../style.css', '../bundle/style.css')
])
