import metadata from 'libphonenumber-js/metadata.min'

import create_input,
{
	parse_phone_number    as parse,
	format_phone_number   as format,
	is_valid_phone_number as is_valid_number
}
from './custom.es6'

export default create_input(metadata)

var context = { metadata: metadata }

export var parse_phone_number    = parse.bind(context)
export var parsePhoneNumber      = parse_phone_number

export var format_phone_number   = format.bind(context)
export var formatPhoneNumber     = format_phone_number

export var is_valid_phone_number = is_valid_number.bind(context)
export var isValidPhoneNumber    = is_valid_phone_number