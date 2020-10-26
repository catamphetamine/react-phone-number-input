import React from 'react'
import PropTypes from 'prop-types'

import InputSmart from './InputSmart'
import InputBasic from './InputBasic'
import usePhoneDigits from './usePhoneDigits'

export function createInput(defaultMetadata) {
	function PhoneInput({
		country,
		defaultCountry,
		useNationalFormatForDefaultCountryValue,
		value,
		onChange,
		metadata,
		smartCaret,
		international,
		withCountryCallingCode,
		...rest
	}, ref) {
		// "Phone digits" includes not only "digits" but also a `+` sign.
		const [
			phoneDigits,
			setPhoneDigits
		] = usePhoneDigits({
			value,
			onChange,
			country,
			defaultCountry,
			international,
			withCountryCallingCode,
			useNationalFormatForDefaultCountryValue,
			metadata
		})
		const InputComponent = smartCaret ? InputSmart : InputBasic
		return (
			<InputComponent
				{...rest}
				ref={ref}
				metadata={metadata}
				international={international}
				withCountryCallingCode={withCountryCallingCode}
				country={country || defaultCountry}
				value={phoneDigits}
				onChange={setPhoneDigits} />
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
		 * The phone number (in E.164 format).
		 * Examples: `undefined`, `"+12"`, `"+12133734253"`.
		 */
		value: PropTypes.string,

		/**
		 * Updates the `value`.
		 */
		onChange: PropTypes.func.isRequired,

		/**
		 * A two-letter country code for formatting `value`
		 * as a national phone number (example: `(213) 373-4253`),
		 * or as an international phone number without "country calling code"
		 * if `international` property is passed (example: `213 373 4253`).
		 * Example: "US".
		 * If no `country` is passed then `value`
		 * is formatted as an international phone number.
		 * (example: `+1 213 373 4253`)
		 */
		country: PropTypes.string,

		/**
		 * A two-letter country code for formatting `value`
		 * when a user inputs a national phone number (example: `(213) 373-4253`).
		 * The user can still input a phone number in international format.
		 * Example: "US".
		 * `country` and `defaultCountry` properties are mutually exclusive.
		 */
		defaultCountry: PropTypes.string,

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
		 * The `<input/>` component.
		 */
		inputComponent: PropTypes.elementType,

		/**
		 * By default, the caret position is being "intelligently" managed
		 * while a user inputs a phone number.
		 * This "smart" caret behavior can be turned off
		 * by passing `smartCaret={false}` property.
		 * This is just an "escape hatch" for any possible caret position issues.
		 */
		// Is `true` by default.
		smartCaret: PropTypes.bool.isRequired,

		/**
		 * When `defaultCountry` is defined and the initial `value` corresponds to `defaultCountry`,
		 * then the `value` will be formatted as a national phone number by default.
		 * To format the initial `value` of `defaultCountry` as an international number instead
		 * set `useNationalFormatForDefaultCountryValue` property to `true`.
		 */
		useNationalFormatForDefaultCountryValue: PropTypes.bool.isRequired,

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
		 * Set to `false` to use "basic" caret instead of the "smart" one.
		 */
		smartCaret: true,

		/**
		 * Set to `true` to force international phone number format
		 * (without "country calling code") when `country` is specified.
		 */
		// international: false,

		/**
		 * Prefer national format when formatting E.164 phone number `value`
		 * corresponding to `defaultCountry`.
		 */
		useNationalFormatForDefaultCountryValue: true,

		/**
		 * `libphonenumber-js` metadata.
		 */
		metadata: defaultMetadata
	}

	return PhoneInput
}

export default createInput()