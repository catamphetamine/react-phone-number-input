import formatPhoneNumber, { formatPhoneNumberIntl } from './formatPhoneNumberDefaultMetadata'

describe('formatPhoneNumberDefaultMetadata', () => {
	it('should format phone numbers', () => {
		formatPhoneNumber('+12133734253', 'NATIONAL').should.equal('(213) 373-4253')
		formatPhoneNumber('+12133734253', 'INTERNATIONAL').should.equal('+1 213 373 4253')
		formatPhoneNumberIntl('+12133734253').should.equal('+1 213 373 4253')
	})
})