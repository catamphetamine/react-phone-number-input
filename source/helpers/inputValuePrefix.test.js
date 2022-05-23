import metadata from 'libphonenumber-js/min/metadata'

import { getInputValuePrefix, removeInputValuePrefix } from './inputValuePrefix.js'

describe('inputValuePrefix', () => {
	it('should get input value prefix', () => {
		getInputValuePrefix({
			country: 'RU',
			metadata
		}).should.equal('')

		getInputValuePrefix({
			country: 'RU',
			international: true,
			withCountryCallingCode: true,
			metadata
		}).should.equal('')

		getInputValuePrefix({
			country: 'RU',
			international: true,
			metadata
		}).should.equal('+7')
	})

	it('should remove input value prefix', () => {
		removeInputValuePrefix('+78005553535', '+7').should.equal('8005553535')
		removeInputValuePrefix('+7 800 555 35 35', '+7').should.equal('800 555 35 35')
		removeInputValuePrefix('8 (800) 555-35-35', '').should.equal('8 (800) 555-35-35')
	})
})