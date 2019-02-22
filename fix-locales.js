import fs from 'fs'
import path from 'path'
import metadata from 'libphonenumber-js/metadata.min.json'

import { SKIP_COUNTRIES } from './source/countries'
import flags from './source/flags'
import en from './locale/en.json'

// Leave only those countries supported by `libphonenumber-js`.
function isSupportedByLibPhoneNumber(country) {
	return metadata.countries[country] || country === 'ZZ'
}

const countries = Object.keys(en).filter(_ => _.length === 2 && _.toUpperCase() === _)
countries.sort()

const nonCountries = Object.keys(en).filter(_ => countries.indexOf(_) < 0)

// Check that some of the `libphonenumber-js` supported countries are not missing.
for (const country of Object.keys(metadata.countries)) {
	if (!countries.includes(country) && !SKIP_COUNTRIES.includes(country)) {
		throw new Error(`"${country}" country is missing from messages`)
	}
}

// Check that all countries have their flags.
for (const country of countries.filter(isSupportedByLibPhoneNumber)) {
	if (!flags[country] && !SKIP_COUNTRIES.includes(country) && country !== 'ZZ') {
		throw new Error(`"${country}" country is missing a flag`)
	}
}

// For each locale.
fs.readdirSync('locale').map((name) => {
	if (name === 'en.json') {
		return
	}
	// Read locale data.
	const locale = require(`./locale/${name}`)
	// Add missing countries.
	// Remove non-existing countries.
	// Re-sort locale data keys.
	const newLocale = {}
	for (const nonCountry of nonCountries) {
		if (locale[nonCountry]) {
			newLocale[nonCountry] = locale[nonCountry]
		} else {
			console.log(`"${name}" was missing "${nonCountry}" key. Substituted with "${en[nonCountry]}".`)
			newLocale[nonCountry] = en[nonCountry]
		}
	}
	for (const country of countries) {
		if (locale[country]) {
			newLocale[country] = locale[country]
		} else {
			console.log(`"${name}" was missing "${country}" country. Substituted with "${en[country]}".`)
			newLocale[country] = en[country]
		}
	}
	// Output locale data.
	fs.writeFileSync(`locale/${name}`, JSON.stringify(newLocale, null, '\t'), 'utf-8')
})