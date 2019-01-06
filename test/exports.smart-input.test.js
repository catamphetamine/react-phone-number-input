import Input from '../smart-input/index'
import InputCustom from '../smart-input-custom/index'

describe('exports/smart-input', () => {
	it('should export ES6', () => {
		Input.should.be.a('function')
	})

	it('should export CommonJS', () => {
		const Library = require('../smart-input/index.commonjs')
		Library.should.be.a('function')
		Library.default.should.be.a('function')
	})
})

describe('exports/smart-input-custom', () => {
	it('should export ES6', () => {
		InputCustom.should.be.a('function')
	})

	it('should export CommonJS', () => {
		const Library = require('../smart-input-custom/index.commonjs')
		Library.should.be.a('function')
		Library.default.should.be.a('function')
	})
})