import { parsePhoneNumberFromString } from 'libphonenumber-js/core'

export default function formatPhoneNumber(value, format, metadata)
{
	if (!metadata) {
		if (typeof format === 'object') {
			metadata = format
			format = 'NATIONAL'
		}
	}
	if (!value) {
		return ''
	}
	const phoneNumber = parsePhoneNumberFromString(value, metadata)
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