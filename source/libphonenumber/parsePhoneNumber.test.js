import _parsePhoneNumber from './parsePhoneNumber'
import metadata from 'libphonenumber-js/metadata.min.json'

function call(func, _arguments) {
	var args = Array.prototype.slice.call(_arguments)
	args.push(metadata)
	return func.apply(this, args)
}

function parsePhoneNumber() {
	return call(_parsePhoneNumber, arguments)
}

describe('parsePhoneNumber', () => {
	it('should parse phone numbers', () => {
		parsePhoneNumber('+12133734253').country.should.equal('US')
	})
})