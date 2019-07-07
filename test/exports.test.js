import PhoneInputDefault,
{
	PhoneInput,
	parseRFC3966,
	formatRFC3966,
	parsePhoneNumber,
	formatPhoneNumber,
	formatPhoneNumberIntl,
	isValidPhoneNumber
}
from '../index'

describe(`exports`, function()
{
	it(`should export ES6`, function()
	{
		PhoneInputDefault.should.be.a('function')
		PhoneInput.should.be.a('function')
		parseRFC3966('tel:+12133734253;ext=123').ext.should.equal('123')
		formatRFC3966({ number: '+12133734253', ext: '123' }).should.equal('tel:+12133734253;ext=123')
		parsePhoneNumber('+78005553535').country.should.equal('RU')
		formatPhoneNumber('+78005553535').should.equal('8 (800) 555-35-35')
		formatPhoneNumberIntl('+78005553535').should.equal('+7 800 555 35 35')
		isValidPhoneNumber('+78005553535').should.equal(true)
	})

	it(`should export CommonJS`, function()
	{
		const Library = require('../index.commonjs')
		const Custom = require('../custom')

		Library.default.should.be.a('function')
		Library.parseRFC3966('tel:+12133734253;ext=123').ext.should.equal('123')
		Library.formatRFC3966({ number: '+12133734253', ext: '123' }).should.equal('tel:+12133734253;ext=123')
		Library.parsePhoneNumber('+78005553535').country.should.equal('RU')
		Library.formatPhoneNumber('+78005553535').should.equal('8 (800) 555-35-35')
		Library.formatPhoneNumberIntl('+78005553535').should.equal('+7 800 555 35 35')
		Library.isValidPhoneNumber('+78005553535').should.equal(true)

		Custom.default.should.be.a('function')
	})
})