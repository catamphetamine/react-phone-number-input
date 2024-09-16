import React, { useCallback } from 'react'
import PropTypes from 'prop-types'
import { parseIncompletePhoneNumber, formatIncompletePhoneNumber } from 'libphonenumber-js/core'

import { getPrefixForFormattingValueAsPhoneNumber, removePrefixFromFormattedPhoneNumber } from './helpers/inputValuePrefix.js'

import useInputKeyDownHandler from './useInputKeyDownHandler.js'

export function createInput(defaultMetadata) {
	/**
	 * `InputBasic` is the most basic implementation of a `Component`
	 * that can be passed to `<PhoneInput/>`. It parses and formats
	 * the user's input but doesn't control the caret in the process:
	 * when erasing or inserting digits in the middle of a phone number
	 * the caret usually jumps to the end (this is the expected behavior).
	 * Why does `InputBasic` exist when there's `InputSmart`?
	 * One reason is working around the [Samsung Galaxy smart caret positioning bug]
	 * (https://github.com/catamphetamine/react-phone-number-input/issues/75).
	 * Another reason is that, unlike `InputSmart`, it doesn't require DOM environment.
	 */
	function InputBasic({
		value,
		onChange,
		onKeyDown,
		country,
		inputFormat,
		metadata = defaultMetadata,
		inputComponent: Input = 'input',
		...rest
	}, ref) {
		const prefix = getPrefixForFormattingValueAsPhoneNumber({
			inputFormat,
			country,
			metadata
		})

		const _onChange = useCallback((event) => {
			let newValue = parseIncompletePhoneNumber(event.target.value)
			// By default, if a value is something like `"(123)"`
			// then Backspace would only erase the rightmost brace
			// becoming something like `"(123"`
			// which would give the same `"123"` value
			// which would then be formatted back to `"(123)"`
			// and so a user wouldn't be able to erase the phone number.
			//
			// This issue is worked around with this simple hack:
			// when "old" and "new" parsed values are the same,
			// it checks if the "new" formatted value could be obtained
			// from the "old" formatted value by erasing some (or no) characters at the right side.
			// If it could then it's likely that the user has hit a Backspace key
			// and what they really intended was to erase a rightmost digit rather than
			// a rightmost punctuation character.
			//
			if (newValue === value) {
				const newValueFormatted = format(prefix, newValue, country, metadata)
				if (newValueFormatted.indexOf(event.target.value) === 0) {
					// Trim the last digit (or plus sign).
					newValue = newValue.slice(0, -1)
				}
			}
			onChange(newValue)
		}, [
			prefix,
			value,
			onChange,
			country,
			metadata
		])

		const _onKeyDown = useInputKeyDownHandler({
			onKeyDown,
			inputFormat
		})

		return (
			<Input
				{...rest}
				ref={ref}
				value={format(prefix, value, country, metadata)}
				onChange={_onChange}
				onKeyDown={_onKeyDown}/>
		)
	}

	InputBasic = React.forwardRef(InputBasic)

	InputBasic.propTypes = {
		/**
		 * The parsed phone number.
		 * "Parsed" not in a sense of "E.164"
		 * but rather in a sense of "having only
		 * digits and possibly a leading plus character".
		 * Examples: `""`, `"+"`, `"+123"`, `"123"`.
		 */
		value: PropTypes.string.isRequired,

		/**
		 * A function of `value: string`.
		 * Updates the `value` property.
		 */
		onChange: PropTypes.func.isRequired,

		/**
		 * A function of `event: Event`.
		 * Handles `keydown` events.
		 */
		onKeyDown: PropTypes.func,

		/**
		 * A two-letter country code for formatting `value`
		 * as a national phone number (e.g. `(800) 555 35 35`).
		 * E.g. "US", "RU", etc.
		 * If no `country` is passed then `value`
		 * is formatted as an international phone number.
		 * (e.g. `+7 800 555 35 35`)
		 * This property should've been called `defaultCountry`
		 * because it only applies when the user inputs a phone number in a national format
		 * and is completely ignored when the user inputs a phone number in an international format.
		 */
		country : PropTypes.string,

		/**
		 * The format that the input field value is being input/output in.
		 */
		inputFormat : PropTypes.oneOf([
			'INTERNATIONAL',
			'NATIONAL_PART_OF_INTERNATIONAL',
			'NATIONAL',
			'INTERNATIONAL_OR_NATIONAL'
		]).isRequired,

		/**
		 * `libphonenumber-js` metadata.
		 */
		metadata: PropTypes.object,

		/**
		 * The `<input/>` component.
		 */
		inputComponent: PropTypes.elementType
	}

	return InputBasic
}

export default createInput()

function format(prefix, value, country, metadata) {
	return removePrefixFromFormattedPhoneNumber(
		formatIncompletePhoneNumber(
			prefix + value,
			country,
			metadata
		),
		prefix
	)
}