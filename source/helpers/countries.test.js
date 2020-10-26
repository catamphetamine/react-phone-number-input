import metadata from 'libphonenumber-js/metadata.min.json'

import {
	sortCountryOptions,
	getSupportedCountryOptions,
	isCountrySupportedWithError,
	getSupportedCountries
} from './countries'

describe('helpers/countries', () => {
	it('should sort country options (no `order`)', () => {
		sortCountryOptions([
			{
				value: 'RU',
				label: 'Russia'
			},
			{
				value: 'US',
				label: 'United States'
			}
		]).should.deep.equal([
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
		sortCountryOptions(
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
		).should.deep.equal([
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
		sortCountryOptions(
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
		).should.deep.equal([
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
		sortCountryOptions(
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
		).should.deep.equal([
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

	it('should get supported country options', () => {
		getSupportedCountryOptions([
			'RU',
			'XX',
			'@',
			'|',
			'…',
			'...',
			'.'
		], metadata).should.deep.equal([
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
		isCountrySupportedWithError('RU', metadata).should.equal(true)
		isCountrySupportedWithError('XX', metadata).should.equal(false)
	})

	it('should get supported countries', () => {
		getSupportedCountries(['RU', 'XX'], metadata).should.deep.equal(['RU'])
	})

	it('should get supported countries (none supported)', () => {
		expect(getSupportedCountries(['XX'], metadata)).to.be.undefined
	})
})