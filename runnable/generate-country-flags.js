import { getCountryCodes, getCountryCodeForFlag } from '../source/countries'
import defaultLabels from '../locale/default.json'

import path from 'path'
import fs from 'fs'
import metadata from 'libphonenumber-js/metadata.min.json'

fs.writeFileSync(path.join(__dirname, '../source/flags.js'), generateFlags())

function generateFlags() {
	const countries = getCountryCodes(defaultLabels).filter(isSupportedByLibPhoneNumber)
	return `
import React from "react"

export default {${countries.map((country) => {
	return '\n\t' + country + ': () => (\n' + filterSvgMarkup(getCountryFlagSvgMarkup(country)) + '\t)'
})}
}
	`.trim()
}

function getCountryFlagSvgMarkup(country) {
	return fs.readFileSync(path.join(__dirname, `../node_modules/flag-icon-css/flags/4x3/${getCountryCodeForFlag(country).toLowerCase()}.svg`), 'utf8')
}

function filterSvgMarkup(svgMarkup) {
	return svgMarkup
		// Won't work for things like "<g clip-path="url(#a)">".
		// // Remove `id`s.
		// .replace(/ id=".+?"/g, '')
		.replace(/ xmlns:xlink="/g, ' xmlnsXlink="')
		.replace(/ xlink:href="/g, ' xlinkHref="')
		.replace(/ stroke-width="/g, ' strokeWidth="')
		.replace(/ stroke-linejoin="/g, ' strokeLinejoin="')
		.replace(/ stroke-linecap="/g, ' strokeLinecap="')
		.replace(/ fill-rule="/g, ' fillRule="')
}

// Leave only those countries supported by `libphonenumber-js`.
function isSupportedByLibPhoneNumber(country) {
	return metadata.countries[country] || country === 'ZZ'
}
