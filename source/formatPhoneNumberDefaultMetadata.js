// Deprecated.
// This is a file used in the legacy root `/index.js` export file.
// (importing directly from `react-phone-number-input` is currently deprecated)
// In some next major version this file will be removed
// and `main` and `module` entries in `package.json` will be
// redirected to `/min/index.js` and `/min/index.commonjs.js`
// which don't import this file.

import formatPhoneNumber_, { formatPhoneNumberIntl as formatPhoneNumberIntl_ } from './formatPhoneNumber'
import metadata from 'libphonenumber-js/metadata.min.json'

export default function formatPhoneNumber() {
	var parameters = Array.prototype.slice.call(arguments)
	parameters.push(metadata)
	return formatPhoneNumber_.apply(this, parameters)
}

export function formatPhoneNumberIntl() {
	var parameters = Array.prototype.slice.call(arguments)
	parameters.push(metadata)
	return formatPhoneNumberIntl_.apply(this, parameters)
}