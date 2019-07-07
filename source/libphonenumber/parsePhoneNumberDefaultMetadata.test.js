import parsePhoneNumber from './parsePhoneNumberDefaultMetadata'

describe('parsePhoneNumber (default metadata)', () => {
	it('should parse phone numbers', () => {
		parsePhoneNumber('+12133734253').country.should.equal('US')
	})
})