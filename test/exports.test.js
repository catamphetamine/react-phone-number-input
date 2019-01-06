import PhoneInputDefault,
{
	PhoneInput,
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
		formatPhoneNumber('+78005553535').should.equal('8 (800) 555-35-35')
		formatPhoneNumberIntl('+78005553535').should.equal('+7 800 555 35 35')
		isValidPhoneNumber('+78005553535').should.equal(true)
	})

	it(`should export CommonJS`, function()
	{
		const Library = require('../index.commonjs')
		const Custom = require('../custom')

		Library.default.should.be.a('function')
		Library.formatPhoneNumber('+78005553535').should.equal('8 (800) 555-35-35')
		Library.formatPhoneNumberIntl('+78005553535').should.equal('+7 800 555 35 35')
		Library.isValidPhoneNumber('+78005553535').should.equal(true)

		Custom.default.should.be.a('function')
	})
})