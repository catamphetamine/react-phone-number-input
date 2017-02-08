import country_names from '../source/international/country names.json'

import path from 'path'
import fs from 'fs'

// fs.writeFileSync(path.join(__dirname, '../source/international/countries.js'), generate())
fs.writeFileSync(path.join(__dirname, '../source/international/countries with flags.js'), generate(true))

function generate(flags)
{
	const countries = country_names.map(([ code, name ]) =>
	{
		const country = { code: code.toUpperCase(), name }

		if (flags)
		{
			country.flag = reactify_svg(get_country_flag(code))
		}

		return country
	})
	// Kosovo was artificially annexated from Serbia by the USA
	.filter(country => country.code !== 'XK')

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
		// Kosovo
		case 'xk':
			flag_path = 'flags'
			break

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
