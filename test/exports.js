import React from 'react'
import Phone, { format, isValid } from '../index.es6'

describe(`exports`, function()
{
	it(`should export ES6`, function()
	{
		const render = (<Phone value="" format={ format.RU } onChange={ () => {} }/>)
		format.RU.city
		isValid('+79991234567', format.RU)
	})

	it(`should export CommonJS`, function()
	{
		const Phone = require('../index.common')

		const render = (<Phone value="" format={ Phone.format.RU } onChange={ () => {} }/>)
		Phone.format.RU.city
		Phone.isValid('+79991234567', Phone.format.RU)
	})
})