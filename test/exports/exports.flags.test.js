import { describe, it } from 'mocha'
import { expect } from 'chai'

import Flags from '../../flags/index.js'
import Library from '../../flags/index.cjs'

describe('exports/flags', () => {
	it('should export ES6', () => {
		expect(Flags.RU).to.be.a('function')
	}).timeout(60000)

	it('should export CommonJS', () => {
		expect(Library.RU).to.be.a('function')
	}).timeout(60000)
})