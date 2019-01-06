import Input from '../react-responsive-ui/index'
import InputCustom from '../react-responsive-ui-custom/index'

describe('exports/react-responsive-ui', () => {
	it('should export ES6', () => {
		Input.should.be.a('function')
	})

	it('should export CommonJS', () => {
		const Library = require('../react-responsive-ui/index.commonjs')
		Library.should.be.a('function')
		Library.default.should.be.a('function')
	})
})

describe('exports/react-responsive-ui-custom', () => {
	it('should export ES6', () => {
		InputCustom.should.be.a('function')
	})

	it('should export CommonJS', () => {
		const Library = require('../react-responsive-ui-custom/index.commonjs')
		Library.should.be.a('function')
		Library.default.should.be.a('function')
	})
})