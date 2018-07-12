import parsePhoneNumberCharacters from './parsePhoneNumberCharacters'

describe('parsePhoneNumberCharacters', () =>
{
	it('should parse phone number characters', () =>
	{
		parsePhoneNumberCharacters('').should.equal('')

		// Doesn't accept non-leading `+`.
		parsePhoneNumberCharacters('++').should.equal('+')

		// Accepts leading `+`.
		parsePhoneNumberCharacters('+7 800 555').should.equal('+7800555')

		// Parses digits.
		parsePhoneNumberCharacters('8 (800) 555').should.equal('8800555')

		// Parses non-European digits.
		parsePhoneNumberCharacters('+٤٤٢٣٢٣٢٣٤').should.equal('+442323234')
	})
})