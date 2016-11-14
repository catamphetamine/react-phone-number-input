import
{
	parse_digits,
	local_phone_digits as phone_digits,
	format_local,
	format_international,
	index_in_template,
	digits_in_local_phone_number_template
}
from '../phone'

// Formats phone number and repositions the caret if neccessary.
//
// value          - '  999) 123 45 -67'
// caret_position - 5 // starting from 0
// format         - { country: ..., template: ... }
//
// options:
// {
// 	international: false // If set to `true` then it will format the phone as an international one (including country code)
//    has_trunk_prefix: false // If set to `true` then it will include trunk prefix
// }
//
// Returns
// {
// 	phone: '(999) 123-45'
// 	caret: 12 // starting from 0
// }
//
export default function format(digits, digit_index, format, options = {})
{
	if (!format)
	{
		const result =
		{
			phone: digits,
			caret: digit_index
		}

		return result
	}

	const phone = options.international ? format_international(digits, format).substring(1) : format_local(digits, format, options.has_trunk_prefix)

	let caret_position = get_caret_position_for_digit(digit_index, format, digits, options)

	// If the digits are formatted as an international phone number,
	// adjust the caret position for the country code and (possibly) a spacebar.
	if (options.international)
	{
		caret_position += format.country.length

		if (digits)
		{
			caret_position++
		}
	}

	// In case of "next digit" being too far
	if (caret_position > phone.length)
	{
		caret_position = phone.length
	}

	const result =
	{
		phone,
		caret: caret_position
	}

	return result
}

// Calculates caret position for digit index
// (not character index) in a phone number of a given format
export function get_caret_position_for_digit(digit_index, format, digits, options = {})
{
	// Sanity check
	if (digit_index < 0)
	{
		return
	}

	if (digits.length === 0)
	{
		return 0
	}

	let caret_position = index_in_template(digit_index, format, digits, options.has_trunk_prefix, options.international)

	// If the `digit_index` exceeds the available `digits`,
	// then position the caret after the last digit.
	if (caret_position === undefined)
	{
		caret_position = index_in_template(digits_in_local_phone_number_template(format, digits, options.has_trunk_prefix) - 1, format, digits, options.has_trunk_prefix, options.international) + 1
	}

	return caret_position
}