import _isValidPhoneNumber from './isValidPhoneNumber'
import metadata from 'libphonenumber-js/metadata.min.json'

function isValidPhoneNumber(value) {
	return _isValidPhoneNumber(value, metadata)
}

describe('isValidPhoneNumber', () => {
	it('should validate phone numbers', () => {
		isValidPhoneNumber().should.equal(false)
		isValidPhoneNumber(null).should.equal(false)
		isValidPhoneNumber('').should.equal(false)
		isValidPhoneNumber('+1').should.equal(false)
		isValidPhoneNumber('+12133734253').should.equal(true)
		isValidPhoneNumber('+19999999999').should.equal(false)
	})
})