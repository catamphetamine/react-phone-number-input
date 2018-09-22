import PhoneInputDefault,
{
	PhoneInput,
	formatPhoneNumber
}
from '../index'

describe(`exports`, function()
{
	it(`should export ES6`, function()
	{
		PhoneInputDefault.should.be.a('function')
		PhoneInput.should.be.a('function')
		formatPhoneNumber('+78005553535', 'International').should.equal('+7 800 555 35 35')
	})

	it(`should export CommonJS`, function()
	{
		const Library = require('../index.commonjs')
		const Custom = require('../custom')

		Library.default.should.be.a('function')
		Library.formatPhoneNumber('+78005553535', 'International').should.equal('+7 800 555 35 35')

		Custom.default.should.be.a('function')
	})
})