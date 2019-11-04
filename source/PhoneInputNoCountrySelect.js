import React, { useState, useCallback, useEffect } from 'react'
import PropTypes from 'prop-types'
import { AsYouType } from 'libphonenumber-js/core'

import InputBasic from './InputBasic'

export function createInput(defaultMetadata) {
	function PhoneInput({
		country,
		value,
		onChange,
		metadata,
		...rest
	}, ref) {
		const [prevCountry, setPrevCountry] = useState(country)
		const [parsedInput, setParsedInput] = useState(getParsedInputForValue(value, country, metadata))
		const [valueForParsedInput, setValueForParsedInput] = useState(value)
		// If `value` property has been changed externally
		// then re-initialize the component.
		useEffect(() => {
			if (value !== valueForParsedInput) {
				setParsedInput(getParsedInputForValue(value, country, metadata))
				setValueForParsedInput(value)
			}
		}, [value])
		// If the `country` has been changed then re-initialize the component.
		useEffect(() => {
			if (country !== prevCountry) {
				setPrevCountry(country)
				setParsedInput(getParsedInputForValue(value, country, metadata))
			}
		}, [country])
		// Call `onChange` after the new `valueForParsedInput` has been applied.
		useEffect(() => {
			if (valueForParsedInput !== value) {
				onChange(valueForParsedInput)
			}
		}, [valueForParsedInput])
		const onParsedInputChange = useCallback((parsedInput) => {
			let value
			if (country) {
				// Won't allow `+` in the beginning
				// when a `country` has been specified.
				if (parsedInput && parsedInput[0] === '+') {
					parsedInput = parsedInput.slice(1)
				}
				// Convert `parsedInput` to `value`.
				if (parsedInput) {
					const asYouType = new AsYouType(country, metadata)
					asYouType.input(parsedInput)
					const phoneNumber = asYouType.getNumber()
					if (phoneNumber) {
						value = phoneNumber.number
					}
				}
			} else {
				// Force a `+` in the beginning of a `value`
				// when no `country` has been specified.
				if (parsedInput && parsedInput[0] !== '+') {
					parsedInput = '+' + parsedInput
				}
				// Convert `parsedInput` to `value`.
				if (parsedInput) {
					value = parsedInput
				}
			}
			setParsedInput(parsedInput)
			setValueForParsedInput(value)
		}, [country, metadata, setParsedInput, setValueForParsedInput])
		return (
			<InputBasic
				{...rest}
				ref={ref}
				metadata={metadata}
				country={country}
				value={parsedInput}
				onChange={onParsedInputChange} />
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
		inputComponent: PropTypes.element,

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

function getParsedInputForValue(value, country, metadata) {
	if (!value) {
		return ''
	}
	if (!country) {
		return value
	}
	const asYouType = new AsYouType(country, metadata)
	asYouType.input(value)
	const phoneNumber = asYouType.getNumber()
	if (phoneNumber) {
		// Even if the actual country of the `value` being passed
		// doesn't match the `country` property,
		// still format the national number.
		// This is some kind of an "error recovery" procedure.
		if (phoneNumber.country && phoneNumber.country !== country) {
			console.error(`[react-phone-number-input] Phone number ${value} corresponds to country ${phoneNumber.country} but ${country} was specified instead.`)
		}
		return phoneNumber.formatNational()
	} else {
		return ''
	}
}