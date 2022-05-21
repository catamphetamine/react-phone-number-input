export { default as default } from '../modules/PhoneInputWithCountry.js'
export { default as formatPhoneNumber, formatPhoneNumberIntl } from '../modules/libphonenumber/formatPhoneNumber.js'

export {
	default as parsePhoneNumber,
	isValidPhoneNumber,
	isPossiblePhoneNumber,
	getCountryCallingCode,
	getCountries,
	isSupportedCountry
} from 'libphonenumber-js/core'