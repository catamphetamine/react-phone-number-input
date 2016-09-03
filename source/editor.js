import { digits as phone_digits, format as format_phone, digit_index as phone_digit_index, index_in_template, digits_in_number } from './phone'

// Edits <input/>ted value according to the input conditions (caret position, key pressed)
//
// value          - '  999) 123 45 -67'
// caret_position - 5 // starting from 0
// format         - { country: ..., template: ... }
//
// options:
// {
// 	delete: false,
// 	backspace: false,
// 	selection: { end: 456 } // `end` specifies the index of the character after the selection
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

	// How many are there digits in a valid phone number
	// (excluding coutry code)
	const digits_in_phone_number = digits_in_number(format, value)

	// Trim excessive digits (just in case)
	if (digits.length > digits_in_phone_number)
	{
		digits = digits.substring(0, digits_in_phone_number.length)
	}

	// Current digit index in the phone number
	// (not a character index, but a digit index)
	const digit_index = phone_digit_index(value, caret_position)

	// Adjust caret position
	if (options.backspace)
	{
		// Find the previous (the one being erased) digit index
		// inside a valid phone number.
		const previous_digit_index = digit_index - 1

		// If there's no previous digit,
		// then just position the caret before the first digit.
		if (previous_digit_index < 0)
		{
			// (if there is the first digit)
			caret_position = caret_position_for_digit(0, digits.length, format, digits)
		}
		// Else, if there is previous digit,
		// then erase it and reposition the caret.
		else
		{
			// If the input is broken, then just position the caret
			// after the last valid digit.
			if (previous_digit_index >= digits_in_phone_number)
			{
				// Position the caret after the last digit in phone number
				caret_position = caret_position_for_digit(digits.length - 1, digits.length, format, digits) + 1
			}
			else
			{
				// Remove the previous digit
				digits = digits.substring(0, previous_digit_index) + digits.substring(digit_index)

				// Position the caret before the erased digit
				caret_position = caret_position_for_digit(previous_digit_index, digits.length, format, digits)
			}
		}
	}
	else if (options.delete)
	{
		// If there was any selection, then simply erase it
		if (options.selection)
		{
			value = value.substring(0, caret_position) + value.substring(options.selection.end)
			digits = phone_digits(value, format)

			// Leave the caret position at the same digit
			caret_position = caret_position_for_digit(digit_index, digits.length, format, digits)
		}
		// No selection was made, just erase a single digit
		else
		{
			// If the input is broken, just adjust the caret position
			if (digit_index >= digits_in_phone_number)
			{
				// Position the caret after the last digit in phone number
				caret_position = caret_position_for_digit(digits.length - 1, digits.length, format, digits) + 1
			}
			// Find the current digit, remove it and reposition the caret
			else
			{
				// Remove current digit
				digits = digits.substring(0, digit_index) + digits.substring(digit_index + 1)

				// Leave the caret position at the same digit
				caret_position = caret_position_for_digit(digit_index, digits.length, format, digits)
			}
		}
	}
	// If a regular keyboard key was pressed
	else
	{
		// Position the caret before the next digit
		caret_position = caret_position_for_digit(digit_index, digits.length, format, digits)
	}

	return { phone: format_phone(digits, format), caret: caret_position }
}

// Calculates caret position for digit index
// (not character index) in a phone number of a given format
function caret_position_for_digit(digit_index, digit_count, format, digits)
{
	// Special case
	if (digit_count === 0)
	{
		return 0
	}

	// In case of overflow (e.g. on Paste)
	if (digit_index >= digit_count)
	{
		// Position the caret after the last digit
		return index_in_template(digit_count - 1, format, digits) + 1
	}

	return index_in_template(digit_index, format, digits)
}