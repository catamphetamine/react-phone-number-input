export { default as default } from './modules/PhoneInputNativeDefaultMetadata'
export { parseRFC3966, formatRFC3966 } from './modules/libphonenumber/RFC3966'
export { default as parsePhoneNumber } from './modules/libphonenumber/parsePhoneNumberDefaultMetadata'
export { default as formatPhoneNumber, formatPhoneNumberIntl } from './modules/formatPhoneNumberDefaultMetadata'
export { default as isValidPhoneNumber } from './modules/isValidPhoneNumberDefaultMetadata'
// Deprecated export.
// Use `import PhoneInput from 'react-phone-number-input/core'` instead.
export { default as PhoneInput } from './modules/PhoneInput'
// Just a re-export of `getCountryCallingCode()` because people keep asking for it.
// https://github.com/catamphetamine/react-phone-number-input/issues/284
export { getCountryCallingCode as getCountryCallingCode } from 'libphonenumber-js/min'
