import {
	getCountryCallingCode,
	Metadata
} from 'libphonenumber-js/core'

const ONLY_DIGITS_REGEXP = /^\d+$/

export default function getInternationalPhoneNumberPrefix(country, metadata) {
	// Standard international phone number prefix: "+" and "country calling code".
	let prefix = '+' + getCountryCallingCode(country, metadata)

	// "Leading digits" can't be used to rule out any countries.
	// So the "pre-fill with leading digits on country selection" feature had to be reverted.
	// https://gitlab.com/catamphetamine/react-phone-number-input/-/issues/10#note_1231042367
	// // Get "leading digits" for a phone number of the country.
	// // If there're "leading digits" then they can be part of the prefix too.
	// // https://gitlab.com/catamphetamine/react-phone-number-input/-/issues/10
	// metadata = new Metadata(metadata)
	// metadata.selectNumberingPlan(country)
	// // "Leading digits" patterns are only defined for about 20% of all countries.
	// // By definition, matching "leading digits" is a sufficient but not a necessary
	// // condition for a phone number to belong to a country.
	// // The point of "leading digits" check is that it's the fastest one to get a match.
	// // https://gitlab.com/catamphetamine/libphonenumber-js/blob/master/METADATA.md#leading_digits
	// const leadingDigits = metadata.numberingPlan.leadingDigits()
	// if (leadingDigits && ONLY_DIGITS_REGEXP.test(leadingDigits)) {
	// 	prefix += leadingDigits
	// }

	return prefix
}