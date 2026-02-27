import { describe, it } from 'mocha'
import { expect } from 'chai'

import PhoneInput, {
	parsePhoneNumber,
	formatPhoneNumber,
	formatPhoneNumberIntl,
	isValidPhoneNumber,
	isPossiblePhoneNumber,
	getCountryCallingCode,
	getCountries,
	isSupportedCountry
} from '../../max/index.js'

import Library from '../../max/index.cjs'

describe('exports/max', () => {
	it('should export ES6', () => {
		expect(PhoneInput.render).to.be.a('function')
		expect(parsePhoneNumber('+78005553535').country).to.equal('RU')
		expect(formatPhoneNumber('+12133734253')).to.equal('(213) 373-4253')
		expect(formatPhoneNumberIntl('+12133734253')).to.equal('+1 213 373 4253')
		expect(isValidPhoneNumber('+12133734253')).to.equal(true)
		expect(isPossiblePhoneNumber('+19999999999')).to.equal(true)
		expect(getCountryCallingCode('US')).to.equal('1')
		expect(getCountries()[0].length).to.equal(2)
		expect(isSupportedCountry('XX')).to.equal(false)
	})

	it('should export CommonJS', () => {
		expect(Library.render).to.be.a('function')
		expect(Library.default.render).to.be.a('function')
		expect(Library.parsePhoneNumber('+78005553535').country).to.equal('RU')
		expect(Library.formatPhoneNumber('+12133734253')).to.equal('(213) 373-4253')
		expect(Library.formatPhoneNumberIntl('+12133734253')).to.equal('+1 213 373 4253')
		expect(Library.isValidPhoneNumber('+12133734253')).to.equal(true)
		expect(Library.isPossiblePhoneNumber('+19999999999')).to.equal(true)
		expect(Library.getCountryCallingCode('US')).to.equal('1')
		expect(Library.getCountries()[0].length).to.equal(2)
		expect(Library.isSupportedCountry('XX')).to.equal(false)
	})
})