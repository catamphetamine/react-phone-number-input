export { default as default } from './source/input/input'

export
{
	default as phone_number_format,
	default as phoneNumberFormat
}
from './source/formats'

export
{
	validate as is_valid_phone_number,
	validate as isValidPhoneNumber,
	format as format_phone_number,
	format as formatPhoneNumber,
	format_local as format_local,
	format_local as formatLocal,
	plaintext_local,
	plaintext_local as plaintextLocal,
	plaintext_international,
	plaintext_international as plaintextInternational,
	parse_plaintext_international as parse_phone_number,
	parse_plaintext_international as parsePhoneNumber
}
from './source/phone'

export
{
	default as country,
	country_codes,
	country_codes as countryCodes,
	country_from_locale,
	country_from_locale as countryFromLocale
}
from './source/country'

export
{
	edit_and_format,
	edit_and_format as editAndFormat,
	parse_value,
	parse_value as parseValue,
	format_value,
	format_value as formatValue
}
from './source/input/editable'