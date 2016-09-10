import chai, { expect } from 'chai'
chai.should()

import country, { country_from_locale } from '../source/country'

describe(`country`, function()
{
	it(`should detect country by phone number`, function()
	{
		country('+79991234567').should.equal('RU')
		country('+19991234567').should.equal('US')
		country('+447700954321').should.equal('GB')
		country('+441481000000').should.equal('GG')
	})

	it(`should parse ISO country code from locale`, function()
	{
		country_from_locale('ru-RU').should.equal('RU')
		expect(country_from_locale('en')).to.be.undefined
		country_from_locale('zh-Hans-HK').should.equal('HK')
	})
})