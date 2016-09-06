export { default as default } from './source/input'

export
{
	formats as phone_number_format,
	formats as phoneNumberFormat,
	validate as is_valid_phone_number,
	validate as isValidPhoneNumber,
	format as format_phone_number,
	format as formatPhoneNumber,
	plaintext_local,
	plaintext_local as plaintextLocal,
	plaintext_international,
	plaintext_international as plaintextInternational,
	parse_plaintext_international as parse_phone_number,
	parse_plaintext_international as parsePhoneNumber
}
from './source/phone'
