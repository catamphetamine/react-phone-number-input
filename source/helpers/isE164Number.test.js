import isE164Number, { validateE164Number } from './isE164Number.js'

describe('isE164Number', () => {
	it('should tell if a value is an E.164 phone number', () => {
		isE164Number('').should.equal(false)
		isE164Number('a').should.equal(false)
		isE164Number('aa').should.equal(false)
		isE164Number('1').should.equal(false)
		isE164Number('11').should.equal(false)
		isE164Number('111').should.equal(false)
		isE164Number('+').should.equal(false)
		isE164Number('+1').should.equal(true)
		isE164Number('+11').should.equal(true)
		isE164Number('+111').should.equal(true)
		isE164Number('+1a').should.equal(false)
		isE164Number('+aa').should.equal(false)
		isE164Number('+a1').should.equal(false)
	})

	it('should validate that a value is an E.164 phone number', () => {
		validateE164Number('a')
		validateE164Number('+78005553535')
	})
})