import parse from './parser'

// Edits <input/>ted value according to the input conditions (caret position, key pressed).
//
// value          - '  999) 123 45 -67'
// caret_position - 5 // starting from 0
//
// options:
// {
// 	operation: 'Delete',
// 	selection: { end: 456 } // `end` specifies the index of the character after the selection
// }
//
// Returns
// {
// 	phone: '(999) 123-45'
// 	caret: 12 // starting from 0
// }
//
export default function edit(value, caret_position, format, operation, selection, options = {})
{
	// If selection is being erased, then simply erase it.
	// (and prefer "Delete" over "Backspace")
	if (selection && (operation === 'Backspace' || operation === 'Delete'))
	{
		value = value.substring(0, caret_position) + value.substring(selection.end)
		return parse(value, caret_position, format, options)
	}

	let { digits, digit_index } = parse(value, caret_position, format, options)

	// Adjust caret position
	switch (operation)
	{
		case 'Backspace':
			// Find the previous (the one being erased) digit index
			// inside a valid phone number.
			const previous_digit_index = digit_index - 1

			// If there is previous digit,
			// then erase it and reposition the caret.
			if (previous_digit_index >= 0)
			{
				// Remove the previous digit
				digits = digits.substring(0, previous_digit_index) + digits.substring(digit_index)
				// Position the caret where the previous (erased) digit was
				digit_index = previous_digit_index
			}

			break

		case 'Delete':
			// Remove current digit
			digits = digits.substring(0, digit_index) + digits.substring(digit_index + 1)
			break
	}

	return { digits, digit_index }
}