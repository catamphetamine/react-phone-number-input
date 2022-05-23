import metadata from 'libphonenumber-js/min/metadata'

import getInternationalPhoneNumberPrefix from './getInternationalPhoneNumberPrefix.js'

describe('getInternationalPhoneNumberPrefix', () => {
	it('should prepend leading digits when generating international phone number prefix', () => {
		// No leading digits.
		getInternationalPhoneNumberPrefix('RU', metadata).should.equal('+7')
		// Has "fixed" leading digits.
		getInternationalPhoneNumberPrefix('AS', metadata).should.equal('+1684')
	})
})