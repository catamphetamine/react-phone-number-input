import { parsePhoneNumberCharacter } from 'libphonenumber-js/core'

/**
 * Parses next character while parsing phone number digits (including a `+`)
 * from text: discards everything except `+` and digits, and `+` is only allowed
 * at the start of a phone number.
 * For example, is used in `react-phone-number-input` where it uses
 * [`input-format`](https://gitlab.com/catamphetamine/input-format).
 * @param  {string} character - Yet another character from raw input string.
 * @param  {string?} prevParsedCharacters - Previous parsed characters.
 * @param  {object?} context - An optional object that could be used by this function to set arbitrary "flags". The object should be shared within the parsing of the whole string.
 * @return {string?} The parsed character.
 */
export default function parsePhoneNumberCharacter_(character, prevParsedCharacters, context) {
	// `context` argument was added as a third argument of `parse()` function
	// in `input-format` package on Dec 26th, 2023. So it could potentially be
	// `undefined` here if a 3rd-party app somehow ends up with this newer version
	// of `react-phone-number-input` and an older version of `input-format`.
	// Dunno how, but just in case, it could be `undefined` here and it wouldn't break.
	// Maybe it's not required to handle `undefined` case here.
	//
	// The addition of the `context` argument was to fix the slightly-weird behavior
	// of parsing an input string when the user inputs something like `"2+7"
	// https://github.com/catamphetamine/react-phone-number-input/issues/437
	//
	// If the parser encounters an unexpected `+` in a string being parsed
	// then it simply discards that out-of-place `+` and any following characters.
	//
	if (context && context.ignoreRest) {
		return
	}

	const emitEvent = (eventName) => {
		if (context) {
			switch (eventName) {
				case 'end':
					context.ignoreRest = true
					break
			}
		}
	}

	return parsePhoneNumberCharacter(character, prevParsedCharacters, emitEvent)
}