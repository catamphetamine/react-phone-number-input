import parsePhoneNumber_, {
	getCountryCallingCode,
	AsYouType,
	Metadata
} from 'libphonenumber-js/core'

import getInternationalPhoneNumberPrefix from './getInternationalPhoneNumberPrefix.js'

/**
 * Decides which country should be pre-selected
 * when the phone number input component is first mounted.
 * @param  {object?} phoneNumber - An instance of `PhoneNumber` class.
 * @param  {string?} country - Pre-defined country (two-letter code).
 * @param  {string[]?} countries - A list of countries available.
 * @param  {object} metadata - `libphonenumber-js` metadata
 * @return {string?}
 */
export function getPreSelectedCountry({
	value,
	phoneNumber,
	defaultCountry,
	getAnyCountry,
	countries,
	required,
	metadata
}) {
	let country

	// If can get country from E.164 phone number
	// then it overrides the `country` passed (or not passed).
	if (phoneNumber && phoneNumber.country) {
		// `country` will be left `undefined` in case of non-detection.
		country = phoneNumber.country
	} else if (defaultCountry) {
		if (!value || couldNumberBelongToCountry(value, defaultCountry, metadata)) {
			country = defaultCountry
		}
	}

	// Only pre-select a country if it's in the available `countries` list.
	if (countries && countries.indexOf(country) < 0) {
		country = undefined
	}

	// If there will be no "International" option
	// then some `country` must be selected.
	// It will still be the wrong country though.
	// But still country `<select/>` can't be left in a broken state.
	if (!country && required && countries && countries.length > 0) {
		country = getAnyCountry()
		// noCountryMatchesTheNumber = true
	}

	return country
}

/**
 * Generates a sorted list of country `<select/>` options.
 * @param  {string[]} countries - A list of two-letter ("ISO 3166-1 alpha-2") country codes.
 * @param  {object} labels - Custom country labels. E.g. `{ RU: 'Россия', US: 'США', ... }`.
 * @param  {boolean} addInternationalOption - Whether should include "International" option at the top of the list.
 * @return {object[]} A list of objects having shape `{ value : string, label : string }`.
 */
export function getCountrySelectOptions({
	countries,
	countryNames,
	addInternationalOption,
	// `locales` are only used in country name comparator:
	// depending on locale, string sorting order could be different.
	compareStringsLocales,
	compareStrings: _compareStrings
}) {
	// Default country name comparator uses `String.localeCompare()`.
	if (!_compareStrings) {
		_compareStrings = compareStrings
	}

	// Generates a `<Select/>` option for each country.
	const countrySelectOptions = countries.map((country) => ({
		value: country,
		// All `locale` country names included in this library
		// include all countries (this is checked at build time).
		// The only case when a country name might be missing
		// is when a developer supplies their own `labels` property.
		// To guard against such cases, a missing country name
		// is substituted by country code.
		label: countryNames[country] || country
	}))

	// Sort the list of countries alphabetically.
	countrySelectOptions.sort((a, b) => _compareStrings(a.label, b.label, compareStringsLocales))

	// Add the "International" option to the country list (if suitable)
	if (addInternationalOption) {
		countrySelectOptions.unshift({
			label: countryNames.ZZ
		})
	}

	return countrySelectOptions
}

/**
 * Parses a E.164 phone number to an instance of `PhoneNumber` class.
 * @param {string?} value = E.164 phone number.
 * @param  {object} metadata - `libphonenumber-js` metadata
 * @return {object} Object having shape `{ country: string?, countryCallingCode: string, number: string }`. `PhoneNumber`: https://gitlab.com/catamphetamine/libphonenumber-js#phonenumber.
 * @example
 * parsePhoneNumber('+78005553535')
 */
export function parsePhoneNumber(value, metadata) {
	return parsePhoneNumber_(value || '', metadata)
}

/**
 * Generates national number digits for a parsed phone.
 * May prepend national prefix.
 * The phone number must be a complete and valid phone number.
 * @param  {object} phoneNumber - An instance of `PhoneNumber` class.
 * @param  {object} metadata - `libphonenumber-js` metadata
 * @return {string}
 * @example
 * getNationalNumberDigits({ country: 'RU', phone: '8005553535' })
 * // returns '88005553535'
 */
export function generateNationalNumberDigits(phoneNumber) {
	return phoneNumber.formatNational().replace(/\D/g, '')
}

/**
 * Migrates parsed `<input/>` `value` for the newly selected `country`.
 * @param {string?} phoneDigits - Phone number digits (and `+`) parsed from phone number `<input/>` (it's not the same as the `value` property).
 * @param {string?} prevCountry - Previously selected country.
 * @param {string?} newCountry - Newly selected country. Can't be same as previously selected country.
 * @param {object} metadata - `libphonenumber-js` metadata.
 * @param {boolean} useNationalFormat - whether should attempt to convert from international to national number for the new country.
 * @return {string?}
 */
export function getPhoneDigitsForNewCountry(phoneDigits, {
	prevCountry,
	newCountry,
	metadata,
	useNationalFormat
}) {
	if (prevCountry === newCountry) {
		return phoneDigits
	}

	// If `parsed_input` is empty
	// then no need to migrate anything.
	if (!phoneDigits) {
		if (useNationalFormat) {
			return ''
		} else {
			// If `phoneDigits` is empty then set `phoneDigits` to
			// `+{getCountryCallingCode(newCountry)}`.
			return getInternationalPhoneNumberPrefix(newCountry, metadata)
		}
	}

	// If switching to some country.
	// (from "International" or another country)
	// If switching from "International" then `phoneDigits` starts with a `+`.
	// Otherwise it may or may not start with a `+`.
	if (newCountry) {
		// If the phone number was entered in international format
		// then migrate it to the newly selected country.
		// The phone number may be incomplete.
		// The phone number entered not necessarily starts with
		// the previously selected country phone prefix.
		if (phoneDigits[0] === '+') {
			// If the international phone number is for the new country
			// then convert it to local if required.
			if (useNationalFormat) {
				// // If a phone number is being input in international form
				// // and the country can already be derived from it,
				// // and if it is the new country, then format as a national number.
				// const derived_country = getCountryFromPossiblyIncompleteInternationalPhoneNumber(phoneDigits, metadata)
				// if (derived_country === newCountry) {
				// 	return stripCountryCallingCode(phoneDigits, derived_country, metadata)
				// }

				// Actually, the two countries don't necessarily need to match:
				// the condition could be looser here, because several countries
				// might share the same international phone number format
				// (for example, "NANPA" countries like US, Canada, etc).
				// The looser condition would be just "same nternational phone number format"
				// which would mean "same country calling code" in the context of `libphonenumber-js`.
				if (phoneDigits.indexOf('+' + getCountryCallingCode(newCountry, metadata)) === 0) {
					return stripCountryCallingCode(phoneDigits, newCountry, metadata)
				}

				// Simply discard the previously entered international phone number,
				// because otherwise any "smart" transformation like getting the
				// "national (significant) number" part and then prepending the
				// newly selected country's "country calling code" to it
				// would just be confusing for a user without being actually useful.
				return ''

				// // Simply strip the leading `+` character
				// // therefore simply converting all digits into a "local" phone number.
				// // https://github.com/catamphetamine/react-phone-number-input/issues/287
				// return phoneDigits.slice(1)
			}

			if (prevCountry) {
				const newCountryPrefix = getInternationalPhoneNumberPrefix(newCountry, metadata)
				if (phoneDigits.indexOf(newCountryPrefix) === 0) {
					return phoneDigits
				} else {
					return newCountryPrefix
				}
			} else {
				const defaultValue = getInternationalPhoneNumberPrefix(newCountry, metadata)
				// If `phoneDigits`'s country calling code part is the same
				// as for the new `country`, then leave `phoneDigits` as is.
				if (phoneDigits.indexOf(defaultValue) === 0) {
					return phoneDigits
				}
				// If `phoneDigits`'s country calling code part is not the same
				// as for the new `country`, then set `phoneDigits` to
				// `+{getCountryCallingCode(newCountry)}`.
				return defaultValue
			}

			// // If the international phone number already contains
			// // any country calling code then trim the country calling code part.
			// // (that could also be the newly selected country phone code prefix as well)
			// // `phoneDigits` doesn't neccessarily belong to `prevCountry`.
			// // (e.g. if a user enters an international number
			// //  not belonging to any of the reduced `countries` list).
			// phoneDigits = stripCountryCallingCode(phoneDigits, prevCountry, metadata)

			// // Prepend country calling code prefix
			// // for the newly selected country.
			// return e164(phoneDigits, newCountry, metadata) || `+${getCountryCallingCode(newCountry, metadata)}`
		}
	}
	// If switching to "International" from a country.
	else {
		// If the phone number was entered in national format.
		if (phoneDigits[0] !== '+') {
			// Format the national phone number as an international one.
			// The phone number entered not necessarily even starts with
			// the previously selected country phone prefix.
			// Even if the phone number belongs to whole another country
			// it will still be parsed into some national phone number.
			//
			// Ignore the now-uncovered `|| ''` code branch:
			// previously `e164()` function could return an empty string
			// even when `phoneDigits` were not empty.
			// Now it always returns some `value` when there're any `phoneDigits`.
			// Still, didn't remove the `|| ''` code branch just in case
			// that logic changes somehow in some future, so there're no
			// possible bugs related to that.
			//
			// (ignore the `|| ''` code branch)
			/* istanbul ignore next */
			return e164(phoneDigits, prevCountry, metadata) || ''
		}
	}

	return phoneDigits
}

/**
 * Converts phone number digits to a (possibly incomplete) E.164 phone number.
 * @param  {string?} number - A possibly incomplete phone number digits string. Can be a possibly incomplete E.164 phone number.
 * @param  {string?} country
 * @param  {object} metadata - `libphonenumber-js` metadata.
 * @return {string?}
 */
export function e164(number, country, metadata) {
	if (!number) {
		return
	}
	// If the phone number is being input in international format.
	if (number[0] === '+') {
		// If it's just the `+` sign then return nothing.
		if (number === '+') {
			return
		}
		// Return a E.164 phone number.
		//
		// Could return `number` "as is" here, but there's a possibility
		// that some user might incorrectly input an international number
		// with a "national prefix". Such numbers aren't considered valid,
		// but `libphonenumber-js` is "forgiving" when it comes to parsing
		// user's input, and this input component follows that behavior.
		//
		const asYouType = new AsYouType(country, metadata)
		asYouType.input(number)
		// This function would return `undefined` only when `number` is `"+"`,
		// but at this point it is known that `number` is not `"+"`.
		return asYouType.getNumberValue()
	}
	// For non-international phone numbers
	// an accompanying country code is required.
	// The situation when `country` is `undefined`
	// and a non-international phone number is passed
	// to this function shouldn't happen.
	if (!country) {
		return
	}
	const partial_national_significant_number = getNationalSignificantNumberDigits(number, country, metadata)
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
	// if (partial_national_significant_number) {
		return `+${getCountryCallingCode(country, metadata)}${partial_national_significant_number || ''}`
	// }
}

/**
 * Trims phone number digits if they exceed the maximum possible length
 * for a national (significant) number for the country.
 * @param  {string} number - A possibly incomplete phone number digits string. Can be a possibly incomplete E.164 phone number.
 * @param  {string} country
 * @param  {object} metadata - `libphonenumber-js` metadata.
 * @return {string} Can be empty.
 */
export function trimNumber(number, country, metadata) {
	const nationalSignificantNumberPart = getNationalSignificantNumberDigits(number, country, metadata)
	if (nationalSignificantNumberPart) {
		const overflowDigitsCount = nationalSignificantNumberPart.length - getMaxNumberLength(country, metadata)
		if (overflowDigitsCount > 0) {
			return number.slice(0, number.length - overflowDigitsCount)
		}
	}
	return number
}

function getMaxNumberLength(country, metadata) {
	// Get "possible lengths" for a phone number of the country.
	metadata = new Metadata(metadata)
	metadata.selectNumberingPlan(country)
	// Return the last "possible length".
	return metadata.numberingPlan.possibleLengths()[metadata.numberingPlan.possibleLengths().length - 1]
}

// If the phone number being input is an international one
// then tries to derive the country from the phone number.
// (regardless of whether there's any country currently selected)
/**
 * @param {string} partialE164Number - A possibly incomplete E.164 phone number.
 * @param {string?} country - Currently selected country.
 * @param {string[]?} countries - A list of available countries. If not passed then "all countries" are assumed.
 * @param  {object} metadata - `libphonenumber-js` metadata.
 * @return {string?}
 */
export function getCountryForPartialE164Number(partialE164Number, {
	country,
	countries,
	required,
	metadata
}) {
	if (partialE164Number === '+') {
		// Don't change the currently selected country yet.
		return country
	}

	const derived_country = getCountryFromPossiblyIncompleteInternationalPhoneNumber(partialE164Number, metadata)

	// If a phone number is being input in international form
	// and the country can already be derived from it,
	// then select that country.
	if (derived_country && (!countries || (countries.indexOf(derived_country) >= 0))) {
		return derived_country
	}
	// If "International" country option has not been disabled
	// and the international phone number entered doesn't correspond
	// to the currently selected country then reset the currently selected country.
	else if (country &&
		!required &&
		!couldNumberBelongToCountry(partialE164Number, country, metadata)) {
		return undefined
	}

	// Don't change the currently selected country.
	return country
}

/**
 * Parses `<input/>` value. Derives `country` from `input`. Derives an E.164 `value`.
 * @param  {string?} phoneDigits — Parsed `<input/>` value. Examples: `""`, `"+"`, `"+123"`, `"123"`.
 * @param  {string?} prevPhoneDigits — Previous parsed `<input/>` value. Examples: `""`, `"+"`, `"+123"`, `"123"`.
 * @param  {string?} country - Currently selected country.
 * @param  {boolean} countryRequired - Is selecting some country required.
 * @param  {function} getAnyCountry - Can be used to get any country when selecting some country required.
 * @param  {string[]?} countries - A list of available countries. If not passed then "all countries" are assumed.
 * @param  {boolean} international - Set to `true` to force international phone number format (leading `+`). Set to `false` to force "national" phone number format. Is `undefined` by default.
 * @param  {boolean} limitMaxLength — Whether to enable limiting phone number max length.
 * @param  {object} metadata - `libphonenumber-js` metadata.
 * @return {object} An object of shape `{ input, country, value }`.
 */
export function onPhoneDigitsChange(phoneDigits, {
	prevPhoneDigits,
	country,
	defaultCountry,
	countryRequired,
	getAnyCountry,
	countries,
	international,
	limitMaxLength,
	countryCallingCodeEditable,
	metadata
}) {
	if (international && countryCallingCodeEditable === false) {
		const prefix = getInternationalPhoneNumberPrefix(country, metadata)
		// The `<input/>` value must start with the country calling code.
		if (phoneDigits.indexOf(prefix) !== 0) {
			let value
			// If a phone number input is declared as
			// `international` and `withCountryCallingCode`,
			// then it's gonna be non-empty even before the user
			// has input anything in it.
			// This will result in its contents (the country calling code part)
			// being selected when the user tabs into such field.
			// If the user then starts inputting the national part digits,
			// then `<input/>` value changes from `+xxx` to `y`
			// because inputting anything while having the `<input/>` value
			// selected results in erasing the `<input/>` value.
			// So, the component handles such case by restoring
			// the intended `<input/>` value: `+xxxy`.
			// https://gitlab.com/catamphetamine/react-phone-number-input/-/issues/43
			if (phoneDigits && phoneDigits[0] !== '+') {
				phoneDigits = prefix + phoneDigits
				value = e164(phoneDigits, country, metadata)
			} else {
				phoneDigits = prefix
			}
			return {
				phoneDigits,
				value,
				country
			}
		}
	}

	// If `international` property is `false`, then it means
	// "enforce national-only format during input",
	// so, if that's the case, then remove all `+` characters,
	// but only if some country is currently selected.
	// (not if "International" country is selected).
	if (international === false && country && phoneDigits && phoneDigits[0] === '+') {
		phoneDigits = convertInternationalPhoneDigitsToNational(phoneDigits, country, metadata)
	}

	// Trim the input to not exceed the maximum possible number length.
	if (phoneDigits && country && limitMaxLength) {
		phoneDigits = trimNumber(phoneDigits, country, metadata)
	}

	// If this `onChange()` event was triggered
	// as a result of selecting "International" country,
	// then force-prepend a `+` sign if the phone number
	// `<input/>` value isn't in international format.
	// Also, force-prepend a `+` sign if international
	// phone number input format is set.
	if (phoneDigits && phoneDigits[0] !== '+' && (!country || international)) {
		phoneDigits = '+' + phoneDigits
	}

	// If the previously entered phone number
	// has been entered in international format
	// and the user decides to erase it,
	// then also reset the `country`
	// because it was most likely automatically selected
	// while the user was typing in the phone number
	// in international format.
	// This fixes the issue when a user is presented
	// with a phone number input with no country selected
	// and then types in their local phone number
	// then discovers that the input's messed up
	// (a `+` has been prepended at the start of their input
	//  and a random country has been selected),
	// decides to undo it all by erasing everything
	// and then types in their local phone number again
	// resulting in a seemingly correct phone number
	// but in reality that phone number has incorrect country.
	// https://github.com/catamphetamine/react-phone-number-input/issues/273
	if (!phoneDigits && prevPhoneDigits && prevPhoneDigits[0] === '+') {
		if (international) {
			country = undefined
		} else {
			country = defaultCountry
		}
	}
	// Also resets such "randomly" selected country
	// as soon as the user erases the number
	// digit-by-digit up to the leading `+` sign.
	if (phoneDigits === '+' && prevPhoneDigits && prevPhoneDigits[0] === '+' && prevPhoneDigits.length > '+'.length) {
		country = undefined
	}

	// Generate the new `value` property.
	let value
	if (phoneDigits) {
		if (phoneDigits[0] === '+') {
			if (phoneDigits === '+') {
				value = undefined
			} else if (country && getInternationalPhoneNumberPrefix(country, metadata).indexOf(phoneDigits) === 0) {
				// Selected a `country` but started inputting an
				// international phone number for another country.
				// Even though the input value is non-empty,
				// the `value` is assumed `undefined` in such case.
				// The `country` will be reset (or re-selected)
				// immediately after such mismatch has been detected
				// by the phone number input component, and `value`
				// will be set to the currently entered international prefix.
				//
				// For example, if selected `country` `"US"`
				// and started inputting phone number `"+2"`
				// then `value` `undefined` will be returned from this function,
				// and then, immediately after that, `country` will be reset
				// and the `value` will be set to `"+2"`.
				//
				value = undefined
			} else {
				value = e164(phoneDigits, country, metadata)
			}
		} else {
			value = e164(phoneDigits, country, metadata)
		}
	}

	// Derive the country from the phone number.
	// (regardless of whether there's any country currently selected,
	//  because there could be several countries corresponding to one country calling code)
	if (value) {
		country = getCountryForPartialE164Number(value, {
			country,
			countries,
			metadata
		})
		// If `international` property is `false`, then it means
		// "enforce national-only format during input",
		// so, if that's the case, then remove all `+` characters,
		// but only if some country is currently selected.
		// (not if "International" country is selected).
		if (international === false && country && phoneDigits && phoneDigits[0] === '+') {
			phoneDigits = convertInternationalPhoneDigitsToNational(phoneDigits, country, metadata)
			// Re-calculate `value` because `phoneDigits` has changed.
			value = e164(phoneDigits, country, metadata)
		}
	}

	if (!country && countryRequired) {
		country = defaultCountry || getAnyCountry()
	}

	return {
		phoneDigits,
		country,
		value
	}
}

function convertInternationalPhoneDigitsToNational(input, country, metadata) {
	// Handle the case when a user might have pasted
	// a phone number in international format.
	if (input.indexOf(getInternationalPhoneNumberPrefix(country, metadata)) === 0) {
		// Create "as you type" formatter.
		const formatter = new AsYouType(country, metadata)
		// Input partial national phone number.
		formatter.input(input)
		// Return the parsed partial national phone number.
		const phoneNumber = formatter.getNumber()
		if (phoneNumber) {
			// Transform the number to a national one,
			// and remove all non-digits.
			return phoneNumber.formatNational().replace(/\D/g, '')
		} else {
			return ''
		}
	} else {
		// Just remove the `+` sign.
		return input.replace(/\D/g, '')
	}
}

/**
 * Determines the country for a given (possibly incomplete) E.164 phone number.
 * @param  {string} number - A possibly incomplete E.164 phone number.
 * @param  {object} metadata - `libphonenumber-js` metadata.
 * @return {string?}
 */
export function getCountryFromPossiblyIncompleteInternationalPhoneNumber(number, metadata) {
	const formatter = new AsYouType(null, metadata)
	formatter.input(number)
	// // `001` is a special "non-geograpical entity" code
	// // in Google's `libphonenumber` library.
	// if (formatter.getCountry() === '001') {
	// 	return
	// }
	return formatter.getCountry()
}

/**
 * Compares two strings.
 * A helper for `Array.sort()`.
 * @param {string} a — First string.
 * @param {string} b — Second string.
 * @param {(string[]|string)} [locales] — The `locales` argument of `String.localeCompare`.
 */
export function compareStrings(a, b, locales) {
  // Use `String.localeCompare` if it's available.
  // https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/String/localeCompare
  // Which means everyone except IE <= 10 and Safari <= 10.
  // `localeCompare()` is available in latest Node.js versions.
  /* istanbul ignore else */
  if (String.prototype.localeCompare) {
    return a.localeCompare(b, locales);
  }
  /* istanbul ignore next */
  return a < b ? -1 : (a > b ? 1 : 0);
}

/**
 * Strips `+${countryCallingCode}` prefix from an E.164 phone number.
 * @param {string} number - (possibly incomplete) E.164 phone number.
 * @param {string?} country - A possible country for this phone number.
 * @param {object} metadata - `libphonenumber-js` metadata.
 * @return {string}
 */
export function stripCountryCallingCode(number, country, metadata) {
	// Just an optimization, so that it
	// doesn't have to iterate through all country calling codes.
	if (country) {
		const countryCallingCodePrefix = '+' + getCountryCallingCode(country, metadata)

		// If `country` fits the actual `number`.
		if (number.length < countryCallingCodePrefix.length) {
			if (countryCallingCodePrefix.indexOf(number) === 0) {
				return ''
			}
		} else {
			if (number.indexOf(countryCallingCodePrefix) === 0) {
				return number.slice(countryCallingCodePrefix.length)
			}
		}
	}

	// If `country` doesn't fit the actual `number`.
	// Try all available country calling codes.
	for (const country_calling_code of Object.keys(metadata.country_calling_codes)) {
		if (number.indexOf(country_calling_code) === '+'.length) {
			return number.slice('+'.length + country_calling_code.length)
		}
	}

	return ''
}

/**
 * Parses a partially entered national phone number digits
 * (or a partially entered E.164 international phone number)
 * and returns the national significant number part.
 * National significant number returned doesn't come with a national prefix.
 * @param {string} number - National number digits. Or possibly incomplete E.164 phone number.
 * @param {string?} country
 * @param {object} metadata - `libphonenumber-js` metadata.
 * @return {string} [result]
 */
export function getNationalSignificantNumberDigits(number, country, metadata) {
	// Create "as you type" formatter.
	const formatter = new AsYouType(country, metadata)
	// Input partial national phone number.
	formatter.input(number)
	// Return the parsed partial national phone number.
	const phoneNumber = formatter.getNumber()
	return phoneNumber && phoneNumber.nationalNumber
}

/**
 * Checks if a partially entered E.164 phone number could belong to a country.
 * @param  {string} number
 * @param  {string} country
 * @return {boolean}
 */
export function couldNumberBelongToCountry(number, country, metadata) {
	const intlPhoneNumberPrefix = getInternationalPhoneNumberPrefix(country, metadata)
	let i = 0
	while (i < number.length && i < intlPhoneNumberPrefix.length) {
		if (number[i] !== intlPhoneNumberPrefix[i]) {
			return false
		}
		i++
	}
	return true
}

/**
 * Gets initial "phone digits" (including `+`, if using international format).
 * @return {string} [phoneDigits] Returns `undefined` if there should be no initial "phone digits".
 */
export function getInitialPhoneDigits({
	value,
	phoneNumber,
	defaultCountry,
	international,
	useNationalFormat,
	metadata
}) {
	// If the `value` (E.164 phone number)
	// belongs to the currently selected country
	// and `useNationalFormat` is `true`
	// then convert `value` (E.164 phone number)
	// to a local phone number digits.
	// E.g. '+78005553535' -> '88005553535'.
	if ((international === false || useNationalFormat) && phoneNumber && phoneNumber.country) {
		return generateNationalNumberDigits(phoneNumber)
	}
	// If `international` property is `true`,
	// meaning "enforce international phone number format",
	// then always show country calling code in the input field.
	if (!value && international && defaultCountry) {
		return getInternationalPhoneNumberPrefix(defaultCountry, metadata)
	}
	return value
}