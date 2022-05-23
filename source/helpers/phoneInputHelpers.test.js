import {
	getPreSelectedCountry,
	getCountrySelectOptions,
	parsePhoneNumber,
	generateNationalNumberDigits,
	getPhoneDigitsForNewCountry,
	e164,
	getCountryForPartialE164Number,
	onPhoneDigitsChange,
	getInitialPhoneDigits,
	// Private functions
	getCountryFromPossiblyIncompleteInternationalPhoneNumber,
	compareStrings,
	stripCountryCallingCode,
	getNationalSignificantNumberDigits,
	couldNumberBelongToCountry,
	trimNumber
} from './phoneInputHelpers.js'

import metadata from 'libphonenumber-js/min/metadata'

describe('phoneInputHelpers', () => {
	it('should get pre-selected country', () => {
		// Can't return "International". Return the first country available.
		getPreSelectedCountry({
			value: '+11111111111',
			phoneNumber: {},
			countries: ['US', 'RU'],
			getAnyCountry: () => 'US',
			required: true,
			metadata
		}).should.equal('US')

		// Can return "International".
		// Country can't be derived from the phone number.
		// https://github.com/catamphetamine/react-phone-number-input/issues/378
		expect(getPreSelectedCountry({
			value: '+11111111111',
			phoneNumber: {},
			countries: ['US', 'RU'],
			getAnyCountry: () => 'US',
			required: false,
			metadata
		})).to.be.undefined

		// Can return "International".
		// Country can't be derived from the phone number.
		// Has `defaultCountry`.
		// Has `value`.
		// https://github.com/catamphetamine/react-phone-number-input/issues/378
		expect(getPreSelectedCountry({
			value: '+11111111111',
			phoneNumber: {},
			defaultCountry: 'RU',
			countries: ['RU', 'FR'],
			required: false,
			metadata
		})).to.be.undefined

		// Can return "International".
		// Country can be derived from the phone number.
		// Has `defaultCountry`.
		// Has a valid partial `value`.
		// https://github.com/catamphetamine/react-phone-number-input/issues/378
		expect(getPreSelectedCountry({
			value: '+7800',
			defaultCountry: 'RU',
			countries: ['RU', 'FR'],
			required: false,
			metadata
		})).to.equal('RU')

		// Derive country from the phone number.
		getPreSelectedCountry({
			value: '+78005553535',
			phoneNumber: { country: 'RU', phone: '8005553535' },
			countries: ['US', 'RU'],
			getAnyCountry: () => 'US',
			required: true,
			metadata
		}).should.equal('RU')

		// Country derived from the phone number overrides the supplied one.
		getPreSelectedCountry({
			value: '+78005553535',
			phoneNumber: { country: 'RU', phone: '8005553535' },
			defaultCountry: 'US',
			countries: ['US', 'RU'],
			required: true,
			metadata
		}).should.equal('RU')

		// Only pre-select a country if it's in the available `countries` list.
		getPreSelectedCountry({
			value: '+78005553535',
			phoneNumber: { country: 'RU', phone: '8005553535' },
			countries: ['US', 'DE'],
			getAnyCountry: () => 'US',
			required: true,
			metadata
		}).should.equal('US')

		expect(getPreSelectedCountry({
			value: '+78005553535',
			phoneNumber: { country: 'RU', phone: '8005553535' },
			defaultCountry: 'US',
			countries: ['US', 'DE'],
			required: false,
			metadata
		})).to.be.undefined
	})

	it('should generate country select options', () => {
		const defaultLabels = {
			'RU': 'Russia (Россия)',
			'US': 'United States',
			'ZZ': 'International'
		}

		// Without custom country names.
		getCountrySelectOptions({
			countries: ['US', 'RU'],
			countryNames: defaultLabels
		}).should.deep.equal([{
			value: 'RU',
			label: 'Russia (Россия)'
		}, {
			value: 'US',
			label: 'United States'
		}])

		// With custom country names.
		getCountrySelectOptions({
			countries: ['US', 'RU'],
			countryNames: { ...defaultLabels, 'RU': 'Russia' }
		}).should.deep.equal([{
			value: 'RU',
			label: 'Russia'
		}, {
			value: 'US',
			label: 'United States'
		}])

		// Should substitute missing country names with country codes.
		getCountrySelectOptions({
			countries: ['US', 'RU'],
			countryNames: { ...defaultLabels, 'RU': undefined }
		}).should.deep.equal([{
			value: 'RU',
			label: 'RU'
		}, {
			value: 'US',
			label: 'United States'
		}])

		// With "International" (without custom country names).
		getCountrySelectOptions({
			countries: ['US', 'RU'],
			countryNames: defaultLabels,
			addInternationalOption: true
		}).should.deep.equal([{
			label: 'International'
		}, {
			value: 'RU',
			label: 'Russia (Россия)'
		}, {
			value: 'US',
			label: 'United States'
		}])

		// With "International" (with custom country names).
		getCountrySelectOptions({
			countries: ['US', 'RU'],
			countryNames: { ...defaultLabels, 'RU': 'Russia', ZZ: 'Intl' },
			addInternationalOption: true
		}).should.deep.equal([{
			label: 'Intl'
		}, {
			value: 'RU',
			label: 'Russia'
		}, {
			value: 'US',
			label: 'United States'
		}])
	})

	it('should generate country select options (custom `compareStrings`)', () => {
		const defaultLabels = {
			'RU': 'Russia (Россия)',
			'US': 'United States',
			'ZZ': 'International'
		}

		// Without custom country names.
		getCountrySelectOptions({
			countries: ['US', 'RU'],
			countryNames: defaultLabels,
			// Reverse order.
			compareStrings: (a, b) => a < b ? 1 : (a > b ? -1 : 0)
		}).should.deep.equal([{
			value: 'US',
			label: 'United States'
		}, {
			value: 'RU',
			label: 'Russia (Россия)'
		}])
	})

	// it('should generate country select options (Chinese locale)', () => {
	// 	// https://gitlab.com/catamphetamine/react-phone-number-input/-/issues/20
	//
	// 	const defaultLabels = {
	// 		'RU': 'Russia (Россия)',
	// 		'US': 'United States',
	// 		'ZZ': 'International'
	// 	}
	//
	// 	// Without custom country names.
	// 	getCountrySelectOptions({
	// 		countries: ['US', 'RU'],
	// 		countryNames: defaultLabels,
	// 		compareStringsLocales: 'zh-CN-u-co-pinyin'
	// 	}).should.deep.equal([{
	// 		value: 'US',
	// 		label: 'United States'
	// 	}, {
	// 		value: 'RU',
	// 		label: 'Russia (Россия)'
	// 	}])
	// })

	it('should parse phone numbers', () => {
		const phoneNumber = parsePhoneNumber('+78005553535', metadata)
		phoneNumber.country.should.equal('RU')
		phoneNumber.nationalNumber.should.equal('8005553535')

		// No `value` passed.
		expect(parsePhoneNumber(null, metadata)).to.be.undefined
	})

	it('should generate national number digits', () => {
		const phoneNumber = parsePhoneNumber('+33509758351', metadata)
		generateNationalNumberDigits(phoneNumber).should.equal('0509758351')
	})

	it('should migrate parsed input for new country', () => {
		// Country didn't change. Return the same digits.
		getPhoneDigitsForNewCountry('', {
			prevCountry: 'US',
			newCountry: 'US',
			metadata,
			useNationalFormat: true
		}).should.equal('')

		// Country didn't change. Return the same digits.
		getPhoneDigitsForNewCountry('123', {
			prevCountry: 'US',
			newCountry: 'US',
			metadata,
			useNationalFormat: true
		}).should.equal('123')

		// Country didn't change. Return the same digits.
		getPhoneDigitsForNewCountry('+123', {
			prevCountry: 'US',
			newCountry: 'US',
			metadata
		}).should.equal('+123')

		// No input. Returns `undefined`.
		getPhoneDigitsForNewCountry('', {
			prevCountry: 'RU',
			newCountry: 'US',
			metadata,
			useNationalFormat: true
		}).should.equal('')

		// Switching from "International" to a country
		// to which the phone number already belongs to.
		// No changes. Returns `undefined`.
		getPhoneDigitsForNewCountry('+18005553535', {
			newCountry: 'US',
			metadata
		}).should.equal('+18005553535')

		// Switching between countries. National number. No changes.
		getPhoneDigitsForNewCountry('8005553535', {
			prevCountry: 'RU',
			newCountry: 'US',
			metadata
		}).should.equal('8005553535')

		// Switching from "International" to a country. Calling code not matches. Resets parsed input.
		getPhoneDigitsForNewCountry('+78005553535', {
			newCountry: 'US',
			metadata
		}).should.equal('+1')

		// Switching from "International" to a country. Calling code matches. Doesn't reset parsed input.
		getPhoneDigitsForNewCountry('+12223333333', {
			newCountry: 'US',
			metadata
		}).should.equal('+12223333333')

		// Switching countries. International number. Calling code doesn't match.
		getPhoneDigitsForNewCountry('+78005553535', {
			prevCountry: 'RU',
			newCountry: 'US',
			metadata
		}).should.equal('+1')

		// Switching countries. International number. Calling code matches.
		getPhoneDigitsForNewCountry('+18005553535', {
			prevCountry: 'CA',
			newCountry: 'US',
			metadata
		}).should.equal('+18005553535')

		// Switching countries. International number.
		// Country calling code is longer than the amount of digits available.
		getPhoneDigitsForNewCountry('+99', {
			prevCountry: 'KG',
			newCountry: 'US',
			metadata
		}).should.equal('+1')

		// Switching countries. International number. No such country code.
		getPhoneDigitsForNewCountry('+99', {
			prevCountry: 'KG',
			newCountry: 'US',
			metadata
		}).should.equal('+1')

		// Switching to "International". National number.
		getPhoneDigitsForNewCountry('8800555', {
			prevCountry: 'RU',
			metadata
		}).should.equal('+7800555')

		// Switching to "International". No national (significant) number digits entered.
		getPhoneDigitsForNewCountry('8', {
			prevCountry: 'RU',
			metadata
		// }).should.equal('')
		}).should.equal('+7')

		// Switching to "International". International number. No changes.
		getPhoneDigitsForNewCountry('+78005553535', {
			prevCountry: 'RU',
			metadata
		}).should.equal('+78005553535')

		// Prefer national format. Country matches. Leaves the "national (significant) number".
		getPhoneDigitsForNewCountry('+78005553535', {
			newCountry: 'RU',
			metadata,
			useNationalFormat: true
		}).should.equal('8005553535')

		// Prefer national format. Country doesn't match, but country calling code does. Leaves the "national (significant) number".
		getPhoneDigitsForNewCountry('+12133734253', {
			newCountry: 'CA',
			metadata,
			useNationalFormat: true
		}).should.equal('2133734253')

		// Prefer national format. Country doesn't match, neither does country calling code. Clears the value.
		getPhoneDigitsForNewCountry('+78005553535', {
			newCountry: 'US',
			metadata,
			useNationalFormat: true
		}).should.equal('')

		// Force international format. `phoneDigits` is empty. From no country to a country.
		getPhoneDigitsForNewCountry(null, {
			newCountry: 'US',
			metadata,
			useNationalFormat: false
		}).should.equal('+1')

		// Force international format. `phoneDigits` is not empty. From a country to a country with the same calling code.
		getPhoneDigitsForNewCountry('+1222', {
			prevCountry: 'CA',
			newCountry: 'US',
			metadata
		}).should.equal('+1222')

		// Force international format. `phoneDigits` is not empty. From a country to a country with another calling code.
		getPhoneDigitsForNewCountry('+1222', {
			prevCountry: 'CA',
			newCountry: 'RU',
			metadata
		}).should.equal('+7')

		// Force international format. `phoneDigits` is not empty. From no country to a country.
		getPhoneDigitsForNewCountry('+1222', {
			newCountry: 'US',
			metadata
		}).should.equal('+1222')
	})

	it('should format phone number in e164', () =>
	{
		// No number.
		expect(e164()).to.be.undefined

		// International number. Just a '+' sign.
		expect(e164('+')).to.be.undefined

		// International number.
		e164('+7800', null, metadata).should.equal('+7800')

		// National number. Without country.
		expect(e164('8800', null, metadata)).to.be.undefined

		// National number. With country. Just national prefix.
		// expect(e164('8', 'RU', metadata)).to.be.undefined
		e164('8', 'RU', metadata).should.equal('+7')

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
		trimNumber('2135553535', 'US', metadata).should.equal('2135553535')
		// National number. Exceeds the maximum length.
		trimNumber('21355535351', 'US', metadata).should.equal('2135553535')

		// International number. Doesn't exceed the maximum length.
		trimNumber('+12135553535', 'US', metadata).should.equal('+12135553535')
		// International number. Exceeds the maximum length.
		trimNumber('+121355535351', 'US', metadata).should.equal('+12135553535')
	})

	it('should get country for partial E.164 number', () =>
	{
		// Just a '+' sign.
		getCountryForPartialE164Number('+', {
			country: 'RU',
			countries: ['US', 'RU'],
			metadata
		}).should.equal('RU')

		expect(getCountryForPartialE164Number('+', {
			countries: ['US', 'RU'],
			metadata
		})).to.be.undefined

		// A country can be derived.
		getCountryForPartialE164Number('+78005553535', {
			countries: ['US', 'RU'],
			metadata
		}).should.equal('RU')

		// A country can't be derived yet.
		// And the currently selected country doesn't fit the number.
		expect(getCountryForPartialE164Number('+7', {
			country: 'FR',
			countries: ['FR', 'RU'],
			metadata
		})).to.be.undefined

		expect(getCountryForPartialE164Number('+12', {
			country: 'FR',
			countries: ['FR', 'US'],
			metadata
		})).to.be.undefined

		// A country can't be derived yet.
		// And the currently selected country doesn't fit the number.
		// Bit "International" option is not available.
		getCountryForPartialE164Number('+7', {
			country: 'FR',
			countries: ['FR', 'RU'],
			required: true,
			metadata
		}).should.equal('FR')

		getCountryForPartialE164Number('+12', {
			country: 'FR',
			countries: ['FR', 'US'],
			required: true,
			metadata
		}).should.equal('FR')
	})

	it('should get country from possibly incomplete international phone number', () =>
	{
		// // `001` country calling code.
		// // Non-geographic numbering plan.
		// expect(getCountryFromPossiblyIncompleteInternationalPhoneNumber('+800', metadata)).to.be.undefined

		// Country can be derived.
		getCountryFromPossiblyIncompleteInternationalPhoneNumber('+33', metadata).should.equal('FR')

		// Country can't be derived yet.
		expect(getCountryFromPossiblyIncompleteInternationalPhoneNumber('+12', metadata)).to.be.undefined
	})

	it('should compare strings', () =>
	{
		compareStrings('aa', 'ab').should.equal(-1)
		compareStrings('aa', 'aa').should.equal(0)
		compareStrings('aac', 'aab').should.equal(1)
	})

	it('should strip country calling code from a number', () =>
	{
		// Number is longer than country calling code prefix.
		stripCountryCallingCode('+7800', 'RU', metadata).should.equal('800')

		// Number is shorter than (or equal to) country calling code prefix.
		stripCountryCallingCode('+3', 'FR', metadata).should.equal('')
		stripCountryCallingCode('+7', 'FR', metadata).should.equal('')

		// `country` doesn't fit the actual `number`.
		// Iterates through all available country calling codes.
		stripCountryCallingCode('+7800', 'FR', metadata).should.equal('800')

		// No `country`.
		// And the calling code doesn't belong to any country.
		stripCountryCallingCode('+999', null, metadata).should.equal('')
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
		couldNumberBelongToCountry('+7800', 'RU', metadata).should.equal(true)

		// First digit already not matching.
		couldNumberBelongToCountry('+7800', 'FR', metadata).should.equal(false)

		// First digit matching, second - not matching.
		couldNumberBelongToCountry('+33', 'AM', metadata).should.equal(false)

		// Number is shorter than country calling code.
		couldNumberBelongToCountry('+99', 'KG', metadata).should.equal(true)
	})

	it('should handle phone digits change (should choose new "value" based on phone digits)', () => {
		onPhoneDigitsChange('+', {
			metadata
		}).should.deep.equal({
			phoneDigits: '+',
			country: undefined,
			value: undefined
		})

		onPhoneDigitsChange('+', {
			metadata,
			countryRequired: true,
			getAnyCountry: () => 'US'
		}).should.deep.equal({
			phoneDigits: '+',
			country: 'US',
			value: undefined
		})

		onPhoneDigitsChange('+7', {
			metadata
		}).should.deep.equal({
			phoneDigits: '+7',
			country: undefined,
			value: '+7'
		})

		onPhoneDigitsChange('+7', {
			metadata,
			country: 'RU'
		}).should.deep.equal({
			phoneDigits: '+7',
			country: 'RU',
			value: undefined
		})

		onPhoneDigitsChange('+78', {
			metadata,
			country: 'RU'
		}).should.deep.equal({
			phoneDigits: '+78',
			country: 'RU',
			value: '+78'
		})
	})

	it('should handle phone digits change', () => {
		onPhoneDigitsChange(undefined, {
			country: 'RU',
			metadata
		}).should.deep.equal({
			phoneDigits: undefined,
			country: 'RU',
			value: undefined
		})

		onPhoneDigitsChange('', {
			metadata
		}).should.deep.equal({
			phoneDigits: '',
			country: undefined,
			value: undefined
		})

		onPhoneDigitsChange('1213', {
			metadata
		}).should.deep.equal({
			phoneDigits: '+1213',
			country: undefined,
			value: '+1213'
		})

		onPhoneDigitsChange('+1213', {
			metadata
		}).should.deep.equal({
			phoneDigits: '+1213',
			country: undefined,
			value: '+1213'
		})

		onPhoneDigitsChange('213', {
			country: 'US',
			metadata
		}).should.deep.equal({
			phoneDigits: '213',
			country: 'US',
			value: '+1213'
		})

		onPhoneDigitsChange('+78005553535', {
			country: 'US',
			metadata
		}).should.deep.equal({
			phoneDigits: '+78005553535',
			country: 'RU',
			value: '+78005553535'
		})

		// Won't reset an already selected country.

		onPhoneDigitsChange('+15555555555', {
			country: 'US',
			metadata
		}).should.deep.equal({
			phoneDigits: '+15555555555',
			country: 'US',
			value: '+15555555555'
		})

		// Should reset the country if it has likely been automatically
		// selected based on international phone number input
		// and the user decides to erase all input.
		onPhoneDigitsChange('', {
			prevPhoneDigits: '+78005553535',
			country: 'RU',
			metadata
		}).should.deep.equal({
			phoneDigits: '',
			country: undefined,
			value: undefined
		})

		// Should reset the country if it has likely been automatically
		// selected based on international phone number input
		// and the user decides to erase all input.
		// Should reset to default country.
		onPhoneDigitsChange('', {
			prevPhoneDigits: '+78005553535',
			country: 'RU',
			defaultCountry: 'US',
			metadata
		}).should.deep.equal({
			phoneDigits: '',
			country: 'US',
			value: undefined
		})

		// Should reset the country if it has likely been automatically
		// selected based on international phone number input
		// and the user decides to erase all input up to the `+` sign.
		onPhoneDigitsChange('+', {
			prevPhoneDigits: '+78005553535',
			country: 'RU',
			metadata
		}).should.deep.equal({
			phoneDigits: '+',
			country: undefined,
			value: undefined
		})
	})

	it('should handle phone digits change (limitMaxLength: true)', () => {
		onPhoneDigitsChange('21337342530',{
			country: 'US',
			limitMaxLength: true,
			metadata
		}).should.deep.equal({
			phoneDigits: '2133734253',
			country: 'US',
			value: '+12133734253'
		})

		onPhoneDigitsChange('+121337342530', {
			country: 'US',
			limitMaxLength: true,
			metadata
		}).should.deep.equal({
			phoneDigits: '+12133734253',
			country: 'US',
			value: '+12133734253'
		})

		// This case is intentionally ignored to simplify the code.
		onPhoneDigitsChange('+121337342530', {
			limitMaxLength: true,
			metadata
		}).should.deep.equal({
			// phoneDigits: '+12133734253',
			// country: 'US',
			// value: '+12133734253'
			phoneDigits: '+121337342530',
			country: undefined,
			value: '+121337342530'
		})
	})

	it('should handle phone digits change (`international: true`)', () => {
		// Shouldn't set `country` to `defaultCountry`
		// when erasing parsed input starting with a `+`
		// when `international` is `true`.
		onPhoneDigitsChange('', {
			prevPhoneDigits: '+78005553535',
			country: 'RU',
			defaultCountry: 'US',
			international: true,
			metadata
		}).should.deep.equal({
			phoneDigits: '',
			country: undefined,
			value: undefined
		})

		// Should support forcing international phone number input format.
		onPhoneDigitsChange('2', {
			prevPhoneDigits: '+78005553535',
			country: 'RU',
			international: true,
			metadata
		}).should.deep.equal({
			phoneDigits: '+2',
			country: undefined,
			value: '+2'
		})
	})

	it('should handle phone digits change (`international: true` and `countryCallingCodeEditable: false`) (reset incompatible international input)', () => {
		onPhoneDigitsChange('+1', {
			prevPhoneDigits: '+78005553535',
			country: 'RU',
			international: true,
			countryCallingCodeEditable: false,
			metadata
		}).should.deep.equal({
			phoneDigits: '+7',
			country: 'RU',
			value: undefined
		})
	})

	it('should handle phone digits change (`international: true` and `countryCallingCodeEditable: false`) (append national input)', () => {
		onPhoneDigitsChange('8', {
			prevPhoneDigits: '+78005553535',
			country: 'RU',
			international: true,
			countryCallingCodeEditable: false,
			metadata
		}).should.deep.equal({
			phoneDigits: '+78',
			country: 'RU',
			value: '+78'
		})
	})

	it('should handle phone digits change (`international: true` and `countryCallingCodeEditable: false`) (compatible input)', () => {
		onPhoneDigitsChange('+7', {
			prevPhoneDigits: '+78005553535',
			country: 'RU',
			international: true,
			countryCallingCodeEditable: false,
			metadata
		}).should.deep.equal({
			phoneDigits: '+7',
			country: 'RU',
			value: undefined
		})
	})

	it('should handle phone digits change (`international: false`)', () => {
		const onChange = (phoneDigits, prevPhoneDigits, country) => onPhoneDigitsChange(phoneDigits, {
			prevPhoneDigits,
			country,
			international: false,
			metadata
		})

		// `phoneDigits` in international format.
		// Just country calling code.
		onChange('+7', '', 'RU').should.deep.equal({
			phoneDigits: '',
			country: 'RU',
			value: undefined
		})

		// `phoneDigits` in international format.
		// Country calling code and first digit.
		// (which is assumed a "national prefix").
		onChange('+78', '', 'RU').should.deep.equal({
			phoneDigits: '8',
			country: 'RU',
			// value: undefined
			value: '+7'
		})

		// `phoneDigits` in international format.
		// Country calling code and first two digits.
		onChange('+121', '', 'US').should.deep.equal({
			phoneDigits: '21',
			country: 'US',
			value: '+121'
		})

		// `phoneDigits` in international format.
		onChange('+78005553535', '', 'RU').should.deep.equal({
			phoneDigits: '88005553535',
			country: 'RU',
			value: '+78005553535'
		})

		// `phoneDigits` in international format.
		// Another country: just trims the `+`.
		onChange('+78005553535', '', 'US').should.deep.equal({
			phoneDigits: '78005553535',
			country: 'US',
			value: '+178005553535'
		})

		// `phoneDigits` in national format.
		onChange('88005553535', '', 'RU').should.deep.equal({
			phoneDigits: '88005553535',
			country: 'RU',
			value: '+78005553535'
		})

		// `phoneDigits` in national format.
		onChange('88005553535', '8800555353', 'RU').should.deep.equal({
			phoneDigits: '88005553535',
			country: 'RU',
			value: '+78005553535'
		})

		// Empty `phoneDigits`.
		onChange('', '88005553535', 'RU').should.deep.equal({
			phoneDigits: '',
			country: 'RU',
			value: undefined
		})
	})

	it('should handle phone digits change (`international: false` and no country selected)', () => {
		// If `international` is `false` then it means that
		// "International" option should not be available,
		// so it doesn't handle the cases when it is available.

		const onChange = (phoneDigits) => onPhoneDigitsChange(phoneDigits, {
			prevPhoneDigits: '',
			international: false,
			metadata
		})

		// `phoneDigits` in international format.
		// No country calling code.
		onChange('+').should.deep.equal({
			phoneDigits: '+',
			country: undefined,
			value: undefined
		})

		// `phoneDigits` in international format.
		// Just country calling code.
		onChange('+7').should.deep.equal({
			phoneDigits: '+7',
			country: undefined,
			value: '+7'
		})

		// `phoneDigits` in international format.
		// Country calling code and first digit.
		// (which is assumed a "national prefix").
		onChange('+78').should.deep.equal({
			phoneDigits: '8',
			country: 'RU',
			// value: undefined
			value: '+7'
		})

		// `phoneDigits` in international format.
		// Country calling code and first two digits.
		onChange('+3311').should.deep.equal({
			phoneDigits: '11',
			country: 'FR',
			value: '+3311'
		})

		// `phoneDigits` in international format.
		// Full number.
		onChange('+78005553535').should.deep.equal({
			phoneDigits: '88005553535',
			country: 'RU',
			value: '+78005553535'
		})
	})

	it('should get initial parsed input', () => {
		getInitialPhoneDigits({
			value: '+78005553535',
			defaultCountry: 'RU',
			international: false,
			metadata
		}).should.equal('+78005553535')

		getInitialPhoneDigits({
			value: '+78005553535',
			defaultCountry: 'RU',
			international: true,
			metadata
		}).should.equal('+78005553535')

		getInitialPhoneDigits({
			value: undefined,
			defaultCountry: 'RU',
			international: true,
			metadata
		}).should.equal('+7')

		expect(getInitialPhoneDigits({
			value: undefined,
			defaultCountry: 'RU',
			international: false,
			metadata
		})).to.be.undefined

		expect(getInitialPhoneDigits({
			value: undefined,
			international: false,
			metadata
		})).to.be.undefined
	})

	it('should get initial parsed input (has `phoneNumber` that has `country`)', () => {
		const phoneNumber = parsePhoneNumber('+78005553535', metadata)
		getInitialPhoneDigits({
			value: phoneNumber.number,
			defaultCountry: 'RU',
			useNationalFormat: true,
			phoneNumber,
			metadata
		}).should.equal('88005553535')
	})

	it('should get initial parsed input (has `phoneNumber` that has no `country`)', () => {
		const phoneNumber = parsePhoneNumber('+870773111632', metadata)
		getInitialPhoneDigits({
			value: phoneNumber.number,
			defaultCountry: 'RU',
			useNationalFormat: true,
			phoneNumber,
			metadata
		}).should.equal('+870773111632')
	})
})