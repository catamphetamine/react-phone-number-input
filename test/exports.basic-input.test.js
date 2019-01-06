import Input from '../basic-input/index'
import InputCustom from '../basic-input-custom/index'

describe('exports/basic-input', () => {
	it('should export ES6', () => {
		Input.should.be.a('function')
	})

	it('should export CommonJS', () => {
		const Library = require('../basic-input/index.commonjs')
		Library.should.be.a('function')
		Library.default.should.be.a('function')
	})
})

describe('exports/basic-input-custom', () => {
	it('should export ES6', () => {
		InputCustom.should.be.a('function')
	})

	it('should export CommonJS', () => {
		const Library = require('../basic-input-custom/index.commonjs')
		Library.should.be.a('function')
		Library.default.should.be.a('function')
	})
})