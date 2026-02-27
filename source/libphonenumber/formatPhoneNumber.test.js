import { describe, it } from 'mocha'
import { expect } from 'chai'

import _formatPhoneNumber, { formatPhoneNumberIntl as _formatPhoneNumberIntl } from './formatPhoneNumber.js'
import metadata from 'libphonenumber-js/min/metadata'

function call(func, _arguments) {
	var args = Array.prototype.slice.call(_arguments)
	args.push(metadata)
	return func.apply(this, args)
}

function formatPhoneNumber() {
	return call(_formatPhoneNumber, arguments)
}

function formatPhoneNumberIntl() {
	return call(_formatPhoneNumberIntl, arguments)
}

describe('formatPhoneNumber', () => {
	it('should format phone numbers', () => {
		expect(() => formatPhoneNumber()).to.throw('must be a string')
		// expect(formatPhoneNumber()).to.equal('')
		expect(formatPhoneNumber(null)).to.equal('')
		expect(formatPhoneNumber('')).to.equal('')
		expect(() => _formatPhoneNumber('+1', 'NATIONAL')).to.throw('`metadata` argument not passed')
		expect(() => _formatPhoneNumber('+12133734253', undefined, metadata)).to.throw('Unknown "format"')
		expect(() => _formatPhoneNumber('+12133734253', '123', metadata)).to.throw('Unknown "format"')
		expect(formatPhoneNumber('+1', 'NATIONAL')).to.equal('')
		expect(formatPhoneNumber('+12133734253', 'NATIONAL')).to.equal('(213) 373-4253')
		expect(formatPhoneNumber('+12133734253')).to.equal('(213) 373-4253')
		expect(formatPhoneNumber('+12133734253', 'INTERNATIONAL')).to.equal('+1 213 373 4253')
		// Deprecated.
		// Legacy `format`s.
		expect(formatPhoneNumber('+12133734253', 'National')).to.equal('(213) 373-4253')
		expect(formatPhoneNumber('+12133734253', 'International')).to.equal('+1 213 373 4253')
	})

	it('should format international phone numbers', () => {
		expect(formatPhoneNumberIntl('+12133734253')).to.equal('+1 213 373 4253')
	})
})