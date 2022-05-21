export { default as default } from '../modules/PhoneInputBrowser.js'

export {
	default as parsePhoneNumber,
	isValidPhoneNumber,
	isPossiblePhoneNumber,
	getCountries,
	getCountryCallingCode,
	isSupportedCountry
} from 'libphonenumber-js/core'

export { default as formatPhoneNumber, formatPhoneNumberIntl } from '../modules/libphonenumber/formatPhoneNumber.js'
