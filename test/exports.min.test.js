import PhoneInput, {
	formatPhoneNumber,
	formatPhoneNumberIntl,
	isValidPhoneNumber
} from '../min/index'

describe('exports/min', () => {
	it('should export ES6', () => {
		PhoneInput.should.be.a('function')
		formatPhoneNumber('+12133734253').should.equal('(213) 373-4253')
		formatPhoneNumberIntl('+12133734253').should.equal('+1 213 373 4253')
		isValidPhoneNumber('+12133734253').should.equal(true)
	})

	it('should export CommonJS', () => {
		const Library = require('../min/index.commonjs')
		Library.should.be.a('function')
		Library.default.should.be.a('function')
		Library.formatPhoneNumber('+12133734253').should.equal('(213) 373-4253')
		Library.formatPhoneNumberIntl('+12133734253').should.equal('+1 213 373 4253')
		Library.isValidPhoneNumber('+12133734253').should.equal(true)
	})
})