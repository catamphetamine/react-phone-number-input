import _isPossiblePhoneNumber from './isPossiblePhoneNumber'
import metadata from 'libphonenumber-js/metadata.min.json'

function isPossiblePhoneNumber(value) {
	return _isPossiblePhoneNumber(value, metadata)
}

describe('isPossiblePhoneNumber', () => {
	it('should tell if phone numbers are possible', () => {
		isPossiblePhoneNumber().should.equal(false)
		isPossiblePhoneNumber(null).should.equal(false)
		isPossiblePhoneNumber('').should.equal(false)
		isPossiblePhoneNumber('+1').should.equal(false)
		isPossiblePhoneNumber('+12133734253').should.equal(true)
		isPossiblePhoneNumber('+19999999999').should.equal(true)
	})
})