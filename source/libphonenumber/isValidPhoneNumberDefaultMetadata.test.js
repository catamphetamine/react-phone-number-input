import isValidPhoneNumber from './isValidPhoneNumberDefaultMetadata'

describe('isValidPhoneNumberDefaultMetadata', () => {
	it('should validate phone numbers', () => {
		isValidPhoneNumber('+1').should.equal(false)
		isValidPhoneNumber('+12133734253').should.equal(true)
		isValidPhoneNumber('+19999999999').should.equal(false)
	})
})