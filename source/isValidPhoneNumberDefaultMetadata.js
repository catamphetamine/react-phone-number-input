import { isValidNumber } from 'libphonenumber-js/custom'
import metadata from 'libphonenumber-js/metadata.min.json'

export default function isValidPhoneNumberDefaultMetadata()
{
	var parameters = Array.prototype.slice.call(arguments)
	parameters.push(metadata)
	return isValidNumber.apply(this, parameters)
}