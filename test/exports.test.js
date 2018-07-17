import PhoneInputDefault,
{
	PhoneInput
}
from '../index'

describe(`exports`, function()
{
	it(`should export ES6`, function()
	{
		PhoneInputDefault.should.be.a('function')
		PhoneInput.should.be.a('function')
	})

	it(`should export CommonJS`, function()
	{
		const Library = require('../index.commonjs')
		const Custom = require('../custom')

		Library.default.should.be.a('function')
		Custom.default.should.be.a('function')
	})
})