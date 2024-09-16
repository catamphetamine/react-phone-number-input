import { getCountryCallingCode } from 'libphonenumber-js/core'

export function getPrefixForFormattingValueAsPhoneNumber({
	inputFormat,
	country,
	metadata
}) {
	return inputFormat === 'NATIONAL_PART_OF_INTERNATIONAL' ?
		`+${getCountryCallingCode(country, metadata)}` :
		''
}

export function removePrefixFromFormattedPhoneNumber(value, prefix) {
	if (prefix) {
		value = value.slice(prefix.length)
		if (value[0] === ' ') {
			value = value.slice(1)
		}
	}
	return value
}