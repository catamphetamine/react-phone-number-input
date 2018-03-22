import Phone,
{
	Input
}
from '../index'

describe(`exports`, function()
{
	it(`should export ES6`, function()
	{
		Phone.should.be.a('function')
		Input.should.be.a('function')
	})

	it(`should export CommonJS`, function()
	{
		const Library = require('../index.commonjs')
		const Input = require('../custom')

		Library.should.be.a('function')
		Input.should.be.a('function')
	})
})