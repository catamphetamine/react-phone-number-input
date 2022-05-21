import React, { useCallback } from 'react'
import PropTypes from 'prop-types'
import { parseIncompletePhoneNumber, formatIncompletePhoneNumber } from 'libphonenumber-js/core'

import { getInputValuePrefix, removeInputValuePrefix } from './helpers/inputValuePrefix.js'

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
		country,
		international,
		withCountryCallingCode,
		metadata,
		inputComponent: Input,
		...rest
	}, ref) {
		const prefix = getInputValuePrefix({
			country,
			international,
			withCountryCallingCode,
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
			// Working around this issue with this simple hack.
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

		return (
			<Input
				{...rest}
				ref={ref}
				value={format(prefix, value, country, metadata)}
				onChange={_onChange}/>
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
		 * A two-letter country code for formatting `value`
		 * as a national phone number (e.g. `(800) 555 35 35`).
		 * E.g. "US", "RU", etc.
		 * If no `country` is passed then `value`
		 * is formatted as an international phone number.
		 * (e.g. `+7 800 555 35 35`)
		 * Perhaps the `country` property should have been called `defaultCountry`
		 * because if `value` is an international number then `country` is ignored.
		 */
		country : PropTypes.string,

		/**
		 * If `country` property is passed along with `international={true}` property
		 * then the phone number will be input in "international" format for that `country`
		 * (without "country calling code").
		 * For example, if `country="US"` property is passed to "without country select" input
		 * then the phone number will be input in the "national" format for `US` (`(213) 373-4253`).
		 * But if both `country="US"` and `international={true}` properties are passed then
		 * the phone number will be input in the "international" format for `US` (`213 373 4253`)
		 * (without "country calling code" `+1`).
		 */
		international: PropTypes.bool,

		/**
		 * If `country` and `international` properties are set,
		 * then by default it won't include "country calling code" in the input field.
		 * To change that, pass `withCountryCallingCode` property,
		 * and it will include "country calling code" in the input field.
		 */
		withCountryCallingCode: PropTypes.bool,

		/**
		 * `libphonenumber-js` metadata.
		 */
		metadata: PropTypes.object.isRequired,

		/**
		 * The `<input/>` component.
		 */
		inputComponent: PropTypes.elementType.isRequired
	}

	InputBasic.defaultProps = {
		metadata: defaultMetadata,
		inputComponent: 'input'
	}

	return InputBasic
}

export default createInput()

function format(prefix, value, country, metadata) {
	return removeInputValuePrefix(
		formatIncompletePhoneNumber(
			prefix + value,
			country,
			metadata
		),
		prefix
	)
}