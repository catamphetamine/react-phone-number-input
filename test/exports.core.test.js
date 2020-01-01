import PhoneInput, {
	parsePhoneNumber,
	formatPhoneNumber,
	formatPhoneNumberIntl,
	isValidPhoneNumber,
	isPossiblePhoneNumber,
	getCountryCallingCode,
	getCountries
} from '../core/index'

import metadata from 'libphonenumber-js/metadata.min.json'

describe('exports/core', () => {
	it('should export ES6', () => {
		PhoneInput.render.should.be.a('function')
		parsePhoneNumber('+78005553535', metadata).country.should.equal('RU')
		formatPhoneNumber('+12133734253', metadata).should.equal('(213) 373-4253')
		formatPhoneNumberIntl('+12133734253', metadata).should.equal('+1 213 373 4253')
		isValidPhoneNumber('+12133734253', metadata).should.equal(true)
		isPossiblePhoneNumber('+19999999999', metadata).should.equal(true)
		getCountryCallingCode('US', metadata).should.equal('1')
		getCountries(metadata)[0].length.should.equal(2)
	})

	it('should export CommonJS', () => {
		const Library = require('../core/index.commonjs')
		Library.render.should.be.a('function')
		Library.default.render.should.be.a('function')
		Library.parsePhoneNumber('+78005553535', metadata).country.should.equal('RU')
		Library.formatPhoneNumber('+12133734253', metadata).should.equal('(213) 373-4253')
		Library.formatPhoneNumberIntl('+12133734253', metadata).should.equal('+1 213 373 4253')
		Library.isValidPhoneNumber('+12133734253', metadata).should.equal(true)
		Library.isPossiblePhoneNumber('+19999999999', metadata).should.equal(true)
		Library.getCountryCallingCode('US', metadata).should.equal('1')
		Library.getCountries(metadata)[0].length.should.equal(2)
	})
})