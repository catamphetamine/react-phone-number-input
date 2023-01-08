import {
	getCountryCallingCode,
	Metadata
} from 'libphonenumber-js/core'

const ONLY_DIGITS_REGEXP = /^\d+$/

export default function getInternationalPhoneNumberPrefix(country, metadata) {
	// Standard international phone number prefix: "+" and "country calling code".
	let prefix = '+' + getCountryCallingCode(country, metadata)

	// Get "leading digits" for a phone number of the country.
	// If there're "leading digits" then they can be part of the prefix too.
	metadata = new Metadata(metadata)
	metadata.selectNumberingPlan(country)
	// "Leading digits" patterns are only defined for about 20% of all countries.
	// The way "leading digits" are defined is that matching them is a sufficient
	// but not a necessary condition for a phone number to belong to the country.
	// The point is that "leading digits" check is the fastest one to get a match.
	// https://gitlab.com/catamphetamine/libphonenumber-js/blob/master/METADATA.md#leading_digits
	const leadingDigits = metadata.numberingPlan.leadingDigits()
	if (leadingDigits && ONLY_DIGITS_REGEXP.test(leadingDigits)) {
		prefix += leadingDigits
	}

	return prefix
}