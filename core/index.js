export { default as default } from '../modules/PhoneInputWithCountry'
export { default as formatPhoneNumber, formatPhoneNumberIntl } from '../modules/libphonenumber/formatPhoneNumber'
export { default as isValidPhoneNumber } from '../modules/libphonenumber/isValidPhoneNumber'
export { default as isPossiblePhoneNumber } from '../modules/libphonenumber/isPossiblePhoneNumber'

export {
	getCountryCallingCode as getCountryCallingCode,
	getCountries as getCountries,
	parsePhoneNumberFromString as parsePhoneNumber
} from 'libphonenumber-js/core'