import { getCountryCallingCode } from 'libphonenumber-js/core'

export function getInputValuePrefix({
	country,
	international,
	withCountryCallingCode,
	metadata
}) {
	return country && international && !withCountryCallingCode ?
		`+${getCountryCallingCode(country, metadata)}` :
		''
}

export function removeInputValuePrefix(value, prefix) {
	if (prefix) {
		value = value.slice(prefix.length)
		if (value[0] === ' ') {
			value = value.slice(1)
		}
	}
	return value
}