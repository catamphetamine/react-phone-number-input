import { getCountryCodes } from './countries'
import defaultLabels from '../locale/default'

import path from 'path'
import fs from 'fs'

fs.writeFileSync(path.join(__dirname, '../source/flags.js'), generate(true))

function generate(flags)
{
	const countries = getCountryCodes(defaultLabels).map((code) =>
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
	let flag_path

	switch (code)
	{
		// // Kosovo (disputed territory).
		// case 'xk':
		// 	flag_path = 'resources/flags'
		// 	break

		// `flag-icon-css`
		default:
			flag_path = 'node_modules/flag-icon-css/flags/4x3'
	}

	return fs.readFileSync(path.join(__dirname, `../${flag_path}/${code}.svg`), 'utf8')
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
