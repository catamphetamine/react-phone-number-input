// https://en.wikipedia.org/wiki/National_conventions_for_writing_telephone_numbers
export const formats =
{
	// +7 | (123) 456-78-90
	RU:
	{
		country  : '7',
		template : '(xxx) xxx-xx-xx'
	},

	// +380 | (12) 345-67-89
	UA:
	{
		country  : '380',
		template : '(xx) xxx-xx-xx'
	},

	// +375 | (12) 345-67-89
	BY:
	{
		country  : '375',
		template : '(xx) xxx-xx-xx'
	},

	// +1 | (123) 456-7890
	US:
	{
		country  : '1',
		template : '(xxx) xxx-xxxx'
	}
}

// Validates an international plaintext phone number ("+79991234567")
export function validate(plaintext_international, format)
{
	if (!plaintext_international)
	{
		return false
	}
	
	// Sanity check (for `undefined`)
	if (!format)
	{
		throw new Error(`No "format" specified for phone number validation`)
	}

	// Default phone number validation
	if (format.country)
	{
		return plaintext_international.length === '+'.length + format.country.length + digits_in_number(format, plaintext_international)
	}

	// In case of custom phone number formatting
	return plaintext_international.length === '+'.length + digits_in_number(format, plaintext_international)
}

// Reduces a formatted phone number to a plaintext one (with country code).
// E.g.    "(999) 123-45-67" -> "+79991234567"
//      "+7 (999) 123-45-67" -> "+79991234567"
export function parse_plaintext_international(formatted, format)
{
	// The input digits
	let digits = parse_digits(formatted)

	if (!digits)
	{
		return ''
	}

	// If the input wass already international,
	// just return the digits with the '+' sign.
	if (formatted[0] === '+')
	{
		return '+' + digits
	}

	// Trim excessive phone number digits
	digits = phone_digits(digits, format)

	// Convert local plaintext to international plaintext
	return plaintext_international(digits, format)
}

// Returns phone number template based on the phone format.
export function template(format, value)
{
	// Default phone number formatting
	if (format.country)
	{
		return format.template
	}

	// In case of custom phone formatting return that formatting
	return format.template(value)
}

// Converts formatted phone number to just digits
// (e.g. "(999) 123-45-67" -> "9991234567")
export function phone_digits(value, format)
{
	const phone_digits = parse_digits(value)
	return phone_digits.substring(0, digits_in_number(format, phone_digits))
}

// Retains only digits
export function parse_digits(value)
{
	return value.replace(/[^0-9]/g, '')	
}

// Counts digits in a string
export function count_digits(value)
{
  return parse_digits(value).length
}

// Formats an editable part of international plaintext phone number.
//
// E.g.: "+79991234567" -> "+7 (999) 123-45-67"
// E.g.:   "9991234567" -> "+7 (999) 123-45-67"
//
export function format(value, format)
{
	// Trim the value
	value = value.trim()

	// Strip '+' and country code
	if (value[0] === '+')
	{
		if (format.country)
		{
			value = value.slice('+'.length + format.country.length)
		}
		else
		{
			value = value.slice('+'.length)
		}
	}

	if (!value)
	{
		return ''
	}

	// Populate phone template with digits
	return populate_template(template(format, value), value)
}

// Populates phone template with digits.
//
// E.g. "+7 (xxx) xxx-xx-xx" -> "+7 (123) 456-78-90"
//
export function populate_template(template, digits)
{
	let populated = ''
	let digit_index = 0
	let brace_open = false
	let symbol_index = 0
	let symbol

	// Replace 'x'-es with digits in a cycle
	while (symbol_index < template.length)
	{
		symbol = template[symbol_index]

		if (symbol === 'x')
		{
			symbol = digits[digit_index]
			digit_index++
		}
		else if (symbol === '(')
		{
			brace_open = true
		}

		populated += symbol
		symbol_index++

		if (digit_index === digits.length)
		{
			break
		}
	}

	// If a parenthesis was opened, then close it,
	// and trim everything else.
	if (brace_open)
	{
		return populated + template.slice(symbol_index, template.indexOf(')') + 1).replace(/x/g, ' ')
	}

	// Otherwise just trim everything after the last populated 'x'
	return populated
}

// Returns digit count in phone number format
export function digits_in_number(format, digits)
{
	const template = format.country ? format.template : format.template(digits)
	return count_occurences('x', template)
}

// Finds digit index in value at caret position
// (if there's no digit at caret position then 
//  returns the index of the closest next digit)
export function digit_index(value, caret_position)
{
  return count_digits(value.substring(0, caret_position))
}

// Finds index of digit symbol in template
export function index_in_template(digit_index, format, digits)
{
  const phone_template = template(format, digits)

  let digit_index_so_far = -1
  let i = 0
  while (i <= phone_template.length)
  {
    if (phone_template[i] === 'x')
    {
      digit_index_so_far++
    }

    if (digit_index_so_far === digit_index)
    {
      return i
    }

    i++
  }
}

// Converts plaintext (local or international) phone number to an international one
export function plaintext_international(plaintext, format)
{
	if (!plaintext)
	{
		return ''
	}

	// If it's already plaintext international, then don't change it
	if (plaintext[0] === '+')
	{
		return plaintext
	}

	// Default phone number validation
	if (format.country)
	{
		return `+${format.country}${plaintext}`
	}

	// In case of custom phone number formatting
	return `+${plaintext}`
}

// Converts plaintext (local or international) phone number to a local one
export function plaintext_local(plaintext, format)
{
	if (!plaintext)
	{
		return ''
	}

	// If it's already plaintext local, then don't change it
	if (plaintext[0] !== '+')
	{
		return plaintext
	}

	// Default phone number validation
	if (format.country)
	{
		return plaintext.slice('+'.length + format.country.length)
	}

	// In case of custom phone number formatting
	return plaintext.slice('+'.length)
}

// Repeats string N times
export function repeat(pattern, count)
{
	if (count < 1)
	{
		return ''
	}

	let result = ''
	
	while (count > 1)
	{
		if (count & 1)
		{
			result += pattern
		}
		count >>= 1
		pattern += pattern
	}

	return result + pattern
}

// // Replaces a character in a string at index
// function replace_character(string, index, character)
// {
// 	// Sanity check
// 	if (index > string.length - 1)
// 	{
// 		return string
// 	}
//
// 	// Replace character at index
// 	return string.slice(0, index) + character + string.slice(index + 1)
// }

// Counts all occurences of a symbol in a string
export function count_occurences(symbol, string)
{
	let count = 0

	for (let character of string)
	{
		if (character === symbol)
		{
			count++
		}
	}

	return count
}