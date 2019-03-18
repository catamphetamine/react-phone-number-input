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

/**
 * Replaces HTML-style attributes with camelCased React ones.
 * The script used for checking:
 * var src = `...`
 * var attributes = [];
 * for (const attribute of src.match(/[a-zA-Z]+-[a-zA-Z]+="/g)) {
 *   if (!attributes.includes(attribute)){
 *     attributes.push(attribute)
 *   }
 * }
 * console.log(attributes.map(attribute => attribute.slice(0, attribute.length - '="'.length)).sort().join('\n'))
 * @param  {string} svgMarkup
 * @return {string}
 */
function filterSvgMarkup(svgMarkup) {
	const SVG_ATTRIBUTES = [
		'clip-path',
		'fill-opacity',
		'fill-rule',
		'font-family',
		'font-size',
		'font-weight',
		'letter-spacing',
		'stop-color',
		'stop-opacity',
		'stroke-dashoffset',
		'stroke-miterlimit',
		'stroke-opacity',
		'stroke-width',
		'stroke-linejoin',
		'stroke-linecap',
		'text-anchor',
		'word-spacing',
		'xmlns:xlink',
		'xlink:href'
	]
	for (const attribute of SVG_ATTRIBUTES) {
		svgMarkup = svgMarkup.replace(new RegExp(` (${attribute})="`, 'g'), (_, match) => ` ${match.replace(/[-:]([a-z])/g, (_, letter) => letter.toUpperCase())}="`)
	}
	return svgMarkup
		// Won't work for things like "<g clip-path="url(#a)">".
		// // Remove `id`s.
		// .replace(/ id=".+?"/g, '')
}

// Leave only those countries supported by `libphonenumber-js`.
function isSupportedByLibPhoneNumber(country) {
	return metadata.countries[country] || country === 'ZZ'
}
