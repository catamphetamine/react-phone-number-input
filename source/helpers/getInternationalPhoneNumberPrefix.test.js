import { describe, it } from 'mocha'
import { expect } from 'chai'

import metadata from 'libphonenumber-js/min/metadata'

import getInternationalPhoneNumberPrefix from './getInternationalPhoneNumberPrefix.js'

describe('getInternationalPhoneNumberPrefix', () => {
	it('should prepend leading digits when generating international phone number prefix', () => {
		// No leading digits.
		expect(getInternationalPhoneNumberPrefix('RU', metadata)).to.equal('+7')

		// The "pre-fill with leading digits on country selection" feature had to be reverted.
		// https://gitlab.com/catamphetamine/react-phone-number-input/-/issues/10#note_1231042367
		// // Has "fixed" leading digits.
		// // https://gitlab.com/catamphetamine/react-phone-number-input/-/issues/10
		// expect(getInternationalPhoneNumberPrefix('AS', metadata)).to.equal('+1684')
	})
})