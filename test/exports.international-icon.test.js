import InternationalIcon from '../international-icon/index'

describe('exports/international-icon', () => {
	it('should export ES6', () => {
		InternationalIcon.should.be.a('function')
	})

	it('should export CommonJS', () => {
		const Library = require('../international-icon/index.commonjs')
		Library.default.should.be.a('function')
	})
})