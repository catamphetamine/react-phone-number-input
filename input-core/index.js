export { default as default } from '../modules/PhoneInput'

export {
	isValidPhoneNumber,
	isPossiblePhoneNumber,
	getCountries,
	getCountryCallingCode,
	isSupportedCountry,
	parsePhoneNumberFromString as parsePhoneNumber
} from 'libphonenumber-js/core'

export { default as formatPhoneNumber, formatPhoneNumberIntl } from '../modules/libphonenumber/formatPhoneNumber'
