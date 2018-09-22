import { formatNumber } from 'libphonenumber-js/custom'
import metadata from 'libphonenumber-js/metadata.min.json'

export default function formatPhoneNumberDefaultMetadata()
{
	var parameters = Array.prototype.slice.call(arguments)
	parameters.push(metadata)
	return formatNumber.apply(this, parameters)
}