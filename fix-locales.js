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