'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _getIterator2 = require('babel-runtime/core-js/get-iterator');

var _getIterator3 = _interopRequireDefault(_getIterator2);

exports.validate = validate;
exports.parse_plaintext_international = parse_plaintext_international;
exports.template = template;
exports.local_phone_digits = local_phone_digits;
exports.parse_digits = parse_digits;
exports.count_digits = count_digits;
exports.format = format;
exports.derive_phone_number_format = derive_phone_number_format;
exports.format_local = format_local;
exports.format_international = format_international;
exports.populate_template = populate_template;
exports.digits_in_local_phone_number_template = digits_in_local_phone_number_template;
exports.digits_in_international_phone_number_template = digits_in_international_phone_number_template;
exports.digit_index = digit_index;
exports.index_in_template = index_in_template;
exports.plaintext_international = plaintext_international;
exports.plaintext_local = plaintext_local;
exports.trim_trunk_prefix = trim_trunk_prefix;
exports.add_trunk_prefix = add_trunk_prefix;
exports.trunk_prefix = trunk_prefix;

var _formats = require('./formats');

var _formats2 = _interopRequireDefault(_formats);

var _country = require('./country');

var _country2 = _interopRequireDefault(_country);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Validates an international plaintext phone number (e.g. "+79991234567")
function validate(plaintext_international, format) {
	// Sanity check
	if (!plaintext_international) {
		return false;
	}

	// If format is not specified, then try to autodetect it.
	if (!format) {
		// Derive phone number format from the
		// phone number itself (if it's international)
		format = derive_phone_number_format(value);
	}

	// If not phone number format is present,
	// then assume the phone number is invalid.
	if (!format) {
		console.error('No "format" specified for phone number validation. Assuming the phone number is invalid.');
		return false;
	}

	return plaintext_international.length === '+'.length + format.country.length + digits_in_international_phone_number_template(format, plaintext_international);
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
function parse_plaintext_international(formatted, format, with_trunk_prefix) {
	// The input digits
	var digits = parse_digits(formatted);

	if (!digits) {
		return '';
	}

	// If the input wass already international,
	// just return the digits with the '+' sign.
	if (formatted[0] === '+') {
		return '+' + digits;
	}

	// Otherwise it's a local phone number

	// Trim excessive phone number digits
	// (this is used in <input/>)
	digits = local_phone_digits(digits, format, with_trunk_prefix);

	// Convert local plaintext to international plaintext
	return plaintext_international(digits, format, with_trunk_prefix);
}

// Returns phone number template based on the phone format.
//
// E.g. "RU" -> "8 (AAA) BBB-BB-BB"
//
function template(format, value, with_trunk_prefix) {
	if (with_trunk_prefix === false) {
		value = add_trunk_prefix(value, format);
	}

	// Will hold the return value
	var template = void 0;

	// Simple phone number formatting
	if (typeof format.template === 'string') {
		template = format.template;
	}
	// Custom phone number formatting
	else if (typeof format.template === 'function') {
			template = format.template(value);
		}

	// Sanity check
	// (e.g. when `template` function didn't return a template)
	if (!template) {
		throw new Error('Phone number template is not defined for phone number "' + value + '" for country code "' + format.country + '"');
	}

	// Optionally remove trunk prefix part from the template
	// (and dangling braces too)
	if (with_trunk_prefix === false) {
		// Where trunk prefix begins
		var trunk_prefix_index = template.search(/[0-9]/);

		// Find where trunk prefix ends
		var trunk_prefix_ends_at = trunk_prefix_index;
		while (/[0-9\-\s]/.test(template[trunk_prefix_ends_at + 1])) {
			trunk_prefix_ends_at++;
		}

		// Split template into two parts:
		// one with trunk prefix and the other without trunk prefix.
		var left_out_template = template.slice(0, trunk_prefix_ends_at);
		template = template.slice(trunk_prefix_ends_at + 1);

		// Fix dangling braces (e.g. for UK numbers: "(0AA) BBBB BBBB")

		var opening_braces = count_occurences('(', left_out_template);
		var closing_braces = count_occurences(')', left_out_template);

		var dangling_braces = opening_braces - closing_braces;
		while (dangling_braces > 0) {
			template = template.replace(')', '');
			dangling_braces--;
		}
	}

	return template;
}

// Converts a local formatted phone number to just digits
// while also trimming excessive digits in the end.
//
// E.g. "8 (999) 123-45-67" -> "89991234567"
//
function local_phone_digits(value, format, with_trunk_prefix) {
	var plaintext_local = parse_digits(value);
	return plaintext_local.slice(0, digits_in_local_phone_number_template(format, plaintext_local, with_trunk_prefix));
}

// Retains only digits in a string
function parse_digits(value) {
	// Sanity check
	if (!value) {
		return '';
	}

	// Replace all non-digits with emptiness
	return value.replace(/[^0-9]/g, '');
}

// Counts digits in a string
function count_digits(value) {
	return parse_digits(value).length;
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
function format(value, format) {
	if (!value) {
		return '';
	}

	// If format is specified, then format
	// the phone number as a local one.
	if (format) {
		return format_local(value, format);
	}

	// Otherwise, if format is not specified,
	// then try to autodetect it
	// (only if the phone is plaintext international)

	// Derive phone number format from the
	// phone number itself (if it's international)
	format = derive_phone_number_format(value);

	// If phone number format was successfully derived
	if (format) {
		// Format the phone number as an international one
		return format_international(value, format);
	}

	// No suitable phone format found,
	// so it doesn't know how to format the phone number.
	// At least it won't crash and will output something.
	return value;
}

// Derives phone number format from
// the plaintext phone number itself
// (assuming it's an international one)
//
// E.g.  "+78005553535" -> "RU"
//      "+447700900431" -> "UK"
//
function derive_phone_number_format(value) {
	// Derive country from the phone number (if it's international)
	var phone_country = (0, _country2.default)(value);

	// If no original phone country could be detected,
	// then it won't know how to format the phone number.
	if (!phone_country) {
		console.error('No phone number format was passed and no country could be derived from the international plaintext phone number "' + value + '". Create an issue in the project repo on GitHub: https://github.com/halt-hammerzeit/react-phone-number-input/issues');
		return;
	}

	// Phone format for the phone number
	var format = _formats2.default[phone_country];

	// If there's no predefined phone number format for this country,
	// then it won't know how to format the phone number.
	if (!format) {
		console.error('Phone number format is missing for country "' + phone_country + '". Create a Pull Request with the phone format for this country in the project repo on GitHub: https://github.com/halt-hammerzeit/react-phone-number-input/issues');
		return;
	}

	return format;
}

// Formats a plaintext phone number
// (either local or international)
// as a local phone number.
//
// The `format` attribute can be either a phone formatter,
// or an ISO 3166-1 country code, or a locale.
//
// E.g.: "+79991234567" -> "(999) 123-45-67"
// E.g.:   "9991234567" -> "(999) 123-45-67"
//
// This function is used in <input/> to format `value` into text
//
function format_local(value, format, with_trunk_prefix) {
	// Find a phone number format corresponding
	// to this ISO 3166-1 country code or locale.
	if (typeof format === 'string') {
		format = _formats2.default[(0, _country.country_from_locale)(format) || format];
	}

	if (!format) {
		throw new Error('Phone number format was not specified for formatting value "' + value + '"');
	}

	// Sanity check
	if (!value) {
		return '';
	}

	// Convert plaintext international into plaintext local (if needed)
	// (don't prepend trunk prefix)
	value = plaintext_local(value, format, with_trunk_prefix);

	if (!value) {
		return '';
	}

	// Populate phone template (without trunk prefix) with digits
	return populate_template(template(format, value, with_trunk_prefix), value);
}

// Formats an plaintext phone number
// (either local or international)
// as an international phone number.
//
// E.g.: "+79991234567" -> "+7 999 123 45 67"
// E.g.:   "9991234567" -> "+7 999 123 45 67"
function format_international(value, format) {
	var number = format_local(value, format)
	// Remove brackets
	.replace(/[\(\)]/g, '')
	// Replace dashes with spaces
	.replace(/\-/g, ' ').trim();

	// Trim trunk prefix
	number = trim_trunk_prefix(number, format);

	return '+' + format.country + ' ' + number;
}

// Populates local phone template with `digits`
// (which are plaintext local phone number).
//
// E.g. ("(AAA) BBB-BB-BB", "1234567890") -> "(123) 456-78-90"
//              ("8 (xxx) xxx-xx-xx", "") -> ""
//             ("8 (xxx) xxx-xx-xx", "8") -> "8"
//            ("8 (xxx) xxx-xx-xx", "81") -> "8 (1  )"
//           ("8 (xxx) xxx-xx-xx", "812") -> "8 (12 )"
//          ("8 (xxx) xxx-xx-xx", "8123") -> "8 (123)"
//   ("8 (xxx) xxx-xx-xx", "81234567890") -> "8 (123) 456-78-90"
//
function populate_template(template, digits) {
	if (!digits) {
		return '';
	}

	var populated = '';
	var digit_index = 0;
	var brace_open = false;
	var symbol_index = 0;
	var symbol = void 0;

	// Replace letters with digits in a cycle
	while (symbol_index < template.length) {
		symbol = template[symbol_index];

		if (symbol >= 'A' && symbol <= 'z' || symbol >= '0' && symbol <= '9') {
			symbol = digits[digit_index];
			digit_index++;
		} else if (symbol === '(') {
			brace_open = true;
		}

		populated += symbol;
		symbol_index++;

		if (digit_index === digits.length) {
			break;
		}
	}

	// If a parenthesis was opened, then close it,
	// and trim everything else.
	if (brace_open) {
		return populated + template.slice(symbol_index, template.indexOf(')') + 1).replace(/[0-9A-z]/g, ' ');
	}

	// Otherwise just trim everything after the last populated letter
	return populated;
}

// Returns digit count in a local phone number format template
// (count trunk prefix digits in)
//
// E.g. "8 (AAA) BBB-BB-BB" -> 11
//
function digits_in_local_phone_number_template(format, plaintext_local, with_trunk_prefix) {
	var _template = template(format, plaintext_local);
	var regular_expression = with_trunk_prefix === false ? /[A-z]/g : /[0-9A-z]/g;
	return (_template.match(regular_expression) || []).length;
}

// Returns digit count in an international phone number format template
// (ignoring trunk prefix digits)
//
// E.g. "8 (AAA) BBB-BB-BB" -> 10
//
function digits_in_international_phone_number_template(format, plaintext_international) {
	var _template = template(format, plaintext_local(plaintext_international, format));
	return (_template.match(/[A-z]/g) || []).length;
}

// Finds digit index in value at caret position
// (if there's no digit at caret position then 
//  returns the index of the closest next digit)
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
function digit_index(value, caret_position) {
	return count_digits(value.slice(0, caret_position));
}

// Finds index of digit symbol in template.
//
// E.g. (0, "(AAA) BBB-BB-BB") -> 1 (first digit is at index 1 in template string)
//            ^
//      (1, "(AAA) BBB-BB-BB") -> 2 (second digit is at index 2 in template string)
//             ^
//      (2, "(AAA) BBB-BB-BB") -> 3 (third digit is at index 3 in template string)
//              ^
//      (3, "(AAA) BBB-BB-BB") -> 6 (fourth digit is at index 6 in template string)
//                 ^
//      (4, "(AAA) BBB-BB-BB") -> 7 (fifth digit is at index 7 in template string)
//                  ^
//
function index_in_template(digit_index, format, digits, with_trunk_prefix) {
	var phone_template = template(format, digits, with_trunk_prefix);

	var digit_index_so_far = -1;
	var i = 0;
	while (i <= phone_template.length) {
		if (phone_template[i] >= 'A' && phone_template[i] <= 'z' || with_trunk_prefix !== false && phone_template[i] >= '0' && phone_template[i] <= '9') {
			digit_index_so_far++;
		}

		if (digit_index_so_far === digit_index) {
			return i;
		}

		i++;
	}
}

// Converts a plaintext (local or international)
// phone number to an international one.
//
// E.g. "+78005553535" -> "+78005553535"
//        "8005553535" -> "+78005553535"
//       "07700900756" -> "+447700900756"
function plaintext_international(plaintext, format, with_trunk_prefix) {
	if (!plaintext) {
		return '';
	}

	// If it's already plaintext international, then don't change it
	if (plaintext[0] === '+') {
		return plaintext;
	}

	// Otherwise it's a local plaintext phone number

	// Trim trunk prefix from the phone number,
	// and add country code with a '+' sign to it.

	if (with_trunk_prefix !== false) {
		plaintext = trim_trunk_prefix(plaintext, format);
	}

	if (!plaintext) {
		return '';
	}

	return '+' + format.country + plaintext;
}

// Converts a plaintext (local or international)
// phone number to a local one.
//
// E.g.  "07700900756" -> "07700900756"
//     "+447700900756" -> "07700900756"
//
function plaintext_local(plaintext, format, with_trunk_prefix) {
	if (!plaintext) {
		return '';
	}

	// If it's already plaintext local, then don't change it
	if (plaintext[0] !== '+') {
		return plaintext;
	}

	// Otherwise it's plaintext international
	// so trim country code along with the '+' sign
	// and add trunk prefix

	plaintext = plaintext.slice('+'.length + format.country.length);

	if (with_trunk_prefix !== false) {
		plaintext = add_trunk_prefix(plaintext, format);
	}

	return plaintext;
}

// Trims trunk prefix from the phone number
// https://en.wikipedia.org/wiki/Trunk_prefix
//
// E.g. "88005553535" -> "8005553535" // Russia
//      "07700900756" -> "7700900756" // UK
//
function trim_trunk_prefix(digits, format) {
	return digits.slice(trunk_prefix(format, digits).length);
}

// Adds trunk prefix to the phone number
// https://en.wikipedia.org/wiki/Trunk_prefix
//
// E.g. "8005553535" -> "88005553535" // Russia
//      "7700900756" -> "07700900756" // UK
//
function add_trunk_prefix(digits, format) {
	return trunk_prefix(format, digits) + digits;
}

// Extracts trunk prefix from phone number format
// https://en.wikipedia.org/wiki/Trunk_prefix
//
function trunk_prefix(format) {
	var digits = arguments.length <= 1 || arguments[1] === undefined ? '' : arguments[1];

	var trunk_prefix = '';

	var _iteratorNormalCompletion = true;
	var _didIteratorError = false;
	var _iteratorError = undefined;

	try {
		for (var _iterator = (0, _getIterator3.default)(template(format, digits)), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
			var symbol = _step.value;

			if (symbol >= '0' && symbol <= '9') {
				trunk_prefix += symbol;
			} else if (symbol >= 'A' && symbol <= 'z') {
				break;
			}
		}
	} catch (err) {
		_didIteratorError = true;
		_iteratorError = err;
	} finally {
		try {
			if (!_iteratorNormalCompletion && _iterator.return) {
				_iterator.return();
			}
		} finally {
			if (_didIteratorError) {
				throw _iteratorError;
			}
		}
	}

	return trunk_prefix;
}

// Counts all occurences of a symbol in a string
function count_occurences(symbol, string) {
	var count = 0;

	var _iteratorNormalCompletion2 = true;
	var _didIteratorError2 = false;
	var _iteratorError2 = undefined;

	try {
		for (var _iterator2 = (0, _getIterator3.default)(string), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
			var character = _step2.value;

			if (character === symbol) {
				count++;
			}
		}
	} catch (err) {
		_didIteratorError2 = true;
		_iteratorError2 = err;
	} finally {
		try {
			if (!_iteratorNormalCompletion2 && _iterator2.return) {
				_iterator2.return();
			}
		} finally {
			if (_didIteratorError2) {
				throw _iteratorError2;
			}
		}
	}

	return count;
}
//# sourceMappingURL=phone.js.map