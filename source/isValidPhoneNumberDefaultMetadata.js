// Deprecated.
// This is a file used in legacy `/index.js` export entry.
// In some next major version this file will be removed
// and `/index.js` will be redirected to `/min/index.js`.

import { isValidNumber } from 'libphonenumber-js/core'
import metadata from 'libphonenumber-js/metadata.min.json'

export default function isValidPhoneNumber()
{
	var parameters = Array.prototype.slice.call(arguments)
	parameters.push(metadata)
	return isValidNumber.apply(this, parameters)
}