import metadata from 'libphonenumber-js/metadata.min.json'

import getInternationalPhoneNumberPrefix from './getInternationalPhoneNumberPrefix'

describe('getInternationalPhoneNumberPrefix', () => {
	it('should prepend leading digits when generating international phone number prefix', () => {
		// No leading digits.
		getInternationalPhoneNumberPrefix('RU', metadata).should.equal('+7')
		// Has "fixed" leading digits.
		getInternationalPhoneNumberPrefix('AS', metadata).should.equal('+1684')
	})
})