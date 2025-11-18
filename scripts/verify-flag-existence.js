import fs from 'fs'
import { hasFlag } from 'country-flag-icons'
import { getCountries } from 'libphonenumber-js'

// Validate `country-flag-icons`.
for (const country of getCountries()) {
	if (!hasFlag(country)) {
		throw new Error(`${country} flag not found in "country-flag-icons"`)
	}
}

// // Validate `flagpack`.
// for (const country of getCountries()) {
// 	if (!fs.existsSync(`./node_modules/flagpack/flags/4x3/${country.toLowerCase()}.svg`)) {
// 		// Currently, they don't have a couple of flags.
// 		// I've submitted a pull request to `flagpack` repo:
// 		// https://github.com/jackiboy/flagpack/pull/4
// 		// The issue:
// 		// https://github.com/jackiboy/flagpack/issues/3
// 		if (country === 'AC' || country === 'TA') {
// 			continue
// 		}
// 		throw new Error(`${country} flag not found in "flagpack"`)
// 	}
// }
