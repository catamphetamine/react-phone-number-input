import Input from './modules/Input'
export { default as default } from './modules/InputWithDefaultMetadata'

export
{
	parse as parse_phone_number,
	parse as parsePhoneNumber,
	format as format_phone_number,
	format as formatPhoneNumber,
	isValidNumber as is_valid_phone_number,
	isValidNumber as isValidPhoneNumber,
}
from 'libphonenumber-js'
