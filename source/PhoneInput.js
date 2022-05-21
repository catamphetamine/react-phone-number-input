import React from 'react'
import PropTypes from 'prop-types'

import usePhoneDigits from './usePhoneDigits.js'

function PhoneInput({
	Component,
	country,
	defaultCountry,
	useNationalFormatForDefaultCountryValue,
	value,
	onChange,
	metadata,
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
	return (
		<Component
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
	 * The phone number (in E.164 format).
	 * Examples: `"+12"`, `"+12133734253"`.
	 * An "empty" `value` could be represented by any "falsy" value like `undefined`, `null` or an empty string `""`.
	 */
	value: PropTypes.string,

	/**
	 * A function of `value: string?`.
	 * Updates the `value` property (to `undefined` in case it's empty).
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
	 * A component that renders the `<input/>` itself and also
	 * parses and formats its `value` as the user inputs it.
	 */
	Component: PropTypes.elementType.isRequired,

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
	 * Set to `true` to force international phone number format
	 * (without "country calling code") when `country` is specified.
	 */
	// international: false,

	/**
	 * Prefer national format when formatting E.164 phone number `value`
	 * corresponding to `defaultCountry`.
	 */
	useNationalFormatForDefaultCountryValue: true
}

export default PhoneInput