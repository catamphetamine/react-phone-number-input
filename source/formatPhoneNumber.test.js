import formatPhoneNumber from './formatPhoneNumber'

import metadata from 'libphonenumber-js/metadata.min'

describe('formatPhoneNumber', () =>
{
	it('should format parsed input value', () =>
	{
		let result

		// National input.
		result = formatPhoneNumber('880055535', 'RU', metadata)
		result.text.should.equal('8 (800) 555-35')
		result.template.should.equal('x (xxx) xxx-xx-xx')

		// International input, no country.
		result = formatPhoneNumber('+780055535', null, metadata)
		result.text.should.equal('+7 800 555 35')
		result.template.should.equal('xx xxx xxx xx xx')

		// International input, with country.
		result = formatPhoneNumber('+780055535', 'RU', metadata)
		result.text.should.equal('+7 800 555 35')
		result.template.should.equal('xx xxx xxx xx xx')
	})
})