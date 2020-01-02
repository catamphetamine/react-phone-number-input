import { getCountries } from 'libphonenumber-js/min'
import defaultLabels from '../locale/en.json'

import path from 'path'
import fs from 'fs'
import svgr from '@svgr/core'
import metadata from 'libphonenumber-js/metadata.min.json'

fs.writeFileSync(path.join(__dirname, '../source/flags.js'), generateFlags())

function generateFlags() {
	const countries = getCountries()
	return `
import React from "react"

export default {${countries.map((country) => {
	return '\n\t' + country + ': ({ title, ...rest }) => (\n' + getCountryFlagSvgMarkup(country) + '\t)'
})}
}
	`.trim()
}

function getCountryFlagSvgMarkup(country) {
	const svgCode = fs.readFileSync(path.join(__dirname, `../flags/3x2/${country.toLowerCase()}.svg`), 'utf8')
	let code = svgr.sync(
		svgCode,
		{
			plugins: [
				'@svgr/plugin-svgo',
				'@svgr/plugin-jsx',
				'@svgr/plugin-prettier'
			],
		}
	)
	const svgTagStartsAt = code.indexOf('<svg')
	if (svgTagStartsAt < 0) {
		throw new Error(`<svg/> tag not found in ${country} flag`)
	}
	const firstTagStarts = code.indexOf('<', svgTagStartsAt + 1)
	if (firstTagStarts < 0) {
		throw new Error(`First tag not found in ${country} flag`)
	}
	if (code.indexOf('<title') > 0) {
		throw new Error(`<title/> already present in ${country} flag`)
	}
	code = code.slice(0, firstTagStarts) + '<title>{title}</title>' + '\n' + code.slice(firstTagStarts)
	return code.replace('import React from "react";\n\nconst SvgComponent = props => (\n', '')
		.replace(' {...props}', ' {...rest}')
		.replace('\n);\n\nexport default SvgComponent;', '')
}

// Leave only those countries supported by `libphonenumber-js`.
function isSupportedByLibPhoneNumber(country) {
	return metadata.countries[country] || country === 'ZZ'
}
