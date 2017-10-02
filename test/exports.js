import React from 'react'

import Phone,
{
	is_valid_phone_number,
	isValidPhoneNumber,
	format_phone_number,
	formatPhoneNumber,
	parse_phone_number,
	parsePhoneNumber
}
from '../index'

describe(`exports`, function()
{
	it(`should export ES6`, function()
	{
		const render = (<Phone value="" onChange={() => {}}/>)

		is_valid_phone_number('+79991234567')
		isValidPhoneNumber('+79991234567')

		parse_phone_number('+79991234567')
		parsePhoneNumber('+79991234567')

		format_phone_number('9991234567', 'RU', 'National')
		formatPhoneNumber('9991234567', 'RU', 'National')
	})

	it(`should export CommonJS`, function()
	{
		const Phone = require('../index.common')

		const render = (<Phone value="" onChange={() => {}}/>)

		Phone.is_valid_phone_number('+79991234567')
		Phone.isValidPhoneNumber('+79991234567')

		Phone.parse_phone_number('+79991234567')
		Phone.parsePhoneNumber('+79991234567')

		Phone.format_phone_number('9991234567', 'RU', 'National')
		Phone.formatPhoneNumber('9991234567', 'RU', 'National')
	})
})