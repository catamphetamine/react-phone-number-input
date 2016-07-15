import { template as phone_template, digits as phone_digits, format as format_phone, digit_index as phone_digit_index, index_in_template, digits_in_number } from './phone'

// Edits <input/>ted value according to the input conditions (caret position, key pressed)
//
// value          - '  999) 123 45 -67'
// caret_position - 5 // starting from 0
// format         - { city: 3, number: [3, 2, 2] }
//
// options:
// {
// 	delete: false,
// 	backspace: false,
// 	selection: { start: 123, end: 456 } // `end` specifies the index of the character after the selection
// }
//
// Returns
// {
// 	phone: '(999) 123-45'
// 	caret: 12 // starting from 0
// }
//
export default function edit(value, caret_position, format, options = {})
{
	if (options.selection && options.backspace)
	{
		options.backspace = false
		options.delete = true
	}
	
	// Phone number digits (may be altered later)
	let digits = phone_digits(value, format)

	// Generate phone number template based on the phone format structure.
	// e.g. { code: '7', city: 3, number: [3, 2, 2] } -> '(xxx) xxx-xx-xx'
	const template = phone_template(format)

	// Adjust caret position
	if (options.backspace)
	{
		// Find the closest previous digit
		const previous_digit_index = phone_digit_index(value, caret_position) - 1
		if (previous_digit_index < 0)
		{
			// Adjust caret position
			caret_position = index_in_template(0, format)
		}
		else
		{
			const digits_in_phone_number = digits_in_number(format)
			if (previous_digit_index < digits_in_phone_number)
			{
				// Remove the previous digit
				digits = digits.substring(0, previous_digit_index) + digits.substring(previous_digit_index + 1)
				// Adjust caret position
				caret_position = index_in_template(previous_digit_index, format)
			}
			else
			{
				// Adjust caret position
				caret_position = index_in_template(digits_in_phone_number - 1, format) + 1
			}
		}
	}
	else if (options.delete)
	{
		if (options.selection)
		{
			const digit_index = phone_digit_index(value, options.selection.start)

			value = value.substring(0, options.selection.start) + value.substring(options.selection.end)
			digits = phone_digits(value, format)

			// Adjust caret position
			caret_position = index_in_template(digit_index, format)
		}
		else
		{
			// Find current digit
			const digit_index = phone_digit_index(value, caret_position)
			const digits_in_phone_number = digits_in_number(format)
			if (digit_index < digits_in_phone_number)
			{
				// Remove current digit
				digits = digits.substring(0, digit_index) + digits.substring(digit_index + 1)
				// Adjust caret position
				caret_position = index_in_template(digit_index, format)
			}
			else
			{
				// Position the caret after the last digit in phone number
				caret_position = index_in_template(digits_in_phone_number - 1, format) + 1
			}
		}
	}
	else
	{
		// Find the digit after the last inserted (keydowned, pasted, etc) digit
		const next_digit_index = phone_digit_index(value, caret_position)

		// Adjust caret position
		const digits_in_phone_number = digits_in_number(format)
		if (next_digit_index < digits_in_phone_number)
		{
			// Position the caret at the next digit
			caret_position = index_in_template(next_digit_index, format)
		}
		else
		{
			// Position the caret after the last digit in phone number
			caret_position = index_in_template(digits_in_phone_number - 1, format) + 1
		}
	}

	return { phone: format_phone(digits, format), caret: caret_position }
}