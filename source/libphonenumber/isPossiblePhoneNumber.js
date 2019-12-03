import { parsePhoneNumberFromString } from 'libphonenumber-js/core'

export default function isPossiblePhoneNumber(value, metadata) {
	if (!value) {
		return false
	}
	const phoneNumber = parsePhoneNumberFromString(value, metadata)
	if (!phoneNumber) {
		return false
	}
	return phoneNumber.isPossible()
}