import React, { useCallback } from 'react'
import PropTypes from 'prop-types'

import InputBasic from './InputBasic'

export function createInput(defaultMetadata) {
	function PhoneInput({
		country,
		value,
		onChange,
		...rest
	}, ref) {
		const onChangeHandler = useCallback((value) => {
			if (country) {
				// Force an absence of `+` in the beginning of a `value`
				// when a `country` has been specified.
				if (value && value[0] === '+') {
					value = value.slice(1)
				}
			} else {
				// Force a `+` in the beginning of a `value`
				// when no `country` has been specified.
				if (value && value[0] !== '+') {
					value = '+' + value
				}
			}
			if (value === '') {
				value = undefined
			}
			onChange(value)
		}, [onChange, country])
		return (
			<InputBasic
				{...rest}
				ref={ref}
				country={country}
				value={value || ''}
				onChange={onChangeHandler} />
		)
	}

	PhoneInput = React.forwardRef(PhoneInput)

	PhoneInput.propTypes = {
		/**
		 * HTML `<input/>` `type` attribute.
		 */
		type: PropTypes.string,

		/**
		 * HTML `<input/>` `autocomplete` attribute.
		 */
		autoComplete: PropTypes.string,

		/**
		 * A two-letter country code for formatting `value`
		 * as a national phone number (e.g. `(800) 555 35 35`).
		 * Examples: "US", "RU", etc.
		 * If no `country` is passed then `value`
		 * is formatted as an international phone number.
		 * (for example, `+7 800 555 35 35`)
		 */
		country: PropTypes.string,

		/**
		 * The parsed phone number.
		 * Examples: `undefined`, `""`, `"+"`, `"+123"`, `"123"`.
		 */
		value: PropTypes.string,

		/**
		 * Updates the `value`.
		 */
		onChange: PropTypes.func.isRequired,

		/**
		 * The `<input/>` component.
		 */
		inputComponent: PropTypes.elementType,

		/**
		 * `libphonenumber-js` metadata.
		 */
		metadata: PropTypes.object.isRequired
	}

	PhoneInput.defaultProps = {
		/**
		 * HTML `<input/>` `type="tel"`.
		 */
		type: 'tel',

		/**
		 * Remember (and autofill) the value as a phone number.
		 */
		autoComplete: 'tel',

		/**
		 * `libphonenumber-js` metadata.
		 */
		metadata: defaultMetadata
	}

	return PhoneInput
}

export default createInput()