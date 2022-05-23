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
		// formatPhoneNumber().should.equal('')
		formatPhoneNumber(null).should.equal('')
		formatPhoneNumber('').should.equal('')
		expect(() => _formatPhoneNumber('+1', 'NATIONAL')).to.throw('`metadata` argument not passed')
		expect(() => _formatPhoneNumber('+12133734253', undefined, metadata)).to.throw('Unknown "format"')
		expect(() => _formatPhoneNumber('+12133734253', '123', metadata)).to.throw('Unknown "format"')
		formatPhoneNumber('+1', 'NATIONAL').should.equal('')
		formatPhoneNumber('+12133734253', 'NATIONAL').should.equal('(213) 373-4253')
		formatPhoneNumber('+12133734253').should.equal('(213) 373-4253')
		formatPhoneNumber('+12133734253', 'INTERNATIONAL').should.equal('+1 213 373 4253')
		// Deprecated.
		// Legacy `format`s.
		formatPhoneNumber('+12133734253', 'National').should.equal('(213) 373-4253')
		formatPhoneNumber('+12133734253', 'International').should.equal('+1 213 373 4253')
	})

	it('should format international phone numbers', () => {
		formatPhoneNumberIntl('+12133734253').should.equal('+1 213 373 4253')
	})
})