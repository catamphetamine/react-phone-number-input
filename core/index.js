export { default as default } from '../modules/PhoneInputWithCountry'
export { default as formatPhoneNumber, formatPhoneNumberIntl } from '../modules/libphonenumber/formatPhoneNumber'

export {
	isValidPhoneNumber,
	isPossiblePhoneNumber,
	getCountryCallingCode,
	getCountries,
	isSupportedCountry,
	parsePhoneNumberFromString as parsePhoneNumber
} from 'libphonenumber-js/core'