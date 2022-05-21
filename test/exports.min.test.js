import PhoneInput, {
	parsePhoneNumber,
	formatPhoneNumber,
	formatPhoneNumberIntl,
	isValidPhoneNumber,
	isPossiblePhoneNumber,
	getCountryCallingCode,
	getCountries,
	isSupportedCountry
} from '../min/index.js'

import Library from '../min/index.cjs'

describe('exports/min', () => {
	it('should export ES6', () => {
		PhoneInput.render.should.be.a('function')
		parsePhoneNumber('+78005553535').country.should.equal('RU')
		formatPhoneNumber('+12133734253').should.equal('(213) 373-4253')
		formatPhoneNumberIntl('+12133734253').should.equal('+1 213 373 4253')
		isValidPhoneNumber('+12133734253').should.equal(true)
		isPossiblePhoneNumber('+19999999999').should.equal(true)
		getCountryCallingCode('US').should.equal('1')
		getCountries()[0].length.should.equal(2)
		isSupportedCountry('XX').should.equal(false)
	})

	it('should export CommonJS', () => {
		Library.render.should.be.a('function')
		Library.default.render.should.be.a('function')
		Library.parsePhoneNumber('+78005553535').country.should.equal('RU')
		Library.formatPhoneNumber('+12133734253').should.equal('(213) 373-4253')
		Library.formatPhoneNumberIntl('+12133734253').should.equal('+1 213 373 4253')
		Library.isValidPhoneNumber('+12133734253').should.equal(true)
		Library.isPossiblePhoneNumber('+19999999999').should.equal(true)
		Library.getCountryCallingCode('US').should.equal('1')
		Library.getCountries()[0].length.should.equal(2)
		Library.isSupportedCountry('XX').should.equal(false)
	})
})