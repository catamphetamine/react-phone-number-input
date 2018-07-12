import PhoneInputDefault,
{
	PhoneInputNative,
	PhoneInput,
	formatPhoneNumber,
	parsePhoneNumberCharacters,
	// Deprecated. Will be removed in version 2.x.
	Input
}
from '../index'

describe(`exports`, function()
{
	it(`should export ES6`, function()
	{
		PhoneInputDefault.should.be.a('function')
		PhoneInputNative.should.be.a('function')

		PhoneInput.should.be.a('function')
		formatPhoneNumber.should.be.a('function')
		parsePhoneNumberCharacters.should.be.a('function')

		// Deprecated. Will be removed in version 2.x.
		Input.should.be.a('function')
	})

	it(`should export CommonJS`, function()
	{
		const Library = require('../index.commonjs')
		const Custom = require('../custom')

		Library.default.should.be.a('function')
		// Deprecated export.
		Library.should.be.a('function')

		Library.PhoneInputNative.should.be.a('function')

		Custom.default.should.be.a('function')
		// Deprecated export.
		Custom.should.be.a('function')

		Custom.PhoneInputNative.should.be.a('function')

		Custom.PhoneInput.should.be.a('function')
		Custom.formatPhoneNumber.should.be.a('function')
		Custom.parsePhoneNumberCharacters.should.be.a('function')
	})
})