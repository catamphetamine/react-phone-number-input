import { useRef, useState, useCallback, useEffect } from 'react'
import { AsYouType, getCountryCallingCode, parseDigits } from 'libphonenumber-js/core'

import getInternationalPhoneNumberPrefix from './helpers/getInternationalPhoneNumberPrefix.js'
import { validateE164Number } from './helpers/isE164Number.js'
import { removePrefixFromFormattedPhoneNumber } from './helpers/inputValuePrefix.js'

/**
 * Returns `[phoneDigits, setPhoneDigits]`.
 * "Phone digits" includes not only "digits" but also a `+` sign.
 */
export default function usePhoneDigits({
	value,
	onChange,
	country,
	defaultCountry,
	international,
	withCountryCallingCode,
	useNationalFormatForDefaultCountryValue,
	metadata
}) {
	// Validate the use of `withCountryCallingCode` property.
	if (typeof withCountryCallingCode === 'boolean' && !(country && international)) {
		console.error('[react-phone-number-input] `withCountryCallingCode` property can only be used together with `country` and `international` properties')
	}

	// Validate the use of `country` and `defaultCountry` properties.
	if (country && defaultCountry) {
		console.error('[react-phone-number-input] When `country` property is passed, `defaultCountry` property has no effect and therefore shouldn\'t be passed')
	}

	// Validate the use of `international` property.
	if (typeof international === 'boolean' && !country) {
		console.error('[react-phone-number-input] `international` property can only be used together with `country` property')
	}

	const inputFormat = getInputFormat({
		international,
		country,
		defaultCountry,
		withCountryCallingCode
	})

	const countryMismatchDetected = useRef()
	const onCountryMismatch = (value, country, actualCountry) => {
		console.error(`[react-phone-number-input] Expected phone number ${value} to correspond to country ${country} but ${actualCountry ? 'in reality it corresponds to country ' + actualCountry : 'it doesn\'t'}.`)
		countryMismatchDetected.current = true
	}

	const getInitialPhoneDigits = (options) => {
		// Validate that the initially-supplied `value` is in `E.164` format.
		// Because sometimes people attempt to supply a `value` like "+1 (879) 490-8676".
		// https://gitlab.com/catamphetamine/react-phone-number-input/-/issues/231#note_2016334796
		if (value) {
			validateE164Number(value)
		}

		return getPhoneDigitsForValue(
			value,
			country,
			defaultCountry,
			inputFormat,
			useNationalFormatForDefaultCountryValue,
			metadata,
			(...args) => {
				if (options && options.onCountryMismatch) {
					options.onCountryMismatch()
				}
				onCountryMismatch.apply(this, args)
			}
		)
	}

	// This is only used to detect `country` property change.
	const [prevCountry, setPrevCountry] = useState(country)

	// This is only used to detect `defaultCountry` property change.
	const [prevDefaultCountry, setPrevDefaultCountry] = useState(defaultCountry)

	// `phoneDigits` is the a property that gets passed to the `<input/>` component as its "value":
	// * `phoneDigits` is the `<input value/>` property.
	// * `value` is the `<PhoneInput value/>` property.
	const [phoneDigits, setPhoneDigits] = useState(getInitialPhoneDigits())

	// This is only used to detect `value` property changes.
	const [valueForPhoneDigits, setValueForPhoneDigits] = useState(value)

	// Rerender hack.
	const [rerenderTrigger, setRerenderTrigger] = useState()
	const rerender = useCallback(() => setRerenderTrigger({}), [setRerenderTrigger])

	function getValueForPhoneDigits(phoneDigits) {
		// If the user hasn't input any digits then `value` is `undefined`.
		if (!phoneDigits) {
			return
		}
		if (inputFormat === 'NATIONAL_PART_OF_INTERNATIONAL') {
			phoneDigits = `+${getCountryCallingCode(country, metadata)}${phoneDigits}`
		}
		// Return the E.164 phone number value.
		//
		// Even if no "national (significant) number" digits have been input,
		// still return a non-`undefined` value.
		// https://gitlab.com/catamphetamine/react-phone-number-input/-/issues/113
		//
		// For example, if the user has selected country `US` and entered `"1"`
		// then that `"1"` is just a "national prefix" and no "national (significant) number"
		// digits have been input yet. Still, return `"+1"` as `value` in such cases,
		// because otherwise the app would think that the input is empty and mark it as such
		// while in reality it isn't empty, which might be thought of as a "bug", or just
		// a "weird" behavior.
		//
		// The only case when there's any input and `getNumberValue()` still returns `undefined`
		// is when that input is `"+"`.
		//
		const asYouType = new AsYouType(country || defaultCountry, metadata)
		asYouType.input(phoneDigits)
		return asYouType.getNumberValue()
	}

	// If `value` property has been changed externally
	// then re-initialize the component.
	useEffect(() => {
		if (value !== valueForPhoneDigits) {
			setValueForPhoneDigits(value)
			setPhoneDigits(getInitialPhoneDigits())
		}
	}, [value])

	// If the `country` has been changed then re-initialize the component.
	useEffect(() => {
		if (country !== prevCountry) {
			setPrevCountry(country)
			let countryMismatchDetected
			const phoneDigits = getInitialPhoneDigits({
				onCountryMismatch() {
					countryMismatchDetected = true
				}
			})
			setPhoneDigits(phoneDigits)
			if (countryMismatchDetected) {
				setValueForPhoneDigits(getValueForPhoneDigits(phoneDigits))
			}
		}
	}, [country])

	// If the `defaultCountry` has been changed then re-initialize the component.
	useEffect(() => {
		if (defaultCountry !== prevDefaultCountry) {
			setPrevDefaultCountry(defaultCountry)
			setPhoneDigits(getInitialPhoneDigits())
		}
	}, [defaultCountry])

	// Update the `value` after `valueForPhoneDigits` has been updated.
	useEffect(() => {
		if (valueForPhoneDigits !== value) {
			onChange(valueForPhoneDigits)
		}
	}, [valueForPhoneDigits])

	const onSetPhoneDigits = useCallback((phoneDigits) => {
		let value
		if (country) {
			if (inputFormat === 'INTERNATIONAL') {
				// The `<input/>` value must start with the country calling code.
				const prefix = getInternationalPhoneNumberPrefix(country, metadata)
				if (phoneDigits.indexOf(prefix) !== 0) {
					// If a user tabs into a phone number input field
					// that is in `withCountryCallingCode` mode,
					// and then starts inputting local phone number digits,
					// the first digit would get "swallowed" if the fix below wasn't implemented.
					// https://gitlab.com/catamphetamine/react-phone-number-input/-/issues/43
					if (phoneDigits && phoneDigits[0] !== '+') {
						phoneDigits = prefix + phoneDigits
					} else {
						// // Reset phone digits if they don't start with the correct prefix.
						// // Undo the `<input/>` value change if it doesn't.
						if (countryMismatchDetected.current) {
							// In case of a `country`/`value` mismatch,
							// if it performed an "undo" here, then
							// it wouldn't let a user edit their phone number at all,
							// so this special case at least allows phone number editing
							// when `value` already doesn't match the `country`.
						} else {
							// If it simply did `phoneDigits = prefix` here,
							// then it could have no effect when erasing phone number
							// via Backspace, because `phoneDigits` in `state` wouldn't change
							// as a result, because it was `prefix` and it became `prefix`,
							// so the component wouldn't rerender, and the user would be able
							// to erase the country calling code part, and that part is
							// assumed to be non-eraseable. That's why the component is
							// forcefully rerendered here.
							setPhoneDigits(prefix)
							setValueForPhoneDigits(undefined)
							// Force a re-render of the `<input/>` with previous `phoneDigits` value.
							return rerender()
						}
					}
				}
			} else {
				// Entering phone number either in "NATIONAL" or in "NATIONAL_PART_OF_INTERNATIONAL" format.
				// Therefore, `+` is not allowed.
				if (phoneDigits && phoneDigits[0] === '+') {
					// Remove the `+`.
					phoneDigits = phoneDigits.slice(1)
				}
			}
		} else if (!defaultCountry) {
			// Force a `+` in the beginning of a `value`
			// when no `country` and `defaultCountry` have been specified.
			if (phoneDigits && phoneDigits[0] !== '+') {
				// Prepend a `+`.
				phoneDigits = '+' + phoneDigits
			}
		}
		// Convert `phoneDigits` to `value`.
		if (phoneDigits) {
			value = getValueForPhoneDigits(phoneDigits)
		}
		setPhoneDigits(phoneDigits)
		setValueForPhoneDigits(value)
	}, [
		country,
		inputFormat,
		defaultCountry,
		metadata,
		setPhoneDigits,
		setValueForPhoneDigits,
		rerender,
		countryMismatchDetected
	])

	return {
		phoneDigits,
		setPhoneDigits: onSetPhoneDigits,
		inputFormat
	}
}

/**
 * Returns phone number input field value for a E.164 phone number `value`.
 * @param  {string} [value]
 * @param  {string} [country]
 * @param  {string} [inputFormat]
 * @param  {string} [defaultCountry]
 * @param  {boolean} [useNationalFormatForDefaultCountryValue]
 * @param  {object} metadata
 * @return {string}
 */
function getPhoneDigitsForValue(
	value,
	country,
	defaultCountry,
	inputFormat,
	useNationalFormatForDefaultCountryValue,
	metadata,
	onCountryMismatch
) {
	if (country && inputFormat === 'INTERNATIONAL') {
		const prefix = getInternationalPhoneNumberPrefix(country, metadata)
		if (value) {
			if (value.indexOf(prefix) !== 0) {
				onCountryMismatch(value, country)
			}
			return value
		}
		return prefix
	}

	if (!value) {
		return ''
	}

	if (!country && !defaultCountry) {
		return value
	}

	const asYouType = new AsYouType(undefined, metadata)
	asYouType.input(value)
	const phoneNumber = asYouType.getNumber()

	if (phoneNumber) {
		if (country) {
			// Check for `country` property mismatch for the actual `value`.
			if (phoneNumber.country && phoneNumber.country !== country) {
				onCountryMismatch(value, country, phoneNumber.country)
			} else if (phoneNumber.countryCallingCode !== getCountryCallingCode(country, metadata)) {
				onCountryMismatch(value, country)
			}
			switch (inputFormat) {
				case 'NATIONAL':
					return parseDigits(phoneNumber.formatNational())
				case 'NATIONAL_PART_OF_INTERNATIONAL':
					return parseDigits(
						removePrefixFromFormattedPhoneNumber(
							phoneNumber.formatInternational(),
							getInternationalPhoneNumberPrefix(country, metadata)
						)
					)
				case 'INTERNATIONAL':
					throw new Error('`inputFormat: "INTERNATIONAL"` case should\'ve already been handled earlier in the code')
				case 'INTERNATIONAL_OR_NATIONAL':
					throw new Error('`inputFormat: "INTERNATIONAL_OR_NATIONAL"` is not possible when `country` is fixed')
				default:
					throw new Error(`Unknown \`inputFormat\`: ${inputFormat}`)
			}
		} else {
			// `phoneNumber.countryCallingCode` is compared here  instead of
			// `phoneNumber.country`, because, for example, a person could have
			// previously input a phone number (in "national" format) that isn't
			// 100% valid for the `defaultCountry`, and if `phoneNumber.country`
			// was compared, then it wouldn't match, and such phone number
			// wouldn't be formatted as a "national" one, and instead would be
			// formatted as an "international" one, confusing the user.
			// Comparing `phoneNumber.countryCallingCode` works around such issues.
			//
			// Example: `defaultCountry="US"` and the `<input/>` is empty.
			// The user inputs: "222 333 4444", which gets formatted to "(222) 333-4444".
			// The user then clicks "Save", the page is refreshed, and the user sees
			// that the `<input/>` value is now "+1 222 333 4444" which confuses the user:
			// the user expected the `<input/>` value to be "(222) 333-4444", same as it
			// was when they've just typed it in. The cause of the issue is that "222 333 4444"
			// is not a valid national number for US, and `phoneNumber.country` is compared
			// instead of `phoneNumber.countryCallingCode`. After the `phoneNumber.country`
			// comparison is replaced with `phoneNumber.countryCallingCode` one, the issue
			// is no longer the case.
			//
			if (phoneNumber.countryCallingCode && phoneNumber.countryCallingCode === getCountryCallingCode(defaultCountry, metadata) && useNationalFormatForDefaultCountryValue) {
				return parseDigits(phoneNumber.formatNational())
			}
			return value
		}
	} else {
		return ''
	}
}

function getInputFormat({
	international,
	country,
	defaultCountry,
	withCountryCallingCode
}) {
	return country ? (
		international ? (
			withCountryCallingCode ? 'INTERNATIONAL' : 'NATIONAL_PART_OF_INTERNATIONAL'
		) : 'NATIONAL'
	) : (
		defaultCountry ? 'INTERNATIONAL_OR_NATIONAL' : 'INTERNATIONAL'
	)
}