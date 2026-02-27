import { describe, it } from 'mocha'
import { expect } from 'chai'

import metadata from 'libphonenumber-js/min/metadata'

import {
	sortCountryOptions,
	getSupportedCountryOptions,
	isCountrySupportedWithError,
	getSupportedCountries
} from './countries.js'

describe('sortCountryOptions', () => {
	it('should sort country options (no `order`)', () => {
		expect(sortCountryOptions([
			{
				value: 'RU',
				label: 'Russia'
			},
			{
				value: 'US',
				label: 'United States'
			}
		])).to.deep.equal([
			{
				value: 'RU',
				label: 'Russia'
			},
			{
				value: 'US',
				label: 'United States'
			}
		])
	})

	it('should sort country options (with a divider)', () => {
		expect(sortCountryOptions(
			[
				{
					value: 'RU',
					label: 'Russia'
				},
				{
					value: 'US',
					label: 'United States'
				}
			],
			['US', '|', 'RU']
		)).to.deep.equal([
			{
				value: 'US',
				label: 'United States'
			},
			{
				divider: true
			},
			{
				value: 'RU',
				label: 'Russia'
			}
		])
	})

	it('should sort country options (with "...")', () => {
		expect(sortCountryOptions(
			[
				{
					value: 'RU',
					label: 'Russia'
				},
				{
					value: 'US',
					label: 'United States'
				}
			],
			['US', '|', '...']
		)).to.deep.equal([
			{
				value: 'US',
				label: 'United States'
			},
			{
				divider: true
			},
			{
				value: 'RU',
				label: 'Russia'
			}
		])
	})

	it('should sort country options (with "…")', () => {
		expect(sortCountryOptions(
			[
				{
					value: 'RU',
					label: 'Russia'
				},
				{
					value: 'US',
					label: 'United States'
				}
			],
			['US', '|', '…']
		)).to.deep.equal([
			{
				value: 'US',
				label: 'United States'
			},
			{
				divider: true
			},
			{
				value: 'RU',
				label: 'Russia'
			}
		])
	})

	it('should sort country options (with "🌐")', () => {
		expect(sortCountryOptions(
			[
				{
					value: 'RU',
					label: 'Russia'
				},
				{
					label: 'International'
				},
				{
					value: 'US',
					label: 'United States'
				}
			],
			['US', '🌐', '…']
		)).to.deep.equal([
			{
				value: 'US',
				label: 'United States'
			},
			{
				label: 'International'
			},
			{
				value: 'RU',
				label: 'Russia'
			}
		])
	})
})

describe('getSupportedCountryOptions', () => {
	it('should get supported country options', () => {
		expect(getSupportedCountryOptions([
			'🌐',
			'RU',
			'XX',
			'@',
			'|',
			'…',
			'...',
			'.'
		], metadata)).to.deep.equal([
			'🌐',
			'RU',
			'|',
			'…',
			'...'
		])
	})

	it('should get supported country options (none supported)', () => {
		expect(getSupportedCountryOptions([
			'XX',
			'@',
			'.'
		], metadata)).to.be.undefined
	})

	it('should get supported country options (none supplied)', () => {
		expect(getSupportedCountryOptions(undefined, metadata)).to.be.undefined
	})

	it('should tell is country is supported with error', () => {
		expect(isCountrySupportedWithError('RU', metadata)).to.equal(true)
		expect(isCountrySupportedWithError('XX', metadata)).to.equal(false)
	})

	it('should get supported countries', () => {
		expect(getSupportedCountries(['RU', 'XX'], metadata)).to.deep.equal(['RU'])
	})

	it('should get supported countries (none supported)', () => {
		expect(getSupportedCountries(['XX'], metadata)).to.be.undefined
	})
})