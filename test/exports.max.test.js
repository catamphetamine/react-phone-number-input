import PhoneInput, {
	parseRFC3966,
	formatRFC3966,
	parsePhoneNumber,
	formatPhoneNumber,
	formatPhoneNumberIntl,
	isValidPhoneNumber,
	isPossiblePhoneNumber,
	getCountryCallingCode,
	getCountries
} from '../max/index'

describe('exports/max', () => {
	it('should export ES6', () => {
		PhoneInput.should.be.a('function')
		parseRFC3966('tel:+12133734253;ext=123').ext.should.equal('123')
		formatRFC3966({ number: '+12133734253', ext: '123' }).should.equal('tel:+12133734253;ext=123')
		parsePhoneNumber('+78005553535').country.should.equal('RU')
		formatPhoneNumber('+12133734253').should.equal('(213) 373-4253')
		formatPhoneNumberIntl('+12133734253').should.equal('+1 213 373 4253')
		isValidPhoneNumber('+12133734253').should.equal(true)
		isPossiblePhoneNumber('+19999999999').should.equal(true)
		getCountryCallingCode('US').should.equal('1')
		getCountries()[0].length.should.equal(2)
	})

	it('should export CommonJS', () => {
		const Library = require('../max/index.commonjs')
		Library.should.be.a('function')
		Library.default.should.be.a('function')
		Library.parseRFC3966('tel:+12133734253;ext=123').ext.should.equal('123')
		Library.formatRFC3966({ number: '+12133734253', ext: '123' }).should.equal('tel:+12133734253;ext=123')
		Library.parsePhoneNumber('+78005553535').country.should.equal('RU')
		Library.formatPhoneNumber('+12133734253').should.equal('(213) 373-4253')
		Library.formatPhoneNumberIntl('+12133734253').should.equal('+1 213 373 4253')
		Library.isValidPhoneNumber('+12133734253').should.equal(true)
		Library.isPossiblePhoneNumber('+19999999999').should.equal(true)
		Library.getCountryCallingCode('US').should.equal('1')
		Library.getCountries()[0].length.should.equal(2)
	})
})