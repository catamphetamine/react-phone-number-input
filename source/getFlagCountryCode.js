export default function getFlagCountryCode(country) {
	switch (country) {
		// "Ascension Island".
		// The flag is missing for it:
		// https://lipis.github.io/flag-icon-css/flags/4x3/ac.svg
		// GitHub issue:
		// https://github.com/lipis/flag-icon-css/issues/537
		// Using "SH" flag as a temporary substitute
		// because previously "AC" and "TA" were parts of "SH".
		case 'AC':
			return 'SH'

		// "Tristan da Cunha".
		// The flag is missing for it:
		// https://lipis.github.io/flag-icon-css/flags/4x3/ta.svg
		// GitHub issue:
		// https://github.com/lipis/flag-icon-css/issues/537
		// Using "SH" flag as a temporary substitute
		// because previously "AC" and "TA" were parts of "SH".
		case 'TA':
			return 'SH'

		default:
			return country
	}
}