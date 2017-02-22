import { createElement } from 'react'
import metadata from 'libphonenumber-js/metadata.min.json'

import CustomInput from './es6/input'

export var Input = CustomInput

export default function Phone(props)
{
   var properties = Object.keys(props).reduce(function(reduced, property)
   {
   	reduced[property] = props[property]
   	return reduced
   },
   { metadata: metadata })

	return createElement(Input, properties)
}

export
{
	parse as parse_phone_number,
	parse as parsePhoneNumber,
	format as format_phone_number,
	format as formatPhoneNumber,
	is_valid_number as is_valid_phone_number,
	is_valid_number as isValidPhoneNumber,
}
from 'libphonenumber-js'
