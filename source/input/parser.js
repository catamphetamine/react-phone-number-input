import
{
	digit_index as get_digit_index,
	local_phone_digits,
	parse_digits
}
from '../phone'

export default function parse(text, caret_position, format, options = {})
{
	// Extract phone number digits (they may be altered later on).
	const digits = phone_number_digits(text, format, options)

	// Current digit index in the phone number
	// (not a character index, but a digit index)
	let digit_index = get_digit_index(text, caret_position)

	// In case `format` is specified, excessive
	// phone number digits may have been cut off,
	// so check that and adjust `digit_index` accordingly.
	if (digit_index > digits.length)
	{
		digit_index = digits.length
	}

	return { digits, digit_index }
}

// Extracts phone number digits,
// cutting off excess digits.
// 
// If no specific `format` is required,
// and instead the most suitable
// phone number `format` is selected dynamically,
// then don't pass the `format` arguments,
// and it won't cut off the excessive digits,
// allowing for further dynamic phone number format selection.
//
export function phone_number_digits(text, format, options = {})
{
	if (format)
	{
		return local_phone_digits(text, format, options.has_trunk_prefix)
	}

	return parse_digits(text)
}