import { describe, it } from 'mocha'
import { expect } from 'chai'

import parsePhoneNumberCharacter from './parsePhoneNumberCharacter.js'

describe('parsePhoneNumberCharacter', () => {
	it('should work with a new `context` argument in `parsePhoneNumberCharacter()` function (international number)', () => {
		const context = {}

		expect(parsePhoneNumberCharacter('+', undefined, context)).to.equal('+')
		expect(context).to.deep.equal({})

		expect(parsePhoneNumberCharacter('1', '+', context)).to.equal('1')
		expect(context).to.deep.equal({})

		expect(parsePhoneNumberCharacter('+', '+1', context)).to.equal(undefined)
		expect(context).to.deep.equal({ ignoreRest: true })

		expect(parsePhoneNumberCharacter('2', '+1', context)).to.equal(undefined)
		expect(context).to.deep.equal({ ignoreRest: true })
	})

	it('should work with a new `context` argument in `parsePhoneNumberCharacter()` function (national number)', () => {
		const context = {}

		expect(parsePhoneNumberCharacter('2', undefined, context)).to.equal('2')
		expect(context).to.deep.equal({})

		expect(parsePhoneNumberCharacter('+', '2', context)).to.equal(undefined)
		expect(context).to.deep.equal({ ignoreRest: true })

		expect(parsePhoneNumberCharacter('1', '2', context)).to.equal(undefined)
		expect(context).to.deep.equal({ ignoreRest: true })
	})
})