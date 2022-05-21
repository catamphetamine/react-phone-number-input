import {
	getInitialPhoneDigits,
	getCountryForPartialE164Number,
	parsePhoneNumber
} from './phoneInputHelpers.js'

import {
	isCountrySupportedWithError,
	getSupportedCountries
} from './countries.js'

export default function getPhoneInputWithCountryStateUpdateFromNewProps(props, prevProps, state) {
	const {
		metadata,
		countries,
		defaultCountry: newDefaultCountry,
		value: newValue,
		reset: newReset,
		international,
		// `displayInitialValueAsLocalNumber` property has been
		// superceded by `initialValueFormat` property.
		displayInitialValueAsLocalNumber,
		initialValueFormat
	} = props

	const {
		defaultCountry: prevDefaultCountry,
		value: prevValue,
		reset: prevReset
	} = prevProps

	const {
		country,
		value,
		// If the user has already manually selected a country
		// then don't override that already selected country
		// if the `defaultCountry` property changes.
		// That's what `hasUserSelectedACountry` flag is for.
		hasUserSelectedACountry
	} = state

	const _getInitialPhoneDigits = (parameters) => getInitialPhoneDigits({
		...parameters,
		international,
		useNationalFormat: displayInitialValueAsLocalNumber || initialValueFormat === 'national',
		metadata
	})

	// Some users requested a way to reset the component
	// (both number `<input/>` and country `<select/>`).
	// Whenever `reset` property changes both number `<input/>`
	// and country `<select/>` are reset.
	// It's not implemented as some instance `.reset()` method
	// because `ref` is forwarded to `<input/>`.
	// It's also not replaced with just resetting `country` on
	// external `value` reset, because a user could select a country
	// and then not input any `value`, and so the selected country
	// would be "stuck", if not using this `reset` property.
	// https://github.com/catamphetamine/react-phone-number-input/issues/300
	if (newReset !== prevReset) {
		return {
			phoneDigits: _getInitialPhoneDigits({
				value: undefined,
				defaultCountry: newDefaultCountry
			}),
			value: undefined,
			country: newDefaultCountry,
			hasUserSelectedACountry: undefined
		}
	}

	// `value` is the value currently shown in the component:
	// it's stored in the component's `state`, and it's not the `value` property.
	// `prevValue` is "previous `value` property".
	// `newValue` is "new `value` property".

	// If the default country changed
	// (e.g. in case of ajax GeoIP detection after page loaded)
	// then select it, but only if the user hasn't already manually
	// selected a country, and no phone number has been manually entered so far.
	// Because if the user has already started inputting a phone number
	// then they're okay with no country being selected at all ("International")
	// and they don't want to be disturbed, don't want their input to be screwed, etc.
	if (newDefaultCountry !== prevDefaultCountry) {
		const isNewDefaultCountrySupported = !newDefaultCountry || isCountrySupportedWithError(newDefaultCountry, metadata)
		const noValueHasBeenEnteredByTheUser = (
			// By default, "no value has been entered" means `value` is `undefined`.
			!value ||
			// When `international` is `true`, and some country has been pre-selected,
			// then the `<input/>` contains a pre-filled value of `+${countryCallingCode}${leadingDigits}`,
			// so in case of `international` being `true`, "the user hasn't entered anything" situation
			// doesn't just mean `value` is `undefined`, but could also mean `value` is `+${countryCallingCode}`.
			(international && value === _getInitialPhoneDigits({
				value: undefined,
				defaultCountry: prevDefaultCountry
			}))
		)
		// Only update the `defaultCountry` property if no phone number
		// has been entered by the user or pre-set by the application.
		const noValueHasBeenEntered = !newValue && noValueHasBeenEnteredByTheUser
		if (!hasUserSelectedACountry && isNewDefaultCountrySupported && noValueHasBeenEntered) {
			return {
				country: newDefaultCountry,
				// If `phoneDigits` is empty, then automatically select the new `country`
				// and set `phoneDigits` to `+{getCountryCallingCode(newCountry)}`.
				// The code assumes that "no phone number has been entered by the user",
				// and no `value` property has been passed, so the `phoneNumber` parameter
				// of `_getInitialPhoneDigits({ value, phoneNumber, ... })` is `undefined`.
				phoneDigits: _getInitialPhoneDigits({
					value: undefined,
					defaultCountry: newDefaultCountry
				}),
				// `value` is `undefined` and it stays so.
				value: undefined
			}
		}
	}

	// If a new `value` is set externally.
	// (e.g. as a result of an ajax API request
	//  to get user's phone after page loaded)
	// The first part — `newValue !== prevValue` —
	// is basically `props.value !== prevProps.value`
	// so it means "if value property was changed externally".
	// The second part — `newValue !== value` —
	// is for ignoring the `getDerivedStateFromProps()` call
	// which happens in `this.onChange()` right after `this.setState()`.
	// If this `getDerivedStateFromProps()` call isn't ignored
	// then the country flag would reset on each input.
	if (newValue !== prevValue && newValue !== value) {
		let phoneNumber
		let parsedCountry
		if (newValue) {
			phoneNumber = parsePhoneNumber(newValue, metadata)
			const supportedCountries = getSupportedCountries(countries, metadata)
			if (phoneNumber && phoneNumber.country) {
				// Ignore `else` because all countries are supported in metadata.
				/* istanbul ignore next */
				if (!supportedCountries || supportedCountries.indexOf(phoneNumber.country) >= 0) {
					parsedCountry = phoneNumber.country
				}
			} else {
				parsedCountry = getCountryForPartialE164Number(newValue, {
					country: undefined,
					countries: supportedCountries,
					metadata
				})
			}
		}
		let hasUserSelectedACountryUpdate
		if (!newValue) {
			// Reset `hasUserSelectedACountry` flag in `state`.
			hasUserSelectedACountryUpdate = {
				hasUserSelectedACountry: undefined
			}
		}
		return {
			...hasUserSelectedACountryUpdate,
			phoneDigits: _getInitialPhoneDigits({
				phoneNumber,
				value: newValue,
				defaultCountry: newDefaultCountry
			}),
			value: newValue,
			country: newValue ? parsedCountry : newDefaultCountry
		}
	}

	// `defaultCountry` didn't change.
	// `value` didn't change.
	// `phoneDigits` didn't change, because `value` didn't change.
	//
	// So no need to update state.
}