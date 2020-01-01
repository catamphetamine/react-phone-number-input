export { default as default } from '../modules/PhoneInput'

export {
	getCountries as getCountries,
	getCountryCallingCode as getCountryCallingCode,
	parsePhoneNumberFromString as parsePhoneNumber
} from 'libphonenumber-js/core'

export { default as formatPhoneNumber, formatPhoneNumberIntl } from '../modules/libphonenumber/formatPhoneNumber'
export { default as isValidPhoneNumber } from '../modules/libphonenumber/isValidPhoneNumber'
export { default as isPossiblePhoneNumber } from '../modules/libphonenumber/isPossiblePhoneNumber'
