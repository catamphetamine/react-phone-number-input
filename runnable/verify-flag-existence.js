import { hasFlag } from 'country-flag-icons'
import { getCountries } from '..'

for (const country of getCountries()) {
	if (!hasFlag(country)) {
		throw new Error(`${country} flag not found in "country-flag-icons"`)
	}
}