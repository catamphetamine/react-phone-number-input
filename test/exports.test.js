import Phone,
{
	Input,
	BasicInput
}
from '../index'

describe(`exports`, function()
{
	it(`should export ES6`, function()
	{
		Phone.should.be.a('function')
		Input.should.be.a('function')
		BasicInput.should.be.a('function')
	})

	it(`should export CommonJS`, function()
	{
		const Library = require('../index.commonjs')
		const Custom = require('../custom')

		Library.default.should.be.a('function')
		// Deprecated export.
		Library.should.be.a('function')

		Custom.default.should.be.a('function')
		// Deprecated export.
		Custom.should.be.a('function')

		// Duplicating this export.
		Library.BasicInput.should.be.a('function')
		Custom.BasicInput.should.be.a('function')
	})
})