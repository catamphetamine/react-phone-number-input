import fs from 'fs'
import path from 'path'

import en from './locale/en.json'

const countries = Object.keys(en).filter(_ => _.length === 2 && _.toUpperCase() === _)
countries.sort()

const nonCountries = Object.keys(en).filter(_ => countries.indexOf(_) < 0)

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
		newLocale[nonCountry] = locale[nonCountry] || en[nonCountry]
	}
	for (const country of countries) {
		newLocale[country] = locale[country] || en[country]
	}
	// Output locale data.
	fs.writeFileSync(`locale/${name}`, JSON.stringify(newLocale, null, '\t'), 'utf-8')
})