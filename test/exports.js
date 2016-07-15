import React from 'react'

import Phone,
{
	phone_number_format,
	phoneNumberFormat,
	is_valid_phone_number,
	isValidPhoneNumber,
	format_phone_number,
	formatPhoneNumber,
	format_phone_number_international,
	formatPhoneNumberInternational
}
from '../index.es6'

describe(`exports`, function()
{
	it(`should export ES6`, function()
	{
		const render = (<Phone value="" format={ phone_number_format.RU } onChange={ () => {} }/>)
		
		phone_number_format.RU.city
		phoneNumberFormat.RU.city

		is_valid_phone_number('+79991234567', phone_number_format.RU)
		isValidPhoneNumber('+79991234567', phone_number_format.RU)

		format_phone_number('+79991234567', phone_number_format.RU)
		formatPhoneNumber('+79991234567', phone_number_format.RU)

		format_phone_number_international('+79991234567', phone_number_format.RU)
		formatPhoneNumberInternational('+79991234567', phone_number_format.RU)
	})

	it(`should export CommonJS`, function()
	{
		const Phone = require('../index.common')

		const render = (<Phone value="" format={ Phone.phone_number_format.RU } onChange={ () => {} }/>)

		Phone.phone_number_format.RU.city
		Phone.phoneNumberFormat.RU.city

		Phone.is_valid_phone_number('+79991234567', Phone.phone_number_format.RU)
		Phone.isValidPhoneNumber('+79991234567', Phone.phone_number_format.RU)

		Phone.format_phone_number('+79991234567', Phone.phone_number_format.RU)
		Phone.formatPhoneNumber('+79991234567', Phone.phone_number_format.RU)

		Phone.format_phone_number_international('+79991234567', Phone.phone_number_format.RU)
		Phone.formatPhoneNumberInternational('+79991234567', Phone.phone_number_format.RU)
	})
})