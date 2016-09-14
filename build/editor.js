'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = edit;

var _phone = require('./phone');

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
function edit(value, caret_position, format) {
	var options = arguments.length <= 3 || arguments[3] === undefined ? {} : arguments[3];

	if (options.selection && options.backspace) {
		options.backspace = false;
		options.delete = true;
	}

	// `options.with_trunk_prefix`
	var caret_position_for_digit = function caret_position_for_digit(digit_index, digit_count, digits) {
		return _caret_position_for_digit(digit_index, digit_count, format, digits, options.with_trunk_prefix);
	};

	// Phone number digits (may be altered later)
	var digits = (0, _phone.local_phone_digits)(value, format, options.with_trunk_prefix);

	// How many are there digits in a valid local phone number
	// (including trunk prefix)
	var digits_in_phone_number = (0, _phone.digits_in_local_phone_number_template)(format, value, options.with_trunk_prefix);

	// Trim excessive digits (just in case)
	if (digits.length > digits_in_phone_number) {
		digits = digits.substring(0, digits_in_phone_number.length);
	}

	// Current digit index in the phone number
	// (not a character index, but a digit index)
	var digit_index = (0, _phone.digit_index)(value, caret_position);

	// Adjust caret position
	if (options.backspace) {
		// Find the previous (the one being erased) digit index
		// inside a valid phone number.
		var previous_digit_index = digit_index - 1;

		// If there's no previous digit,
		// then just position the caret before the first digit.
		if (previous_digit_index < 0) {
			// (if there is the first digit)
			caret_position = caret_position_for_digit(0, digits.length, digits);
		}
		// Else, if there is previous digit,
		// then erase it and reposition the caret.
		else {
				// If the input is broken, then just position the caret
				// after the last valid digit.
				if (previous_digit_index >= digits_in_phone_number) {
					// Position the caret after the last digit in phone number
					caret_position = caret_position_for_digit(digits.length - 1, digits.length, digits) + 1;
				} else {
					// Remove the previous digit
					digits = digits.substring(0, previous_digit_index) + digits.substring(digit_index);

					// Position the caret before the erased digit
					caret_position = caret_position_for_digit(previous_digit_index, digits.length, digits);
				}
			}
	} else if (options.delete) {
		// If there was any selection, then simply erase it
		if (options.selection) {
			value = value.substring(0, caret_position) + value.substring(options.selection.end);
			digits = (0, _phone.local_phone_digits)(value, format, options.with_trunk_prefix);

			// Leave the caret position at the same digit
			caret_position = caret_position_for_digit(digit_index, digits.length, digits);
		}
		// No selection was made, just erase a single digit
		else {
				// If the input is broken, just adjust the caret position
				if (digit_index >= digits_in_phone_number) {
					// Position the caret after the last digit in phone number
					caret_position = caret_position_for_digit(digits.length - 1, digits.length, digits) + 1;
				}
				// Find the current digit, remove it and reposition the caret
				else {
						// Remove current digit
						digits = digits.substring(0, digit_index) + digits.substring(digit_index + 1);

						// Leave the caret position at the same digit
						caret_position = caret_position_for_digit(digit_index, digits.length, digits);
					}
			}
	}
	// If a regular keyboard key was pressed
	else {
			// Position the caret before the next digit
			caret_position = caret_position_for_digit(digit_index, digits.length, digits);
		}

	return { phone: (0, _phone.format_local)(digits, format, options.with_trunk_prefix), caret: caret_position };
}

// Calculates caret position for digit index
// (not character index) in a phone number of a given format
function _caret_position_for_digit(digit_index, digit_count, format, digits, with_trunk_prefix) {
	// Special case
	if (digit_count === 0) {
		return 0;
	}

	// In case of overflow (e.g. on Paste)
	if (digit_index >= digit_count) {
		// Position the caret after the last digit
		return (0, _phone.index_in_template)(digit_count - 1, format, digits, with_trunk_prefix) + 1;
	}

	return (0, _phone.index_in_template)(digit_index, format, digits, with_trunk_prefix);
}
module.exports = exports['default'];
//# sourceMappingURL=editor.js.map