import {
	parsePhoneNumberFromString,
	getCountryCallingCode,
	AsYouType,
	Metadata
} from 'libphonenumber-js/core'

/**
 * Decides which country should be pre-selected
 * when the phone number input component is first mounted.
 * @param  {object?} phoneNumber - An instance of `PhoneNumber` class.
 * @param  {string?} country - Pre-defined country (two-letter code).
 * @param  {string[]?} countries - A list of countries available.
 * @param  {boolean} includeInternationalOption - Whether "International" country option is available.
 * @param  {object} metadata - `libphonenumber-js` metadata
 * @return {string?}
 */
export function getPreSelectedCountry(phoneNumber, country, countries, includeInternationalOption, metadata)
{
	// If can get country from E.164 phone number
	// then it overrides the `country` passed (or not passed).
	if (phoneNumber && phoneNumber.country)
	{
		// `country` will be left `undefined` in case of non-detection.
		country = phoneNumber.country
	}

	// Only pre-select a country if it's in the available `countries` list.
	if (countries && countries.indexOf(country) < 0)
	{
		country = undefined
	}

	// If there will be no "International" option
	// then some `country` must be selected.
	// It will still be the wrong country though.
	// But still country `<select/>` can't be left in a broken state.
	if (!country && !includeInternationalOption && countries && countries.length > 0)
	{
		country = countries[0]
	}

	return country
}

/**
 * Generates a sorted list of country `<select/>` options.
 * @param  {string[]} countries - A list of two-letter ("ISO 3166-1 alpha-2") country codes.
 * @param  {object} labels - Custom country labels. E.g. `{ RU: 'Россия', US: 'США', ... }`.
 * @param  {boolean} includeInternationalOption - Whether should include "International" option at the top of the list.
 * @return {object[]} A list of objects having shape `{ value : string, label : string }`.
 */
export function getCountrySelectOptions(countries, country_names, includeInternationalOption)
{
	// Generates a `<Select/>` option for each country.
	const country_select_options = countries.map((country) =>
	({
		value : country,
		label : country_names[country]
	}))

	// Sort the list of countries alphabetically.
	country_select_options.sort((a, b) => compare_strings(a.label, b.label))

	// Add the "International" option to the country list (if suitable)
	if (includeInternationalOption)
	{
		country_select_options.unshift
		({
			label : country_names.ZZ
		})
	}

	return country_select_options
}

/**
 * Parses a E.164 phone number to an instance of `PhoneNumber` class.
 * @param {string?} value = E.164 phone number.
 * @param  {object} metadata - `libphonenumber-js` metadata
 * @example
 * parsePhoneNumber('+78005553535')
 */
export function parsePhoneNumber(value, metadata)
{
	return parsePhoneNumberFromString(value || '', metadata)
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
export function generateNationalNumberDigits(phoneNumber)
{
	return phoneNumber.formatNational().replace(/\D/g, '')
}

/**
 * Migrates parsed `<input/>` `value` for the newly selected `country`.
 * @param {string?} value - The `value` parsed from phone number `<input/>` (it's the `parsed_input` state property, not the `value` property).
 * @param {string?} previousCountry - Previously selected country.
 * @param {string?} newCountry - Newly selected country. Can't be same as previously selected country.
 * @param {object} metadata - `libphonenumber-js` metadata.
 * @param {boolean} preferNationalFormat - whether should attempt to convert from international to national number for the new country.
 * @return {string?}
 */
export function migrateParsedInputForNewCountry
(
	value,
	previous_country,
	new_country,
	metadata,
	preferNationalFormat
)
{
	// If `parsed_input` is empty
	// then no need to migrate anything.
	if (!value) {
		return value
	}

	// If switching to some country.
	// (from "International" or another country)
	// If switching from "International" then `value` starts with a `+`.
	// Otherwise it may or may not start with a `+`.
	if (new_country)
	{
		// If the phone number was entered in international format
		// then migrate it to the newly selected country.
		// The phone number may be incomplete.
		// The phone number entered not necessarily starts with
		// the previously selected country phone prefix.
		if (value[0] === '+')
		{
			// If the international phone number is for the new country
			// then convert it to local if required.
			if (preferNationalFormat)
			{
				// If a phone number is being input in international form
				// and the country can already be derived from it,
				// and if it is the new country, then format as a national number.
				const derived_country = get_country_from_possibly_incomplete_international_phone_number(value, metadata)
				if (derived_country === new_country)
				{
					return strip_country_calling_code(value, derived_country, metadata)
				}
			}

			// If the international phone number already contains
			// any country calling code then trim the country calling code part.
			// (that could also be the newly selected country phone code prefix as well)
			// `value` doesn't neccessarily belong to `previous_country`.
			// (e.g. if a user enters an international number
			//  not belonging to any of the reduced `countries` list).
			value = strip_country_calling_code(value, previous_country, metadata)

			// Prepend country calling code prefix
			// for the newly selected country.
			return e164(value, new_country, metadata) || `+${getCountryCallingCode(new_country, metadata)}`
		}
	}
	// If switching to "International" from a country.
	else
	{
		// If the phone number was entered in national format.
		if (value[0] !== '+')
		{
			// Format the national phone number as an international one.
			// The phone number entered not necessarily even starts with
			// the previously selected country phone prefix.
			// Even if the phone number belongs to whole another country
			// it will still be parsed into some national phone number.
			return e164(value, previous_country, metadata) || ''
		}
	}

	return value
}

/**
 * Converts phone number digits to a (possibly incomplete) E.164 phone number.
 * @param  {string?} number - A possibly incomplete phone number digits string. Can be a possibly incomplete E.164 phone number.
 * @param  {string?} country
 * @param  {[object} metadata - `libphonenumber-js` metadata.
 * @return {string?}
 */
export function e164(number, country, metadata)
{
	if (!number) {
		return
	}

	// If the phone number is being input in international format.
	if (number[0] === '+')
	{
		// If it's just the `+` sign then return nothing.
		if (number === '+') {
			return
		}

		// If there are any digits then the `value` is returned as is.
		return number
	}

	// For non-international phone numbers
	// an accompanying country code is required.
	if (!country) {
		return
	}

	const partial_national_significant_number = get_national_significant_number_part(number, country, metadata)

	if (partial_national_significant_number) {
		return `+${getCountryCallingCode(country, metadata)}${partial_national_significant_number}`
	}
}

/**
 * Trims phone number digits if they exceed the maximum possible length
 * for a national (significant) number for the country.
 * @param  {string} number - A possibly incomplete phone number digits string. Can be a possibly incomplete E.164 phone number.
 * @param  {string} country
 * @param  {object} metadata - `libphonenumber-js` metadata.
 * @return {string} Can be empty.
 */
export function trimNumber(number, country, metadata)
{
	const nationalSignificantNumberPart = get_national_significant_number_part(number, country, metadata)
	const overflowDigitsCount = nationalSignificantNumberPart.length - getMaxNumberLength(country, metadata)
	if (overflowDigitsCount > 0) {
		return number.slice(0, number.length - overflowDigitsCount)
	}
	return number
}

function getMaxNumberLength(country, metadata)
{
	// Get "possible lengths" for a phone number of the country.
	metadata = new Metadata(metadata)
	metadata.country(country)
	// Return the last "possible length".
	return metadata.possibleLengths()[metadata.possibleLengths().length - 1]
}

// If the phone number being input is an international one
// then tries to derive the country from the phone number.
// (regardless of whether there's any country currently selected)
/**
 * @param {string} parsedInput - A possibly incomplete E.164 phone number.
 * @param {string?} country - Currently selected country.
 * @param {string[]?} countries - A list of available countries. If not passed then "all countries" are assumed.
 * @param {boolean} includeInternationalOption - Whether "International" country option is available.
 * @param  {object} metadata - `libphonenumber-js` metadata.
 * @return {string?}
 */
export function getCountryForPartialE164Number
(
	partialE164Number,
	country,
	countries,
	includeInternationalOption,
	metadata
)
{
	if (partialE164Number === '+')
	{
		// Don't change the currently selected country yet.
		return country
	}

	const derived_country = get_country_from_possibly_incomplete_international_phone_number(partialE164Number, metadata)

	// If a phone number is being input in international form
	// and the country can already be derived from it,
	// then select that country.
	if (derived_country && (!countries || (countries.indexOf(derived_country) >= 0)))
	{
		return derived_country
	}
	// If "International" country option has not been disabled
	// and the international phone number entered doesn't correspond
	// to the currently selected country then reset the currently selected country.
	else if (country &&
		includeInternationalOption &&
		!could_number_belong_to_country(partialE164Number, country, metadata))
	{
		return undefined
	}

	// Don't change the currently selected country.
	return country
}

/**
 * Parses `<input/>` value. Derives `country` from `input`. Derives an E.164 `value`.
 * @param  {string?} input — Parsed `<input/>` value. Examples: `""`, `"+"`, `"+123"`, `"123"`.
 * @param  {string?} country - Currently selected country.
 * @param  {string[]?} countries - A list of available countries. If not passed then "all countries" are assumed.
 * @param  {boolean} includeInternationalOption - Whether "International" country option is available.
 * @param  {boolean} limitMaxLength — Whether to enable limiting phone number max length.
 * @param  {object} metadata - `libphonenumber-js` metadata.
 * @return {object} An object of shape `{ input, country, value }`.
 */
export function parseInput(
	input,
	country,
	countries,
	includeInternationalOption,
	limitMaxLength,
	metadata
) {
	// Trim the input to not exceed the maximum possible number length.
	if (input && country && limitMaxLength) {
		input = trimNumber(input, country, metadata)
	}

	// If this `onChange()` event was triggered
	// as a result of selecting "International" country
	// then force-prepend a `+` sign if the phone number
	// `<input/>` value isn't in international format.
	if (input && !country && input[0] !== '+') {
		input = '+' + input
	}

	// Generate the new `value` property.
	let value
	if (input) {
		if (input[0] === '+') {
			if (input !== '+') {
				value = input
			}
		} else {
			value = e164(input, country, metadata)
		}
	}

	// Derive the country from the phone number.
	// (regardless of whether there's any country currently selected)
	if (value) {
		country = getCountryForPartialE164Number(
			value,
			country,
			countries,
			includeInternationalOption,
			metadata
		)
	}

	return {
		input,
		country,
		value
	}
}

/**
 * Determines the country for a given (possibly incomplete) E.164 phone number.
 * @param  {string} number - A possibly incomplete E.164 phone number.
 * @param  {object} metadata - `libphonenumber-js` metadata.
 * @return {string?}
 */
export function get_country_from_possibly_incomplete_international_phone_number(number, metadata)
{
	const formatter = new AsYouType(null, metadata)
	formatter.input(number)
	// `001` is a special "non-geograpical entity" code
	// in Google's `libphonenumber` library.
	if (formatter.country === '001') {
		return
	}
	return formatter.country
}

/**
 * Compares two strings.
 * A helper for `Array.sort()`.
 */
export function compare_strings(a, b) {
  // Use `String.localeCompare` if it's available.
  // https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/String/localeCompare
  // Which means everyone except IE <= 10 and Safari <= 10.
  // `localeCompare()` is available in latest Node.js versions.
  /* istanbul ignore else */
  if (String.prototype.localeCompare) {
    return a.localeCompare(b);
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
export function strip_country_calling_code(number, country, metadata)
{
	// Just an optimization, so that it
	// doesn't have to iterate through all country calling codes.
	if (country)
	{
		const country_calling_prefix = '+' + getCountryCallingCode(country, metadata)

		// If `country` fits the actual `number`.
		if (number.length < country_calling_prefix.length)
		{
			if (country_calling_prefix.indexOf(number) === 0)
			{
				return ''
			}
		}
		else
		{
			if (number.indexOf(country_calling_prefix) === 0)
			{
				return number.slice(country_calling_prefix.length)
			}
		}
	}

	// If `country` doesn't fit the actual `number`.
	// Try all available country calling codes.
	for (const country_calling_code of Object.keys(metadata.country_calling_codes))
	{
		if (number.indexOf(country_calling_code) === '+'.length)
		{
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
 * @return {string} Can be empty.
 */
export function get_national_significant_number_part(number, country, metadata)
{
	// Create "as you type" formatter.
	const formatter = new AsYouType(country, metadata)

	// Input partial national phone number.
	formatter.input(number)

	// Return the parsed partial national phone number.
	return formatter.getNationalNumber()
}

/**
 * Checks if a partially entered E.164 phone number could belong to a country.
 * @param  {string} number
 * @param  {string} country
 * @return {boolean}
 */
export function could_number_belong_to_country(number, country, metadata)
{
	const country_calling_code = getCountryCallingCode(country, metadata)

	let i = 0
	while (i + 1 < number.length && i < country_calling_code.length)
	{
		if (number[i + 1] !== country_calling_code[i])
		{
			return false
		}
		i++
	}

	return true
}