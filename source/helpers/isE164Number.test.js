import { describe, it } from 'mocha'
import { expect } from 'chai'

import isE164Number, { validateE164Number } from './isE164Number.js'

describe('isE164Number', () => {
	it('should tell if a value is an E.164 phone number', () => {
		expect(isE164Number('')).to.equal(false)
		expect(isE164Number('a')).to.equal(false)
		expect(isE164Number('aa')).to.equal(false)
		expect(isE164Number('1')).to.equal(false)
		expect(isE164Number('11')).to.equal(false)
		expect(isE164Number('111')).to.equal(false)
		expect(isE164Number('+')).to.equal(false)
		expect(isE164Number('+1')).to.equal(true)
		expect(isE164Number('+11')).to.equal(true)
		expect(isE164Number('+111')).to.equal(true)
		expect(isE164Number('+1a')).to.equal(false)
		expect(isE164Number('+aa')).to.equal(false)
		expect(isE164Number('+a1')).to.equal(false)
	})

	it('should validate that a value is an E.164 phone number', () => {
		validateE164Number('a')
		validateE164Number('+78005553535')
	})
})