import {
	getPreSelectedCountry,
	getCountrySelectOptions,
	parsePhoneNumber,
	generateNationalNumberDigits,
	migrateParsedInputForNewCountry,
	e164,
	getCountryForPartialE164Number,
	parseInput,
	getInitialParsedInput,
	// Private functions
	get_country_from_possibly_incomplete_international_phone_number,
	compare_strings,
	strip_country_calling_code,
	getNationalSignificantNumberDigits,
	could_number_belong_to_country,
	trimNumber
} from './phoneInputHelpers'

import metadata from 'libphonenumber-js/metadata.min.json'

describe('phoneInputHelpers', () =>
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
		const defaultLabels =
		{
			'RU': 'Russia (Россия)',
			'US': 'United States',
			'ZZ': 'International'
		}

		// Without custom country names.
		getCountrySelectOptions(['US', 'RU'], defaultLabels, false).should.deep.equal
		([{
			value : 'RU',
			label : 'Russia (Россия)'
		}, {
			value : 'US',
			label : 'United States'
		}])

		// With custom country names.
		getCountrySelectOptions(['US', 'RU'], { ...defaultLabels, 'RU': 'Russia' }, false).should.deep.equal
		([{
			value : 'RU',
			label : 'Russia'
		}, {
			value : 'US',
			label : 'United States'
		}])

		// Should substitute missing country names with country codes.
		getCountrySelectOptions(['US', 'RU'], { ...defaultLabels, 'RU': undefined }, false).should.deep.equal
		([{
			value : 'RU',
			label : 'RU'
		}, {
			value : 'US',
			label : 'United States'
		}])

		// With "International" (without custom country names).
		getCountrySelectOptions(['US', 'RU'], defaultLabels, true).should.deep.equal
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
		getCountrySelectOptions(['US', 'RU'], { ...defaultLabels, 'RU': 'Russia', ZZ: 'Intl' }, true).should.deep.equal
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
		const phoneNumber = parsePhoneNumber('+78005553535', metadata)
		phoneNumber.country.should.equal('RU')
		phoneNumber.nationalNumber.should.equal('8005553535')

		// No `value` passed.
		expect(parsePhoneNumber(null, metadata)).to.equal.undefined
	})

	it('should generate national number digits', () =>
	{
		const phoneNumber = parsePhoneNumber('+33509758351', metadata)
		generateNationalNumberDigits(phoneNumber).should.equal('0509758351')
	})

	it('should migrate parsed input for new country', () =>
	{
		// No input. Returns `undefined`.
		migrateParsedInputForNewCountry('', 'RU', 'US', metadata, true).should.equal('')

		// Switching from "International" to a country
		// to which the phone number already belongs to.
		// No changes. Returns `undefined`.
		migrateParsedInputForNewCountry('+18005553535', null, 'US', metadata).should.equal('+18005553535')

		// Switching between countries. National number. No changes.
		migrateParsedInputForNewCountry('8005553535', 'RU', 'US', metadata).should.equal('8005553535')

		// Switching from "International" to a country. Calling code not matches. Resets parsed input.
		migrateParsedInputForNewCountry('+78005553535', null, 'US', metadata).should.equal('+1')

		// Switching from "International" to a country. Calling code matches. Doesn't reset parsed input.
		migrateParsedInputForNewCountry('+12223333333', null, 'US', metadata).should.equal('+12223333333')

		// Switching countries. International number. Calling code doesn't match.
		migrateParsedInputForNewCountry('+78005553535', 'RU', 'US', metadata).should.equal('+1')

		// Switching countries. International number. Calling code matches.
		migrateParsedInputForNewCountry('+18005553535', 'CA', 'US', metadata).should.equal('+18005553535')

		// Switching countries. International number.
		// Country calling code is longer than the amount of digits available.
		migrateParsedInputForNewCountry('+99', 'KG', 'US', metadata).should.equal('+1')

		// Switching countries. International number. No such country code.
		migrateParsedInputForNewCountry('+99', 'KG', 'US', metadata).should.equal('+1')

		// Switching to "International". National number.
		migrateParsedInputForNewCountry('8800555', 'RU', null, metadata).should.equal('+7800555')

		// Switching to "International". No national (significant) number digits entered.
		migrateParsedInputForNewCountry('8', 'RU', null, metadata).should.equal('')

		// Switching to "International". International number. No changes.
		migrateParsedInputForNewCountry('+78005553535', 'RU', null, metadata).should.equal('+78005553535')

		// Prefer national format. Country matches. Leaves the "national (significant) number".
		migrateParsedInputForNewCountry('+78005553535', null, 'RU', metadata, true).should.equal('8005553535')

		// Prefer national format. Country doesn't match, but country calling code does. Leaves the "national (significant) number".
		migrateParsedInputForNewCountry('+12133734253', null, 'CA', metadata, true).should.equal('2133734253')

		// Prefer national format. Country doesn't match, neither does country calling code. Clears the value.
		migrateParsedInputForNewCountry('+78005553535', null, 'US', metadata, true).should.equal('')

		// Force international format. `parsedInput` is empty. From no country to a country.
		migrateParsedInputForNewCountry(undefined, null, 'US', metadata, false).should.equal('+1')

		// Force international format. `parsedInput` is not empty. From a country to a country with the same calling code.
		migrateParsedInputForNewCountry('+1222', 'CA', 'US', metadata, false).should.equal('+1222')

		// Force international format. `parsedInput` is not empty. From a country to a country with another calling code.
		migrateParsedInputForNewCountry('+1222', 'CA', 'RU', metadata, false).should.equal('+7')

		// Force international format. `parsedInput` is not empty. From no country to a country.
		migrateParsedInputForNewCountry('+1222', null, 'US', metadata, false).should.equal('+1222')
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

		// National number. With country.
		e164('8800', 'RU', metadata).should.equal('+7800')
	})

	it('should trim the phone number if it exceeds the maximum length', () =>
	{
		// // No number.
		// expect(trimNumber()).to.be.undefined

		// Empty number.
		expect(trimNumber('', 'RU', metadata)).to.equal('')

		// // International number. Without country.
		// trimNumber('+780055535351').should.equal('+780055535351')

		// // National number. Without country.
		// trimNumber('880055535351', null).should.equal('880055535351')

		// National number. Doesn't exceed the maximum length.
		trimNumber('88005553535', 'RU', metadata).should.equal('88005553535')
		// National number. Exceeds the maximum length.
		trimNumber('880055535351', 'RU', metadata).should.equal('88005553535')

		// International number. Doesn't exceed the maximum length.
		trimNumber('+78005553535', 'RU', metadata).should.equal('+78005553535')
		// International number. Exceeds the maximum length.
		trimNumber('+780055535351', 'RU', metadata).should.equal('+78005553535')
	})

	it('should get country for partial E.164 number', () =>
	{
		// Just a '+' sign.
		getCountryForPartialE164Number('+', 'RU', ['US', 'RU'], true, metadata).should.equal('RU')
		expect(getCountryForPartialE164Number('+', undefined, ['US', 'RU'], true, metadata)).to.be.undefined

		// A country can be derived.
		getCountryForPartialE164Number('+78005553535', undefined, ['US', 'RU'], true, metadata).should.equal('RU')

		// A country can't be derived yet.
		// And the currently selected country doesn't fit the number.
		expect(getCountryForPartialE164Number('+7', 'FR', ['FR', 'RU'], true, metadata)).to.be.undefined
		expect(getCountryForPartialE164Number('+12', 'FR', ['FR', 'US'], true, metadata)).to.be.undefined

		// A country can't be derived yet.
		// And the currently selected country doesn't fit the number.
		// Bit "International" option is not available.
		getCountryForPartialE164Number('+7', 'FR', ['FR', 'RU'], false, metadata).should.equal('FR')
		getCountryForPartialE164Number('+12', 'FR', ['FR', 'US'], false, metadata).should.equal('FR')
	})

	it('should get country from possibly incomplete international phone number', () =>
	{
		// // `001` country calling code.
		// // Non-geographic numbering plan.
		// expect(get_country_from_possibly_incomplete_international_phone_number('+800', metadata)).to.be.undefined

		// Country can be derived.
		get_country_from_possibly_incomplete_international_phone_number('+33', metadata).should.equal('FR')

		// Country can't be derived yet.
		expect(get_country_from_possibly_incomplete_international_phone_number('+12', metadata)).to.be.undefined
	})

	it('should compare strings', () =>
	{
		compare_strings('aa', 'ab').should.equal(-1)
		compare_strings('aa', 'aa').should.equal(0)
		compare_strings('aac', 'aab').should.equal(1)
	})

	it('should strip country calling code from a number', () =>
	{
		// Number is longer than country calling code prefix.
		strip_country_calling_code('+7800', 'RU', metadata).should.equal('800')

		// Number is shorter than (or equal to) country calling code prefix.
		strip_country_calling_code('+3', 'FR', metadata).should.equal('')
		strip_country_calling_code('+7', 'FR', metadata).should.equal('')

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
		getNationalSignificantNumberDigits('+7800555', null, metadata).should.equal('800555')

		// International number.
		// No national (significant) number digits.
		expect(getNationalSignificantNumberDigits('+', null, metadata)).to.be.undefined
		expect(getNationalSignificantNumberDigits('+7', null, metadata)).to.be.undefined

		// National number.
		getNationalSignificantNumberDigits('8800555', 'RU', metadata).should.equal('800555')

		// National number.
		// No national (significant) number digits.
		expect(getNationalSignificantNumberDigits('8', 'RU', metadata)).to.be.undefined
		expect(getNationalSignificantNumberDigits('', 'RU', metadata)).to.be.undefined
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

	it('should parse input', () =>
	{
		parseInput(undefined, undefined, 'RU', undefined, undefined, true, false, false, metadata).should.deep.equal({
			input: undefined,
			country: 'RU',
			value: undefined
		})

		parseInput('', undefined, undefined, undefined, undefined, true, false, false, metadata).should.deep.equal({
			input: '',
			country: undefined,
			value: undefined
		})

		parseInput('+', undefined, undefined, undefined, undefined, true, false, false, metadata).should.deep.equal({
			input: '+',
			country: undefined,
			value: undefined
		})

		parseInput('1213', undefined, undefined, undefined, undefined, true, false, false, metadata).should.deep.equal({
			input: '+1213',
			country: undefined,
			value: '+1213'
		})

		parseInput('+1213', undefined, undefined, undefined, undefined, true, false, false, metadata).should.deep.equal({
			input: '+1213',
			country: undefined,
			value: '+1213'
		})

		parseInput('213', undefined, 'US', undefined, undefined, true, false, false, metadata).should.deep.equal({
			input: '213',
			country: 'US',
			value: '+1213'
		})

		parseInput('+78005553535', undefined, 'US', undefined, undefined, true, false, false, metadata).should.deep.equal({
			input: '+78005553535',
			country: 'RU',
			value: '+78005553535'
		})

		// Won't reset an already selected country.

		parseInput('+15555555555', undefined, 'US', undefined, undefined, true, false, false, metadata).should.deep.equal({
			input: '+15555555555',
			country: 'US',
			value: '+15555555555'
		})

		// `limitMaxLength`.

		parseInput('21337342530', undefined, 'US', undefined, undefined, true, false, true, metadata).should.deep.equal({
			input: '2133734253',
			country: 'US',
			value: '+12133734253'
		})

		parseInput('+121337342530', undefined, 'US', undefined, undefined, true, false, true, metadata).should.deep.equal({
			input: '+12133734253',
			country: 'US',
			value: '+12133734253'
		})

		// This case is intentionally ignored to simplify the code.
		parseInput('+121337342530', undefined, undefined, undefined, undefined, true, false, true, metadata).should.deep.equal({
			// input: '+12133734253',
			// country: 'US',
			// value: '+12133734253'
			input: '+121337342530',
			country: undefined,
			value: '+121337342530'
		})

		// Should reset the country if it has likely been automatically
		// selected based on international phone number input
		// and the user decides to erase all input.
		parseInput('', '+78005553535', 'RU', undefined, undefined, true, false, false, metadata).should.deep.equal({
			input: '',
			country: undefined,
			value: undefined
		})

		// Should reset the country if it has likely been automatically
		// selected based on international phone number input
		// and the user decides to erase all input.
		// Should reset to default country.
		parseInput('', '+78005553535', 'RU', 'US', undefined, true, false, false, metadata).should.deep.equal({
			input: '',
			country: 'US',
			value: undefined
		})

		// Shouldn't set `country` to `defaultCountry`
		// when erasing parsed input starting with a `+`
		// when `international` is `true`.
		parseInput('', '+78005553535', 'RU', 'US', undefined, true, true, false, metadata).should.deep.equal({
			input: '',
			country: undefined,
			value: undefined
		})

		// Should reset the country if it has likely been automatically
		// selected based on international phone number input
		// and the user decides to erase all input up to the `+` sign.
		parseInput('+', '+78005553535', 'RU', undefined, undefined, true, false, false, metadata).should.deep.equal({
			input: '+',
			country: undefined,
			value: undefined
		})

		// Should support forcing international phone number input format.
		parseInput('2', '+78005553535', 'RU', undefined, undefined, true, true, false, metadata).should.deep.equal({
			input: '+2',
			country: undefined,
			value: '+2'
		})
	})

	it('should get initial parsed input', () => {
		getInitialParsedInput('+78005553535', 'RU', false, metadata).should.equal('+78005553535')
		getInitialParsedInput('+78005553535', 'RU', true, metadata).should.equal('+78005553535')
		getInitialParsedInput(undefined, 'RU', true, metadata).should.equal('+7')
		expect(getInitialParsedInput(undefined, 'RU', false, metadata)).to.be.undefined
		expect(getInitialParsedInput(undefined, undefined, false, metadata)).to.be.undefined
	})
})