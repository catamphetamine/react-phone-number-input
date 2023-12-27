import parsePhoneNumberCharacter from './parsePhoneNumberCharacter.js'

describe('parsePhoneNumberCharacter', () => {
	it('should work with a new `context` argument in `parsePhoneNumberCharacter()` function (international number)', () => {
		const context = {}

		parsePhoneNumberCharacter('+', undefined, context).should.equal('+')
		expect(context).to.deep.equal({})

		parsePhoneNumberCharacter('1', '+', context).should.equal('1')
		expect(context).to.deep.equal({})

		expect(parsePhoneNumberCharacter('+', '+1', context)).to.equal(undefined)
		expect(context).to.deep.equal({ ignoreRest: true })

		expect(parsePhoneNumberCharacter('2', '+1', context)).to.equal(undefined)
		expect(context).to.deep.equal({ ignoreRest: true })
	})

	it('should work with a new `context` argument in `parsePhoneNumberCharacter()` function (national number)', () => {
		const context = {}

		parsePhoneNumberCharacter('2', undefined, context).should.equal('2')
		expect(context).to.deep.equal({})

		expect(parsePhoneNumberCharacter('+', '2', context)).to.equal(undefined)
		expect(context).to.deep.equal({ ignoreRest: true })

		expect(parsePhoneNumberCharacter('1', '2', context)).to.equal(undefined)
		expect(context).to.deep.equal({ ignoreRest: true })
	})
})