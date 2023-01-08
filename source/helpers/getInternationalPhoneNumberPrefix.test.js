import metadata from 'libphonenumber-js/min/metadata'

import getInternationalPhoneNumberPrefix from './getInternationalPhoneNumberPrefix.js'

describe('getInternationalPhoneNumberPrefix', () => {
	it('should prepend leading digits when generating international phone number prefix', () => {
		// No leading digits.
		getInternationalPhoneNumberPrefix('RU', metadata).should.equal('+7')

		// The "pre-fill with leading digits on country selection" feature had to be reverted.
		// https://gitlab.com/catamphetamine/react-phone-number-input/-/issues/10#note_1231042367
		// // Has "fixed" leading digits.
		// // https://gitlab.com/catamphetamine/react-phone-number-input/-/issues/10
		// getInternationalPhoneNumberPrefix('AS', metadata).should.equal('+1684')
	})
})