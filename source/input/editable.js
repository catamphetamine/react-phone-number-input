import
{
	format_local,
	format_international,
	derive_phone_number_format,
	parse_plaintext_international,
	parse_digits
}
from '../phone'

import parse from './parser'
import format from './formatter'
import edit from './editor'

// Apply the pending operation to the <input/> textual value (if any),
// and then format the <input/> textual value as a phone number
// (and reposition the caret position accordingly)
export function edit_and_format(operation, input_text, phone_number_format, caret_position, selection, options)
{
	const { digits, digit_index } = edit_and_parse
	(
		operation,
		input_text,
		phone_number_format,
		caret_position,
		selection,
		options
	)

	// If a specific phone number format is set,
	// then format the digits as a local phone number.
	if (phone_number_format)
	{
		return format(digits, digit_index, phone_number_format, { has_trunk_prefix: false })
	}

	// If no strictly set `format` supplied,
	// try to infer it from the <input/> textual value entered.
	if (!phone_number_format)
	{
		phone_number_format = derive_phone_number_format('+' + digits)
	}

	// If no specific `format` is set,
	// but a phone format was derived from the entered digits,
	// then format the digits as an international phone number.
	if (phone_number_format)
	{
		// Cut off country code
		const _digits = digits.substring(phone_number_format.country.length)
		// And adjust `digit_index` accordingly
		const _digit_index = digit_index - phone_number_format.country.length

		let { phone, caret } = format(_digits, _digit_index, phone_number_format, { has_trunk_prefix: false, international: true })

		// If the `digit_index` was negative
		// (belonged to the country code)
		// then stand the caret on that country code digit.
		if (caret === undefined)
		{
			caret = digit_index
		}

		return { phone, caret }
	}

	// No phone number formatting
	return format(digits, digit_index)
}

export function edit_and_parse(operation, value, format, caret, selection, options)
{
	// If needs to modify the value
	// (i.e. Backspace or Delete was intercepted)
	if (operation)
	{
		// Edit <input/>ted value according to the input conditions (caret position, key pressed)
		return edit(value, caret, format, operation, selection, options)
	}

	return parse(value, caret, format, options)
}

// Parses the <input/> textual value
// into a plaintext international value
export function parse_value(input_text, format)
{
	// If a strict `format` is specified,
	// then limit the digits accordingly.
	if (format)
	{
		const has_trunk_prefix = false
		return parse_plaintext_international(input_text, format, has_trunk_prefix)
	}

	// Otherwise just take all the digits
	// prepending a plus sign.

	const digits = parse_digits(input_text)

	if (!digits)
	{
		return
	}

	return '+' + digits
}

// Formats `value` (which is plaintext international)
// into an <input/> textual value.
export function format_value(value, format)
{
	const with_trunk_prefix = false

	// If a specific phone number `format` is specified, then use it.
	if (format)
	{
		// "+79991234567" -> "(999) 123-45-67"
		return format_local(value, format, with_trunk_prefix)
	}

	// Otherwise, try to infer phone number format
	// from the international number being entered.
	format = derive_phone_number_format(value)

	// If the phone number format was derived, then use it.
	if (format)
	{
		// "+79991234567" -> "+7 999 123 45 67" -> "7 999 123 45 67"
		return format_international(value, format).substring('+'.length)
	}

	// Otherwise don't format the value for output.
	// Just trim the plus character.
	// "+12345678" -> "12345678"

	if (!value)
	{
		return ''
	}

	return value.substring('+'.length)
}