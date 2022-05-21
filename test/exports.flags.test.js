import Flags from '../flags/index.js'
import Library from '../flags/index.cjs'

describe('exports/flags', () => {
	it('should export ES6', () => {
		Flags.RU.should.be.a('function')
	}).timeout(60000)

	it('should export CommonJS', () => {
		Library.RU.should.be.a('function')
	}).timeout(60000)
})