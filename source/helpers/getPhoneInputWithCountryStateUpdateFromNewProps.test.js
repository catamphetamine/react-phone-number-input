import { describe, it } from 'mocha'
import { expect } from 'chai'

import metadata from 'libphonenumber-js/min/metadata'

import _getPhoneInputWithCountryStateUpdateFromNewProps from './getPhoneInputWithCountryStateUpdateFromNewProps.js'

function getPhoneInputWithCountryStateUpdateFromNewProps(newProps, prevProps, state) {
	return _getPhoneInputWithCountryStateUpdateFromNewProps(
		{
			...newProps,
			metadata
		},
		{
			...prevProps,
			metadata
		},
		state
	)
}

describe('getPhoneInputWithCountryStateUpdateFromNewProps', () => {
	it('should get state update from new props (reset)', () => {
		expect(getPhoneInputWithCountryStateUpdateFromNewProps(
			{
				reset: true,
				defaultCountry: 'RU'
			},
			{},
			{}
		)).to.deep.equal({
			phoneDigits: undefined,
			value: undefined,
			country: 'RU',
			latestCountrySelectedByUser: undefined,
			hasUserSelectedACountry: undefined
		})
	})

	it('should get state update from new props (reset) (international)', () => {
		expect(getPhoneInputWithCountryStateUpdateFromNewProps(
			{
				reset: true,
				international: true,
				defaultCountry: 'RU'
			},
			{},
			{}
		)).to.deep.equal({
			phoneDigits: '+7',
			value: undefined,
			country: 'RU',
			latestCountrySelectedByUser: undefined,
			hasUserSelectedACountry: undefined
		})
	})

	it('should get state update from new props (default country did not change)', () => {
		expect(getPhoneInputWithCountryStateUpdateFromNewProps(
			{
				defaultCountry: 'RU'
			},
			{
				defaultCountry: 'RU'
			},
			{}
		)).to.be.undefined
	})

	it('should get state update from new props (default country changed) (no `value`)', () => {
		expect(getPhoneInputWithCountryStateUpdateFromNewProps(
			{
				defaultCountry: 'RU'
			},
			{
				defaultCountry: 'US'
			},
			{}
		)).to.deep.equal({
			country: 'RU',
			phoneDigits: undefined,
			value: undefined
		})
	})

	it('should get state update from new props (default country changed) (no `value`) (new country not supported)', () => {
		expect(getPhoneInputWithCountryStateUpdateFromNewProps(
			{
				defaultCountry: 'XX'
			},
			{
				defaultCountry: 'US'
			},
			{}
		)).to.be.undefined
	})

	it('should get state update from new props (default country changed) (`value` is intl prefix)', () => {
		expect(getPhoneInputWithCountryStateUpdateFromNewProps(
			{
				international: true,
				defaultCountry: 'CA'
			},
			{
				international: true,
				defaultCountry: 'US'
			},
			{
				value: '+1'
			}
		)).to.deep.equal({
			country: 'CA',
			phoneDigits: '+1',
			value: undefined
		})
	})

	it('should get state update from new props (default country changed) (has `value`)', () => {
		expect(getPhoneInputWithCountryStateUpdateFromNewProps(
			{
				value: '+78005553535',
				defaultCountry: 'FR'
			},
			{
				value: '+78005553535',
				defaultCountry: 'RU'
			},
			{}
		)).to.be.undefined
	})

	it('should get state update from new props (default country changed to `undefined`) (has `value`)', () => {
		expect(getPhoneInputWithCountryStateUpdateFromNewProps(
			{
				value: undefined,
				defaultCountry: 'FR'
			},
			{
				value: undefined,
				defaultCountry: undefined
			},
			{}
		)).to.deep.equal({
			country: 'FR',
			phoneDigits: undefined,
			value: undefined
		})
	})

	it('should get state update from new props (`value` changed: undefined -> value)', () => {
		expect(getPhoneInputWithCountryStateUpdateFromNewProps(
			{
				value: '+78005553535',
				defaultCountry: 'FR'
			},
			{
				defaultCountry: 'US'
			},
			{}
		)).to.deep.equal({
			country: 'RU',
			phoneDigits: '+78005553535',
			value: '+78005553535'
		})
	})

	it('should get state update from new props (`value` changed: value -> undefined)', () => {
		expect(getPhoneInputWithCountryStateUpdateFromNewProps(
			{
				defaultCountry: 'RU'
			},
			{
				value: '+78005553535',
				defaultCountry: 'RU'
			},
			{
				value: '+78005553535'
			}
		)).to.deep.equal({
			country: 'RU',
			phoneDigits: undefined,
			value: undefined,
			latestCountrySelectedByUser: undefined,
			hasUserSelectedACountry: undefined
		})
	})

	it('should get state update from new props (`value` changed: `undefined` and `null` are treated the same)', () => {
		expect(getPhoneInputWithCountryStateUpdateFromNewProps(
			{
				value: null,
				defaultCountry: 'RU'
			},
			{
				value: null,
				defaultCountry: 'RU'
			},
			{
				value: undefined
			}
		)).to.be.undefined
	})

	// https://github.com/catamphetamine/react-phone-number-input/issues/377
	it('should get state update from new props (`value` changed: undefined -> +33)', () => {
		expect(getPhoneInputWithCountryStateUpdateFromNewProps(
			{ value: '+33' },
			{},
			{}
		)).to.deep.equal({
			country: 'FR',
			phoneDigits: '+33',
			value: '+33'
		})
	})

	// https://github.com/catamphetamine/react-phone-number-input/issues/377
	it('should get state update from new props (`value` changed: undefined -> +1) (new country is ambiguous)', () => {
		expect(getPhoneInputWithCountryStateUpdateFromNewProps(
			{ value: '+1' },
			{},
			{}
		)).to.deep.equal({
			country: undefined,
			phoneDigits: '+1',
			value: '+1'
		})
	})

	// https://github.com/catamphetamine/react-phone-number-input/issues/377
	it('should get state update from new props (`value` changed: undefined -> +1) (new country is ambiguous) (has default country)', () => {
		expect(getPhoneInputWithCountryStateUpdateFromNewProps(
			{ value: '+1', defaultCountry: 'CA' },
			{},
			{}
		)).to.deep.equal({
			country: 'CA',
			phoneDigits: '+1',
			value: '+1'
		})
	})

	// https://github.com/catamphetamine/react-phone-number-input/issues/377
	it('should get state update from new props (`value` changed: undefined -> +1) (new country is ambiguous) (has default country) (default country doesn\'t match the number)', () => {
		expect(getPhoneInputWithCountryStateUpdateFromNewProps(
			{ value: '+1', defaultCountry: 'RU' },
			{},
			{}
		)).to.deep.equal({
			country: undefined,
			phoneDigits: '+1',
			value: '+1'
		})
	})

	it('should get state update from new props (`value` changed: undefined -> +1) (new country is ambiguous) (has default country) (default country doesn\'t match the number) (has latest manually selected country) (latest manually selected country fits the number)', () => {
		expect(getPhoneInputWithCountryStateUpdateFromNewProps(
			{ value: '+1', defaultCountry: 'RU' },
		{},
			{ latestCountrySelectedByUser: 'US' }
		)).to.deep.equal({
			country: 'US',
			phoneDigits: '+1',
			value: '+1'
		})
	})

	it('should get state update from new props (`value` changed: undefined -> +1) (new country is not ambiguous) (has default country) (default country doesn\'t match the number) (has latest manually selected country) (latest manually selected country does match the parsed country)', () => {
		expect(getPhoneInputWithCountryStateUpdateFromNewProps(
			{ value: '+33', defaultCountry: 'RU' },
			{},
			{ latestCountrySelectedByUser: 'FR' }
		)).to.deep.equal({
			country: 'FR',
			phoneDigits: '+33',
			value: '+33'
		})
	})

	it('should get state update from new props (`value` changed: undefined -> +1) (new country is ambiguous) (has default country) (default country doesn\'t match the number) (has latest manually selected country) (the latest manually selected country doesn\'t match the number)', () => {
		expect(getPhoneInputWithCountryStateUpdateFromNewProps(
			{ value: '+1', defaultCountry: 'RU' },
			{},
			{ latestCountrySelectedByUser: 'FR' }
		)).to.deep.equal({
			country: undefined,
			latestCountrySelectedByUser: undefined,
			phoneDigits: '+1',
			value: '+1'
		})
	})

	it('should get state update from new props (`value` changed, but already displayed)', () => {
		expect(getPhoneInputWithCountryStateUpdateFromNewProps(
			{
				value: '+78005553535'
			},
			{},
			{
				value: '+78005553535'
			}
		)).to.be.undefined
	})

	it('should get state update from new props (`value` did not change)', () => {
		expect(getPhoneInputWithCountryStateUpdateFromNewProps(
			{
				value: '+78005553535'
			},
			{
				value: '+78005553535'
			},
			{}
		)).to.be.undefined
	})
})