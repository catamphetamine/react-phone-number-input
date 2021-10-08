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
	if (metadata.numberingPlan.leadingDigits() && ONLY_DIGITS_REGEXP.test(metadata.numberingPlan.leadingDigits())) {
		prefix += metadata.numberingPlan.leadingDigits()
	}
	return prefix
}