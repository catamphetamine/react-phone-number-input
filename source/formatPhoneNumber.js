import { AsYouType } from 'libphonenumber-js/custom'

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
export default function formatPhoneNumber(value, country, metadata)
{
	// "As you type" formatter.
	const formatter = new AsYouType(country, metadata)

	// Format the number.
	const text = formatter.input(value)

	return { text, template: formatter.template }
}