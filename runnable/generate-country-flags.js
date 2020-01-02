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
	return '\n\t' + country + ': () => (\n' + getCountryFlagSvgMarkup(country) + '\t)'
})}
}
	`.trim()
}

function getCountryFlagSvgMarkup(country) {
	const svgCode = fs.readFileSync(path.join(__dirname, `../flags/3x2/${country.toLowerCase()}.svg`), 'utf8')
	const code = svgr.sync(
		svgCode,
		{
			plugins: [
				'@svgr/plugin-svgo',
				'@svgr/plugin-jsx',
				'@svgr/plugin-prettier'
			],
		}
	)
	return code.replace('import React from "react";\n\nconst SvgComponent = props => (\n', '')
		.replace(' {...props}', '')
		.replace('\n);\n\nexport default SvgComponent;', '')
}

// Leave only those countries supported by `libphonenumber-js`.
function isSupportedByLibPhoneNumber(country) {
	return metadata.countries[country] || country === 'ZZ'
}
