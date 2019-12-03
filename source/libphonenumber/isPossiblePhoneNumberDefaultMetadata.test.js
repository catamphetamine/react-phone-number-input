import isPossiblePhoneNumber from './isPossiblePhoneNumberDefaultMetadata'

describe('isPossiblePhoneNumberDefaultMetadata', () => {
	it('should tell if phone numbers are possible', () => {
		isPossiblePhoneNumber('+1').should.equal(false)
		isPossiblePhoneNumber('+12133734253').should.equal(true)
		isPossiblePhoneNumber('+19999999999').should.equal(true)
	})
})