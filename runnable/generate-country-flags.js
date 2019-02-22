import { getCountryCodes } from '../source/countries'
import defaultLabels from '../locale/default.json'

import path from 'path'
import fs from 'fs'
import metadata from 'libphonenumber-js/metadata.min.json'

fs.writeFileSync(path.join(__dirname, '../source/flags.js'), generate(true))

function generate(flags)
{
	const countries = getCountryCodes(defaultLabels).filter(isSupportedByLibPhoneNumber).map((code) =>
	{
		const country =
		{
			code: code,
			name: defaultLabels[code]
		}

		if (flags)
		{
			country.flag = reactify_svg(get_country_flag(code))
		}

		return country
	})

	const countries_array = countries.map((country) =>
	{
		const properties = [`value: '${country.code}'`, `label: '${country.name}'`]

		if (flags)
		{
			properties.push(`icon: ${country.flag}`)
		}

		return `{` + properties.map(_ => '\n\t' + _).join(',') + (flags ? '' : '\n') + `}`
	})
	.join(',\n')

	let output = ''

	if (flags)
	{
		output += `import React from 'react'\n\n`
	}

	output +=
`export default
[${countries_array}]`

	return output
}

function get_country_flag(code)
{
	return fs.readFileSync(path.join(__dirname, `../node_modules/flag-icon-css/flags/4x3/${code.toLowerCase()}.svg`), 'utf8')
}

function reactify_svg(svg)
{
	return svg
		.replace(/ xmlns:xlink="/g, ' xmlnsXlink="')
		.replace(/ xlink:href="/g, ' xlinkHref="')
		.replace(/ stroke-width="/g, ' strokeWidth="')
		.replace(/ stroke-linejoin="/g, ' strokeLinejoin="')
		.replace(/ stroke-linecap="/g, ' strokeLinecap="')
}

// Leave only those countries supported by `libphonenumber-js`.
function isSupportedByLibPhoneNumber(country) {
	return metadata.countries[country] || country === 'ZZ'
}