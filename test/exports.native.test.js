import PhoneInputCustom from '../native-custom/index'

describe('exports/native-custom', () => {
	it('should export ES6', () => {
		PhoneInputCustom.should.be.a('function')
	})

	it('should export CommonJS', () => {
		const Library = require('../native-custom/index.commonjs')
		Library.should.be.a('function')
		Library.default.should.be.a('function')
	})
})