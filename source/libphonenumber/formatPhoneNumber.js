import parsePhoneNumber from 'libphonenumber-js/core'

/**
 * Formats a phone number.
 * Is a proxy for `libphonenumber-js`'s `.format()` function of a parsed `PhoneNumber`.
 * @param  {string} value
 * @param  {string} [format]
 * @param  {object} metadata
 * @return {string}
 */
export default function formatPhoneNumber(value, format, metadata) {
	if (!metadata) {
		if (typeof format === 'object') {
			metadata = format
			format = 'NATIONAL'
		}
	}
	if (!value) {
		return ''
	}
	const phoneNumber = parsePhoneNumber(value, metadata)
	if (!phoneNumber) {
		return ''
	}
	// Deprecated.
	// Legacy `format`s.
	switch (format) {
		case 'National':
			format = 'NATIONAL'
			break
		case 'International':
			format = 'INTERNATIONAL'
			break
	}
	return phoneNumber.format(format)
}

export function formatPhoneNumberIntl(value, metadata) {
	return formatPhoneNumber(value, 'INTERNATIONAL', metadata)
}