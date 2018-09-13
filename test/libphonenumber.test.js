import { parseNumber } from '../libphonenumber'

describe(`"libphonenumber" export`, function()
{
	it(`should export ES6`, function()
	{
		parseNumber('+78005553535').should.deep.equal({ country: 'RU', phone: '8005553535' })
	})

	it(`should export CommonJS`, function()
	{
		const Library = require('../libphonenumber')

		Library.parseNumber('+78005553535').should.deep.equal({ country: 'RU', phone: '8005553535' })
	})
})