import fs from 'fs'
import path from 'path'

import autoprefixer from 'autoprefixer'
import postcssCustomProperties from 'postcss-custom-properties'
import postcss from 'postcss'

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
  const text = fs.readFileSync(path.resolve(inPath), 'utf8')
  return postcss([
    autoprefixer(),
    postcssCustomProperties()
  ]).process(text, { from: undefined }).then((result) => {
    result.warnings().forEach((warn) => console.warn(warn.toString()))
    fs.writeFileSync(path.resolve(outPath), result.css)
  })
}

Promise.all([
  transformStyle('./style.css', './bundle/style.css')
])
