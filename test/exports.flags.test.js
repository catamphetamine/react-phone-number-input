import Flags from '../flags/index'

describe('exports/flags', () => {
	it('should export ES6', () => {
		Flags.RU.should.be.a('function')
	}).timeout(60000)

	it('should export CommonJS', () => {
		const Library = require('../flags/index.commonjs')
		Library.default.RU.should.be.a('function')
	}).timeout(60000)
})