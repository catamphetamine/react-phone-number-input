// Tells if `value: string` is an `E.164` phone number.
//
// Returns a boolean.
//
// It doesn't validate that the minimum national (significant) number length
// is at least 2 characters.
//
export default function isE164Number(value) {
	if (value.length < 2) {
		return false
	}
	if (value[0] !== '+') {
		return false
	}
	let i = 1
	while (i < value.length) {
		const character = value.charCodeAt(i)
		if (character >= 48 && character <= 57) {
			// Is a digit.
		} else {
			return false
		}
		i++
	}
	return true
}

export function validateE164Number(value) {
	if (!isE164Number(value)) {
		console.error('[react-phone-number-input] Expected the initial `value` to be a E.164 phone number. Got', value)
	}
}