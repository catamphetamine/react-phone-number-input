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
from '../index.es6'

describe(`exports`, function()
{
	it(`should export ES6`, function()
	{
		const render = (<Phone value="" onChange={() => {}}/>)

		is_valid_phone_number('+79991234567', 'RU')
		isValidPhoneNumber('+79991234567', 'RU')

		parse_phone_number('+79991234567', 'RU')
		parsePhoneNumber('+79991234567', 'RU')

		format_phone_number('9991234567', 'RU')
		formatPhoneNumber('9991234567', 'RU')
	})

	it(`should export CommonJS`, function()
	{
		const Phone = require('../index.common')

		const render = (<Phone value="" onChange={() => {}}/>)

		Phone.is_valid_phone_number('+79991234567', 'RU')
		Phone.isValidPhoneNumber('+79991234567', 'RU')

		Phone.parse_phone_number('+79991234567', 'RU')
		Phone.parsePhoneNumber('+79991234567', 'RU')

		Phone.format_phone_number('9991234567', 'RU')
		Phone.formatPhoneNumber('9991234567', 'RU')
	})
})