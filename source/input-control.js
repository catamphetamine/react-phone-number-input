import
{
	parseNumber,
	formatNumber,
	getCountryCallingCode,
	AsYouType
}
from 'libphonenumber-js/custom'

import { parseDigit } from 'input-format'

import default_country_names, { countries } from './countries'

/**
 * Decides which country should be pre-selected
 * when the phone number input component is first mounted.
 * @param  {object} parsedNumber - A parsed number object: `{ country, phone }`. Can be an empty object.
 * @param  {string?} country - Pre-defined country (two-letter code).
 * @param  {string[]} countries - A list of countries available.
 * @param  {boolean} includeInternationalOption - Whether "International" country option is available.
 * @param  {object} metadata - `libphonenumber-js` metadata
 * @return {string?}
 */
export function getPreSelectedCountry(parsed_number, country, countries, includeInternationalOption, metadata)
{
	// If can get country from E.164 phone number
	// then it overrides the `country` passed (or not passed).
	if (parsed_number.country)
	{
		// `country` will be left `undefined` in case of non-detection.
		country = parsed_number.country
	}

	// If there will be no "International" option
	// then some `country` must be selected.
	// It will still be the wrong country though.
	// But still country `<select/>` can't be left in a broken state.
	if (!country && !has_international_option(countries, includeInternationalOption))
	{
		country = countries[0]
	}

	return country
}

/**
 * Generates a sorted list of country `<select/>` options.
 * @param  {string[]} countries - A list of two-letter ("ISO 3166-1 alpha-2") country codes.
 * @param  {object?} labels - Custom country labels. E.g. `{ RU: 'Россия', US: 'США', ... }`.
 * @param  {boolean} includeInternationalOption - Whether should include "International" option at the top of the list.
 * @return {object[]} A list of objects having shape `{ value : string, label : string }`.
 */
export function getCountrySelectOptions(_countries, country_names, includeInternationalOption)
{
	// Generates a `<Select/>` option for each country.
	const country_select_options = _countries.map((country) =>
	({
		value : country,
		label : (country_names && country_names[country]) || default_country_names[country]
	}))

	// Sort the list of countries alphabetically.
	//
	// This is only done when custom `countries` are supplied.
	//
	// If no custom `countries` are supplied
	// then this means the default list of `countries`
	// is used which is already sorted by country name alphabetically.
	//
	if (_countries !== countries || country_names)
	{
		country_select_options.sort((a, b) => compare_strings(a.label, b.label))
	}

	// Add the "International" option to the country list (if suitable)
	if (has_international_option(_countries, includeInternationalOption))
	{
		country_select_options.unshift
		({
			label : (country_names && country_names.ZZ) || default_country_names.ZZ
		})
	}

	return country_select_options
}

/**
 * `input-format` `parse()` function.
 * https://github.com/catamphetamine/input-format
 * @param  {string} character - Yet another character from raw input string.
 * @param  {string} value - The value parsed so far.
 * @param  {object} meta - Optional custom use-case-specific metadata.
 * @return {string?} The parsed character.
 */
export function parsePhoneNumberCharacter(character, value)
{
	// Only allow a leading `+`.
	if (character === '+')
	{
		// If this `+` is not the first parsed character
		// then discard it.
		if (value) {
			return
		}

		return '+'
	}

	// Allow digits.
	return parseDigit(character)
}

/**
 * Parses phone number characters from a string.
 * @param  {string} string
 * @return {string}
 * @example
 * ```js
 * parsePhoneNumberCharacters('8 (800) 555')
 * // Outputs '8800555'.
 * parsePhoneNumberCharacters('+7 800 555')
 * // Outputs '+7800555'.
 * ```
 */
export function parsePhoneNumberCharacters(string)
{
	let result = ''

	// Using `.split('')` here instead of normal `for ... of`
	// because the importing application doesn't neccessarily include an ES6 polyfill.
	// The `.split('')` approach discards "exotic" UTF-8 characters
	// (the ones consisting of four bytes) but digits
	// (including non-European ones) don't fall into that range
	// so such "exotic" characters would be discarded anyway.
	for (const character of string.split(''))
	{
		result += parsePhoneNumberCharacter(character, result) || ''
	}

	return result
}

/**
 * Formats a (possibly incomplete) phone number.
 * The phone number can be either in E.164 format
 * or in a form of national number digits.
 * Is used for `input-format`'s `format()` function.
 * https://github.com/catamphetamine/input-format
 * @param {string} value - A possibly incomplete phone number. Either in E.164 format or in a form of national number digits.
 * @param {string?} country - Two-letter ("ISO 3166-1 alpha-2") country code.
 * @return {object} `{ text : string, template : string }`
 */
export function formatPhoneNumber(value, country, metadata)
{
	// "As you type" formatter.
	const formatter = new AsYouType(country, metadata)

	// Format the number.
	const text = formatter.input(value)

	return { text, template: formatter.template }
}

/**
 * Parses a E.164 phone number to an object having shape `{ country : string, phone : string }`.
 * @param {string} value = E.164 phone number.
 * @param  {object} metadata - `libphonenumber-js` metadata
 * @example
 * parsePhoneNumber('+78005553535')
 * // returns `{ country: 'RU', phone: '8005553535' }`
 */
export function parsePhoneNumber(value, metadata)
{
	return parseNumber(value || '', metadata)
}

/**
 * Generates national number digits for a parsed phone.
 * May prepend national prefix.
 * @param  {object} parsedPhone - Object having shape `{ country : string, phone : string }`.
 * @param  {object} metadata - `libphonenumber-js` metadata
 * @return {string}
 * @example
 * getNationalNumberDigits({ country: 'RU', phone: '8005553535' })
 * // returns '88005553535'
 */
export function generateNationalNumberDigits(parsed_phone, metadata)
{
	return formatNumber(parsed_phone, 'National', metadata).replace(/\D/g, '')
}

/**
 * Migrates `<input/>` parsed `value` for the newly selected `country`.
 * @param {string?} value - The `value` parsed from phone number `<input/>` (it's the `parsed_input` state property, not the `value` property).
 * @param {string?} previousCountry - Previously selected country.
 * @param {string?} newCountry - Newly selected country. Can't be same as previously selected country.
 * @param {object} metadata - `libphonenumber-js` metadata.
 * @return {string}
 */
export function migrateParsedInputForNewCountry
(
	value,
	previous_country,
	new_country,
	metadata
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
			// If the international phone number already contains
			// any country calling code then trim the country calling code part.
			// (that could also be the newly selected country phone code prefix as well)
			// `value` doesn't neccessarily belong to `previous_country`.
			// (e.g. if a user enters an international number
			//  not belonging to any of the reduced `countries` list)
			value = strip_country_calling_code(value, previous_country, metadata)

			// Prepend country calling code prefix
			// for the newly selected country.
			return `+${getCountryCallingCode(new_country, metadata)}${value}`
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
			const partial_national_significant_number = get_national_significant_number_part(value, previous_country, metadata)
			return formatNumber(partial_national_significant_number, previous_country, 'E.164', metadata)
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

	if (!partial_national_significant_number) {
		return
	}

	return formatNumber(partial_national_significant_number, country, 'E.164', metadata)
}

// If the phone number being input is an international one
// then tries to derive the country from the phone number.
// (regardless of whether there's any country currently selected)
/**
 * @param {string} parsedInput - A possibly incomplete E.164 phone number.
 * @param {string?} country - Currently selected country.
 * @param {string[]} countries - A list of available countries.
 * @param {boolean} includeInternationalOption - Whether "International" country option is available.
 * @param  {[object} metadata - `libphonenumber-js` metadata.
 * @return {string?}
 */
export function getCountryForParsedInput
(
	parsed_input,
	country,
	countries,
	includeInternationalOption,
	metadata
)
{
	if (parsed_input === '+')
	{
		// Don't change the currently selected country yet.
		return country
	}

	const derived_country = get_country_from_possibly_incomplete_international_phone_number(parsed_input, metadata)

	// If a phone number is being input in international form
	// and the country can already be derived from it,
	// then select that country.
	if (derived_country && countries.indexOf(derived_country) >= 0)
	{
		return derived_country
	}
	// If "International" country option has not been disabled
	// and the international phone number entered doesn't correspond
	// to the currently selected country then reset the currently selected country.
	else if (country &&
		has_international_option(countries, includeInternationalOption) &&
		!could_number_belong_to_country(parsed_input, country, metadata))
	{
		return undefined
	}

	// Don't change the currently selected country.
	return country
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
  if (String.prototype.localeCompare) {
    return a.localeCompare(b);
  }
  return a < b ? -1 : (a > b ? 1 : 0);
}

/**
 * Whether should add the "International" option to country `<select/>`.
 */
export function has_international_option(_countries, includeInternationalOption)
{
	// If this behaviour is explicitly set, then do as it says.
	if (includeInternationalOption !== undefined)
	{
		return includeInternationalOption
	}

	// If the list of `countries` has been overridden
	// then only show "International" option
	// if no countries have been left out.
	// The reasoning is that if some countries were left out
	// and a user selects "International" option
	// then he can input a phone number for a non-included country
	// and perhaps that's what a developer didn't encourage
	// when he was reducing the set of selectable countries.
	return _countries.length >= countries.length
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