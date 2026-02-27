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
} from '../../core/index.js'

import Library from '../../core/index.cjs'

import metadata from 'libphonenumber-js/min/metadata'

describe('exports/core', () => {
	it('should export ES6', () => {
		expect(PhoneInput.render).to.be.a('function')
		expect(parsePhoneNumber('+78005553535', metadata).country).to.equal('RU')
		expect(formatPhoneNumber('+12133734253', metadata)).to.equal('(213) 373-4253')
		expect(formatPhoneNumberIntl('+12133734253', metadata)).to.equal('+1 213 373 4253')
		expect(isValidPhoneNumber('+12133734253', metadata)).to.equal(true)
		expect(isPossiblePhoneNumber('+19999999999', metadata)).to.equal(true)
		expect(getCountryCallingCode('US', metadata)).to.equal('1')
		expect(getCountries(metadata)[0].length).to.equal(2)
		expect(isSupportedCountry('XX', metadata)).to.equal(false)
	})

	it('should export CommonJS', () => {
		expect(Library.render).to.be.a('function')
		expect(Library.default.render).to.be.a('function')
		expect(Library.parsePhoneNumber('+78005553535', metadata).country).to.equal('RU')
		expect(Library.formatPhoneNumber('+12133734253', metadata)).to.equal('(213) 373-4253')
		expect(Library.formatPhoneNumberIntl('+12133734253', metadata)).to.equal('+1 213 373 4253')
		expect(Library.isValidPhoneNumber('+12133734253', metadata)).to.equal(true)
		expect(Library.isPossiblePhoneNumber('+19999999999', metadata)).to.equal(true)
		expect(Library.getCountryCallingCode('US', metadata)).to.equal('1')
		expect(Library.getCountries(metadata)[0].length).to.equal(2)
		expect(Library.isSupportedCountry('XX', metadata)).to.equal(false)
	})
})