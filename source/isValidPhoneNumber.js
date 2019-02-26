import { parsePhoneNumberFromString } from 'libphonenumber-js/core'

export default function isValidPhoneNumber(value, metadata) {
	if (!value) {
		return false
	}
	const phoneNumber = parsePhoneNumberFromString(value, metadata)
	if (!phoneNumber) {
		return false
	}
	return phoneNumber.isValid()
}