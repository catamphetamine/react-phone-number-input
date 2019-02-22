// See the table of officially assigned ISO 3166-1 alpha-2 country codes:
// https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2#Current_codes
export const SKIP_COUNTRIES = [
	// "001" means "Non-Geographical Entity" ("No country", "International").
	'001',

	// "Ascension Island".
	// "AC" is not an officially assigned ISO 3166-1 alpha-2 country code.
	// And there's no flag for it:
	// https://lipis.github.io/flag-icon-css/flags/4x3/ac.svg
	'AC',

	// "Tristan da Cunha".
	// "TA" is not an officially assigned ISO 3166-1 alpha-2 country code.
	// And there's no flag for it:
	// https://lipis.github.io/flag-icon-css/flags/4x3/ta.svg
	'TA',

	// `flag-icon-css` with "XK" territory flag hasn't been released.
	// https://github.com/lipis/flag-icon-css/pull/501#issuecomment-466359515
	//
	// "Kosovo".
	// "XK" is not an officially assigned ISO 3166-1 alpha-2 country code.
	// Kosovo is still a disputed and non-internationally-recognized territory,
	// and the UN Resolution 1244 is still valid.
	// https://en.wikipedia.org/wiki/United_Nations_Security_Council_Resolution_1244
	//
	// https://github.com/catamphetamine/react-phone-number-input/issues/153
	// https://github.com/catamphetamine/react-phone-number-input/pull/155
	//
	'XK'
]

export function getCountryCodes(labels)
{
	// Includes all country codes (excluding "ZZ" for "International").
	//
	// From ISO 3166-1:2006(E/F):
	//
	// 8.1.3   User-assigned code elements
	//
	// If users need code elements to represent country names not included
	// in this part of ISO 3166, the series of letters AA, QM to QZ, XA
	// to XZ, and ZZ, and the series AAA to AAZ, QMA to QZZ, XAA to XZZ,
	// and ZZA to ZZZ respectively, and the series of numbers 900 to 999
	// are available. These users should inform the ISO 3166/MA of such use.
	//
	return Object.keys(labels).filter((key) => {
		return key.length === 2 && key.toUpperCase() === key && key !== 'ZZ' && SKIP_COUNTRIES.indexOf(key) < 0
	})
}