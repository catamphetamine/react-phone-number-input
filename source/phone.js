import formats from './formats'
import detect_country, { country_from_locale } from './country'

// Validates an international plaintext phone number (e.g. "+79991234567")
export function validate(plaintext_international, format)
{
	// Sanity check
	if (!plaintext_international)
	{
		return false
	}
	
	// If format is not specified, then try to autodetect it.
	if (!format)
	{
		// Derive phone number format from the
		// phone number itself (if it's international)
		format = derive_phone_number_format(plaintext_international)
	}

	// If not phone number format is present,
	// then assume the phone number is invalid.
	if (!format)
	{
		// console.error(`No "format" specified for phone number validation (and none could be derived). Assuming the phone number is invalid.`)
		return false
	}

	// If custom format validation supplied, then use it.
	if (typeof format.valid === 'function')
	{
		return format.valid(plaintext_international.slice('+'.length + format.country.length))
	}

	// Check phone number length
	if (plaintext_international.length !==
		'+'.length +
		format.country.length +
		digits_in_international_phone_number_template(format, plaintext_international))
	{
		return false
	}

	// Check the plus sign (sanity check)
	if (plaintext_international[0] !== '+')
	{
		return false
	}

	// Check country code
	if (plaintext_international.slice(1, 1 + format.country.length) !== format.country)
	{
		return false
	}

	// Seems to be valid
	return true
}

// Reduces a formatted phone number to an 
// international plaintext one (with country code).
//
// E.g. "8 (999) 123-45-67" -> "+79991234567"
//       "+7 999 123 45 67" -> "+79991234567"
//           "07700 900756" -> "+447700900756"
//
// This function is used in <input/> to parse text into `value`
//
export function parse_plaintext_international(formatted, format, has_trunk_prefix)
{
	// The input digits
	let digits = parse_digits(formatted)

	if (!digits)
	{
		return undefined
	}

	// If the input wass already international,
	// just return the digits with the '+' sign.
	if (formatted[0] === '+')
	{
		return `+${digits}`
	}

	// Otherwise it's a local phone number

	// Trim excessive phone number digits
	// (this is used in <input/>)
	digits = local_phone_digits(digits, format, has_trunk_prefix)

	// Convert local plaintext to international plaintext
	const value = plaintext_international(digits, format, has_trunk_prefix)

	// Return `undefined` for empty strings
	if (!value)
	{
		return undefined
	}

	return value
}

// Reduces a formatted phone number to a
// local plaintext one (without country code).
//
// E.g. "(999) 123-45-67" -> "9991234567"
//         "07700 900756" -> "07700900756"
//
// This function is used in <input/> to parse text into `value`
//
export function parse_plaintext_local(formatted, format, with_trunk_prefix)
{
	// Sanity check
	if (formatted[0] === '+')
	{
		throw new Error(`Must be a local formatted number: ${formatted}`)
	}

	// Trunk prefix is supposed not to be trimmed from the formatted phone number
	const has_trunk_prefix = true

	// Trim excessive phone number digits
	// (this is used in <input/>)
	let value = local_phone_digits(formatted, format, has_trunk_prefix)

	if (with_trunk_prefix === false)
	{
		value = trim_trunk_prefix(value, format)
	}

	return value
}

// Returns phone number template for `value`
// for the specified phone number format.
//
// `value` is plaintext local without trunk prefix.
//
// E.g.  "1112222222" -> "8 (AAA) BBB-BB-BB"
//
// If `with_trunk_prefix` is `false` then
// the trunk prefix is trimmed from the resulting template.
//
export function template(format, value, with_trunk_prefix)
{
	// Will hold the return value
	let template

	// Simple phone number formatting
	if (typeof format.template === 'string')
	{
		template = format.template
	}
	// Custom phone number formatting
	else if (typeof format.template === 'function')
	{
		template = format.template(value)
	}

	// Sanity check
	// (e.g. when `template` function didn't return a template)
	if (!template)
	{
		throw new Error(`Phone number template is not defined for phone number "${value}" for country code "${format.country}"`)
	}

	// Optionally remove trunk prefix part from the template
	// (and dangling braces too)
	if (with_trunk_prefix === false)
	{
		// Where trunk prefix begins
		const trunk_prefix_index = template.search(/[0-9]/)

		// Find where trunk prefix ends
		let trunk_prefix_ends_at = trunk_prefix_index
		while (/[0-9\-\s]/.test(template[trunk_prefix_ends_at + 1]))
		{
			trunk_prefix_ends_at++
		}

		// Split template into two parts:
		// one with trunk prefix and the other without trunk prefix.
		const left_out_template = template.slice(0, trunk_prefix_ends_at)
		template = template.slice(trunk_prefix_ends_at + 1)
		
		// Fix dangling braces (e.g. for UK numbers: "(0AA) BBBB BBBB")
		
		const opening_braces = count_occurences('(', left_out_template)
		const closing_braces = count_occurences(')', left_out_template)

		let dangling_braces = opening_braces - closing_braces
		while (dangling_braces > 0)
		{
			template = template.replace(')', '')
			dangling_braces--
		}
	}

	return template
}

// Converts a local formatted phone number to just digits
// while also trimming excessive digits in the end.
// (doesn't trim trunk prefix)
//
// E.g. "8 (999) 123-45-67" -> "89991234567"
//
export function local_phone_digits(value, format, has_trunk_prefix)
{
	const plaintext_local = parse_digits(value)
	return plaintext_local.slice(0, digits_in_local_phone_number_template(format, plaintext_local, has_trunk_prefix))
}

// Retains only digits in a string
export function parse_digits(value)
{
	// Sanity check
	if (!value)
	{
		return ''
	}

	// Replace all non-digits with emptiness
	return value.replace(/[^0-9]/g, '')
}

// Counts digits in a string
export function count_digits(value)
{
  return parse_digits(value).length
}

// Formats a plaintext phone number
// (either local or international):
// if `format` is passed, then formats
// `value` as a local phone number,
// otherwise formats `value` as an
// international phone number.
//
// `format` can be a phone number format structure,
// or an ISO 3166-1 country code, or a locale.
//
// If `format` is not specified then
// the appropriate international number format
// will be derived from the phone number itself
// (only if it's plaintext international)
//
// E.g.: ("+79991234567")        -> "+7 999 123 45 67"
//       ("9991234567", 'ru-RU') -> "(999) 123-45-67"
//
//       ("+447700900756")     -> "+44 7700 900756"
//       ("07700900756", 'GB') -> "07700 900756"
//
export function format(value, format)
{
	if (!value)
	{
		return ''
	}

	// If format is specified, then format
	// the phone number as a local one.
	if (format)
	{
		return format_local(value, format)
	}

	// Otherwise, if format is not specified,
	// then try to autodetect it
	// (only if the phone is plaintext international)

	// Derive phone number format from the
	// phone number itself (if it's international)
	format = derive_phone_number_format(value)

	// If phone number format was successfully derived
	if (format)
	{
		// Format the phone number as an international one
		return format_international(value, format)
	}

	// No suitable phone format found,
	// so it doesn't know how to format the phone number.
	// At least it won't crash and will output something.
	return value
}

// Derives phone number format from
// a plaintext international phone number.
//
// E.g.  "+78005553535" -> "RU"
//      "+447700900431" -> "UK"
//
export function derive_phone_number_format(value)
{
	// Derive country from the phone number (if it's international)
	const phone_country = detect_country(value)

	// If no original phone country could be detected,
	// then it won't know how to format the phone number.
	if (!phone_country)
	{
		// console.error(`No phone number format was passed and no country could be derived from the international plaintext phone number "${value}". Create an issue in the project repo on GitHub: https://github.com/halt-hammerzeit/react-phone-number-input/issues`)
		return
	}

	// Phone format for the phone number
	const format = formats[phone_country]

	// If there's no predefined phone number format for this country,
	// then it won't know how to format the phone number.
	if (!format)
	{
		console.error(`Phone number format is missing for country "${phone_country}". Create a Pull Request with the phone format for this country in the project repo on GitHub: https://github.com/halt-hammerzeit/react-phone-number-input/issues`)
		return
	}

	// Check for digits overflow.
	// If the check passes then this is the phone number format.
	if (value.length <= '+'.length + format.country.length + digits_in_international_phone_number_template(format, value))
	{
		return format
	}

	// Too much digits for this phone number format
}

// Formats a plaintext phone number
// (either local or international)
// as a local phone number.
//
// The `format` attribute can be either a phone formatter,
// or an ISO 3166-1 country code, or a locale.
// (`format` is required)
//
// E.g.: "+79991234567" -> "(999) 123-45-67"
// E.g.:   "9991234567" -> "(999) 123-45-67"
//
// This function is used in <input/> to format `value` into text
//
// If `with_trunk_prefix` is `false` then it denotes
// that the `value` doesn't contain trunk prefix,
// and also that it will be formatted using a template
// with trimmed trunk prefix.
//
// Otherwise `value` is assumed to contain trunk prefix
// (in case it's local) and it's formatted using
// a template with trunk prefix.
//
export function format_local(value, format, with_trunk_prefix)
{
	// Find a phone number format corresponding
	// to this ISO 3166-1 country code or locale.
	if (typeof format === 'string')
	{
		format = formats[country_from_locale(format) || format]
	}

	// If no phone number format could be derived, then throw an error.
	if (!format)
	{
		throw new Error(`Phone number format was not specified for formatting value "${value}"`)
	}

	// Sanity check
	if (!value)
	{
		return ''
	}

	// Obtain `digits` from `value`
	if (with_trunk_prefix === false)
	{
		if (value[0] === '+')
		{
			value = value.slice('+'.length + format.country.length)
		}
		else
		{
			// No need to convert anything, `value` is already `digits`
		}
	}
	else
	{
		let plaintext_local_value

		// Convert value from plaintext international to plaintext local
		if (value[0] === '+')
		{
			plaintext_local_value = plaintext_local(value, format, with_trunk_prefix)
		}
		else
		{
			// `value` is already plaintext local
			plaintext_local_value = value
		}

		// and trim trunk prefix
		value = trim_trunk_prefix(plaintext_local_value, format)
	}

	if (!value)
	{
		return ''
	}

	// Populate phone template (optionally without trunk prefix) with digits
	return populate_template(template(format, value, with_trunk_prefix), value)
}

// Formats an plaintext phone number
// (either local or international)
// as an international phone number.
//
// (`format` is required)
//
// E.g.: "+79991234567" -> "+7 999 123 45 67"
// E.g.:   "9991234567" -> "+7 999 123 45 67"
export function format_international(value, format)
{
	const with_trunk_prefix = false
	let number = local_to_international_style(format_local(value, format, with_trunk_prefix))

	return `+${format.country}${number.length > 0 ? ' ' + number : ''}`
}

// Populates local phone template with `digits`
// (which are plaintext local phone number without trunk code).
//
// If `digits.length` exceeds the template length,
// then it will return just the `digits`.
//
// E.g. ("(AAA) BBB-BB-BB", "1234567890") -> "(123) 456-78-90"
//              ("8 (xxx) xxx-xx-xx", "") -> ""
//            ("8 (xxx) xxx-xx-xx", "1") -> "8 (1  )"
//           ("8 (xxx) xxx-xx-xx", "12") -> "8 (12 )"
//          ("8 (xxx) xxx-xx-xx", "123") -> "8 (123)"
//   ("8 (xxx) xxx-xx-xx", "1234567890") -> "8 (123) 456-78-90"
//
export function populate_template(template, digits)
{
	if (!digits)
	{
		return ''
	}

	let populated = ''
	let digit_index = 0
	let brace_open = false
	let symbol_index = 0
	let symbol

	// Replace letters with digits in a cycle
	while (symbol_index < template.length)
	{
		symbol = template[symbol_index]

		if (symbol >= 'A' && symbol <= 'z')
			// || (symbol >= '0' && symbol <= '9'))
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

	// If `digits.length` exceeds the template length,
	// then simply return just the `digits`.
	if (digit_index < digits.length)
	{
		return digits
	}

	// If a parenthesis was opened, then close it,
	// and trim everything else.
	if (brace_open)
	{
		return populated + template.slice(symbol_index, template.indexOf(')') + 1).replace(/[0-9A-z]/g, ' ')
	}

	// Otherwise just trim everything after the last populated letter
	return populated
}

// Returns digit count in a local phone number format template
// (count trunk prefix digits in)
//
// E.g. "8 (AAA) BBB-BB-BB" -> 11
//
export function digits_in_local_phone_number_template(format, plaintext_local, has_trunk_prefix)
{
	const digits = has_trunk_prefix ? trim_trunk_prefix(plaintext_local, format) : plaintext_local
	const _template = template(format, plaintext_local)
	const regular_expression = has_trunk_prefix === false ? /[A-z]/g : /[0-9A-z]/g
	return (_template.match(regular_expression) || []).length
}

// Returns digit count in an international phone number format template
// (ignoring trunk prefix digits)
//
// E.g. local template "0 (AAA) BBB-BB-BB" -> 10
//
export function digits_in_international_phone_number_template(format, plaintext_international)
{
	// "A sensible default" for obtaining phone number template
	let digits = ''

	if (plaintext_international)
	{
		digits = plaintext_international.slice('+'.length + format.country.length)
	}

	const including_trunk_prefix = false
	return digits_in_local_phone_number_template(format, digits, including_trunk_prefix)
}

// Finds digit index in value at caret position
//
// If there's no digit at caret position then 
// returns the index of the closest next digit
//
// If there are no more next digits
// then returns the index of the last digit + 1
//
// E.g. ("1-123-456-7890", 0) -> 0 (first digit)
//        ^
//      ("1-123-456-7890", 1) -> 1 (second digit)
//         ^
//      ("1-123-456-7890", 2) -> 1 (second digit)
//          ^
//      ("1-123-456-7890", 3) -> 2 (third digit)
//           ^
//      ("1-123-456-7890", 4) -> 3 (fourth digit)
//            ^
//
export function digit_index(value, caret_position)
{
	return count_digits(value.slice(0, caret_position))
}

// Finds index of digit symbol in template string for this `digit_index`.
//
// If `with_trunk_prefix` is `false` then it won't count trunk prefix as a digit.
//
// If `international` is `true` then it will use the international phone number template instead of the local one.
//
// E.g. (0, "(AAA) BBB-BB-BB") -> 1 (first digit (index 0) is at index 1 in template string)
//            ^
//      (1, "(AAA) BBB-BB-BB") -> 2 (second digit (index 1) is at index 2 in template string)
//             ^
//      (2, "(AAA) BBB-BB-BB") -> 3 (third digit (index 2) is at index 3 in template string)
//              ^
//      (3, "(AAA) BBB-BB-BB") -> 6 (fourth digit (index 3) is at index 6 in template string)
//                 ^
//      (4, "(AAA) BBB-BB-BB") -> 7 (fifth digit (index 4) is at index 7 in template string)
//                  ^
//
export function index_in_template(digit_index, format, digits, with_trunk_prefix, international)
{
	let phone_template = template(format, digits, with_trunk_prefix)

	if (international)
	{
		phone_template = local_to_international_style(phone_template)
	}

	let digit_index_so_far = -1
	let i = 0
	while (i < phone_template.length)
	{
		if ((phone_template[i] >= 'A' && phone_template[i] <= 'z')
			|| (with_trunk_prefix !== false && (phone_template[i] >= '0' && phone_template[i] <= '9')))
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

// Converts a plaintext (local or international)
// phone number to an international one.
//
// E.g. "+78005553535" -> "+78005553535"
//        "8005553535" -> "+78005553535"
//       "07700900756" -> "+447700900756"
export function plaintext_international(plaintext, format, has_trunk_prefix)
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

	// Otherwise it's a local plaintext phone number

	// Trim trunk prefix from the phone number,
	// and add country code with a '+' sign to it.

	if (has_trunk_prefix !== false)
	{
		plaintext = trim_trunk_prefix(plaintext, format)
	}

	if (!plaintext)
	{
		return ''
	}

	return `+${format.country}${plaintext}`
}

// Converts a plaintext (local or international)
// phone number to a local one.
//
// E.g.  "07700900756" -> "07700900756"
//     "+447700900756" -> "07700900756"
//
export function plaintext_local(plaintext, format, has_trunk_prefix)
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

	// Otherwise it's plaintext international
	// so trim country code along with the '+' sign
	// and add trunk prefix

	plaintext = plaintext.slice('+'.length + format.country.length)

	if (has_trunk_prefix !== false)
	{
		plaintext = add_trunk_prefix(plaintext, format)
	}

	return plaintext
}

// Trims trunk prefix from plaintext local phone number
// https://en.wikipedia.org/wiki/Trunk_prefix
//
// E.g. "88005553535" -> "8005553535" // Russia
//      "07700900756" -> "7700900756" // UK
//
export function trim_trunk_prefix(plaintext_local, format)
{
	return plaintext_local.slice(trunk_prefix(format, plaintext_local).length)
}

// Adds trunk prefix to the phone number
// https://en.wikipedia.org/wiki/Trunk_prefix
//
// E.g. "8005553535" -> "88005553535" // Russia
//      "7700900756" -> "07700900756" // UK
//
export function add_trunk_prefix(digits, format)
{
	return trunk_prefix(format, digits) + digits
}

// Extracts trunk prefix from phone number format
// https://en.wikipedia.org/wiki/Trunk_prefix
//
export function trunk_prefix(format, digits = '')
{
	let trunk_prefix = ''

	for (let symbol of template(format, digits))
	{
		if (symbol >= '0' && symbol <= '9')
		{
			trunk_prefix += symbol
		}
		else if (symbol >= 'A' && symbol <= 'z')
		{
			break
		}
	}

	return trunk_prefix
}

// Counts all occurences of a symbol in a string
function count_occurences(symbol, string)
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

// Removes brackets and replaces dashes with spaces.
//
// E.g. "(999) 111-22-33" -> "999 111 22 33"
//
export function local_to_international_style(local)
{
	return local
		// Remove brackets
		.replace(/[\(\)]/g, '')
		// Replace dashes with spaces
		.replace(/\-/g, ' ')
		.trim()
}