import
{
	getPreSelectedCountry,
	getCountrySelectOptions,
	parsePhoneNumber,
	generateNationalNumberDigits,
	migrateParsedInputForNewCountry,
	e164,
	getCountryForParsedInput,

	// Private functions
	get_country_from_possibly_incomplete_international_phone_number,
	compare_strings,
	has_international_option,
	strip_country_calling_code,
	get_national_significant_number_part,
	could_number_belong_to_country
}
from './input-control'

import { countries } from './countries'

import metadata from 'libphonenumber-js/metadata.min'

describe('input-control', () =>
{
	it('should get pre-selected country', () =>
	{
		// Can't return "International". Return the first country available.
		getPreSelectedCountry({}, null, ['US', 'RU'], false, metadata).should.equal('US')

		// Can return "International".
		// Country can't be derived from the phone number.
		expect(getPreSelectedCountry({}, undefined, ['US', 'RU'], true, metadata)).to.be.undefined

		// Derive country from the phone number.
		getPreSelectedCountry({ country: 'RU', phone: '8005553535' }, null, ['US', 'RU'], false, metadata).should.equal('RU')

		// Country derived from the phone number overrides the supplied one.
		getPreSelectedCountry({ country: 'RU', phone: '8005553535' }, 'US', ['US', 'RU'], false, metadata).should.equal('RU')

		// Only pre-select a country if it's in the available `countries` list.
		getPreSelectedCountry({ country: 'RU', phone: '8005553535' }, null, ['US', 'DE'], false, metadata).should.equal('US')
		expect(getPreSelectedCountry({ country: 'RU', phone: '8005553535' }, 'US', ['US', 'DE'], true, metadata)).to.be.undefined
	})

	it('should generate country select options', () =>
	{
		// Without custom country names.
		getCountrySelectOptions(['US', 'RU'], null, false).should.deep.equal
		([{
			value : 'RU',
			label : 'Russia (Россия)'
		}, {
			value : 'US',
			label : 'United States'
		}])

		// With custom country names.
		getCountrySelectOptions(['US', 'RU'], { 'RU': 'Russia' }, false).should.deep.equal
		([{
			value : 'RU',
			label : 'Russia'
		}, {
			value : 'US',
			label : 'United States'
		}])

		// With "International" (without custom country names).
		getCountrySelectOptions(['US', 'RU'], null, true).should.deep.equal
		([{
			label : 'International'
		}, {
			value : 'RU',
			label : 'Russia (Россия)'
		}, {
			value : 'US',
			label : 'United States'
		}])

		// With "International" (with custom country names).
		getCountrySelectOptions(['US', 'RU'], { 'RU': 'Russia', ZZ: 'Intl' }, true).should.deep.equal
		([{
			label : 'Intl'
		}, {
			value : 'RU',
			label : 'Russia'
		}, {
			value : 'US',
			label : 'United States'
		}])
	})

	it('should parse phone numbers', () =>
	{
		parsePhoneNumber('+78005553535', metadata).should.deep.equal
		({
			country : 'RU',
			phone   : '8005553535'
		})

		// No `value` passed.
		parsePhoneNumber(null, metadata).should.deep.equal({})
	})

	it('should generate national number digits', () =>
	{
		generateNationalNumberDigits
		({
			country : 'FR',
			phone   : '509758351'
		},
		metadata)
		.should.equal('0509758351')
	})

	it('should migrate parsed input for new country', () =>
	{
		// No input. Returns `undefined`.
		migrateParsedInputForNewCountry('', 'RU', 'US', metadata).should.equal('')

		// Switching from "International" to a country
		// to which the phone number already belongs to.
		// No changes. Returns `undefined`.
		migrateParsedInputForNewCountry('+18005553535', null, 'US', metadata).should.equal('+18005553535')

		// Switching between countries. National number. No changes.
		migrateParsedInputForNewCountry('8005553535', 'RU', 'US', metadata).should.equal('8005553535')

		// Switching from "International" to a country.
		migrateParsedInputForNewCountry('+78005553535', null, 'US', metadata).should.equal('+18005553535')

		// Switching countries. International number.
		migrateParsedInputForNewCountry('+78005553535', 'RU', 'US', metadata).should.equal('+18005553535')

		// Switching countries. International number.
		// Country calling code is longer than the amount of digits available.
		migrateParsedInputForNewCountry('+99', 'KG', 'US', metadata).should.equal('+1')

		// Switching countries. International number. No such country code.
		migrateParsedInputForNewCountry('+99', 'KG', 'US', metadata).should.equal('+1')

		// Switching to "International". National number.
		migrateParsedInputForNewCountry('8800555', 'RU', null, metadata).should.equal('+7800555')

		// Switching to "International". International number. No changes.
		migrateParsedInputForNewCountry('+78005553535', 'RU', null, metadata).should.equal('+78005553535')
	})

	it('should format phone number in e164', () =>
	{
		// No number.
		expect(e164()).to.be.undefined

		// International number. Just a '+' sign.
		expect(e164('+')).to.be.undefined

		// International number.
		e164('+7800').should.equal('+7800')

		// National number. Without country.
		expect(e164('8800', null)).to.be.undefined

		// National number. With country. Just national prefix.
		expect(e164('8', 'RU', metadata)).to.be.undefined

		// National number. With country. Just national prefix.
		e164('8800', 'RU', metadata).should.equal('+7800')
	})

	it('should get country for parsed input', () =>
	{
		// Just a '+' sign.
		getCountryForParsedInput('+', 'RU', ['US', 'RU'], true, metadata).should.equal('RU')
		expect(getCountryForParsedInput('+', undefined, ['US', 'RU'], true, metadata)).to.be.undefined

		// A country can be derived.
		getCountryForParsedInput('+78005553535', undefined, ['US', 'RU'], true, metadata).should.equal('RU')

		// A country can't be derived yet.
		// And the currently selected country doesn't fit the number.
		expect(getCountryForParsedInput('+7', 'FR', ['FR', 'RU'], true, metadata)).to.be.undefined
		expect(getCountryForParsedInput('+7800', 'FR', ['FR', 'RU'], true, metadata)).to.be.undefined

		// A country can't be derived yet.
		// And the currently selected country doesn't fit the number.
		// Bit "International" option is not available.
		getCountryForParsedInput('+7', 'FR', ['FR', 'RU'], false, metadata).should.equal('FR')
		getCountryForParsedInput('+7800', 'FR', ['FR', 'RU'], false, metadata).should.equal('FR')
	})

	it('should get country from possibly incomplete international phone number', () =>
	{
		// `001` country calling code.
		expect(get_country_from_possibly_incomplete_international_phone_number('+800', metadata)).to.be.undefined

		// Country can be derived.
		get_country_from_possibly_incomplete_international_phone_number('+33', metadata).should.equal('FR')

		// Country can't be derived yet.
		expect(get_country_from_possibly_incomplete_international_phone_number('+7800', metadata)).to.be.undefined
	})

	it('should compare strings', () =>
	{
		compare_strings('aa', 'ab').should.equal(-1)
		compare_strings('aa', 'aa').should.equal(0)
		compare_strings('aac', 'aab').should.equal(1)
	})

	it('should determine whether to show "International" option', () =>
	{
		has_international_option(['US', 'RU'], false).should.equal(false)
		has_international_option(['US', 'RU'], true).should.equal(true)
		has_international_option(['US', 'RU']).should.equal(false)
		has_international_option(countries).should.equal(true)
	})

	it('should strip country calling code from a number', () =>
	{
		// Number is longer than country calling code prefix.
		strip_country_calling_code('+7800', 'RU', metadata).should.equal('800')

		// Number is shorter than (or equal to) country calling code prefix.
		strip_country_calling_code('+3', 'FR', metadata).should.equal('')

		// `country` doesn't fit the actual `number`.
		// Iterates through all available country calling codes.
		strip_country_calling_code('+7800', 'FR', metadata).should.equal('800')

		// No `country`.
		// And the calling code doesn't belong to any country.
		strip_country_calling_code('+999', null, metadata).should.equal('')
	})

	it('should get national significant number part', () =>
	{
		// International number.
		get_national_significant_number_part('+7800555', null, metadata).should.equal('800555')

		// National number.
		get_national_significant_number_part('8800555', 'RU', metadata).should.equal('800555')
	})

	it('should determine of a number could belong to a country', () =>
	{
		// Matching.
		could_number_belong_to_country('+7800', 'RU', metadata).should.equal(true)

		// First digit already not matching.
		could_number_belong_to_country('+7800', 'FR', metadata).should.equal(false)

		// First digit matching, second - not matching.
		could_number_belong_to_country('+33', 'AM', metadata).should.equal(false)

		// Number is shorter than country calling code.
		could_number_belong_to_country('+99', 'KG', metadata).should.equal(true)
	})
})