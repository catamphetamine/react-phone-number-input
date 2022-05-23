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
		getPhoneInputWithCountryStateUpdateFromNewProps(
			{
				reset: true,
				defaultCountry: 'RU'
			},
			{},
			{}
		).should.deep.equal({
			phoneDigits: undefined,
			value: undefined,
			country: 'RU',
			hasUserSelectedACountry: undefined
		})
	})

	it('should get state update from new props (reset) (international)', () => {
		getPhoneInputWithCountryStateUpdateFromNewProps(
			{
				reset: true,
				international: true,
				defaultCountry: 'RU'
			},
			{},
			{}
		).should.deep.equal({
			phoneDigits: '+7',
			value: undefined,
			country: 'RU',
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
		getPhoneInputWithCountryStateUpdateFromNewProps(
			{
				defaultCountry: 'RU'
			},
			{
				defaultCountry: 'US'
			},
			{}
		).should.deep.equal({
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
		getPhoneInputWithCountryStateUpdateFromNewProps(
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
		).should.deep.equal({
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
		getPhoneInputWithCountryStateUpdateFromNewProps(
			{
				value: '+78005553535',
				defaultCountry: 'FR'
			},
			{
				defaultCountry: 'US'
			},
			{}
		).should.deep.equal({
			country: 'RU',
			phoneDigits: '+78005553535',
			value: '+78005553535'
		})
	})

	it('should get state update from new props (`value` changed: value -> undefined)', () => {
		getPhoneInputWithCountryStateUpdateFromNewProps(
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
		).should.deep.equal({
			country: 'RU',
			phoneDigits: undefined,
			value: undefined,
			hasUserSelectedACountry: undefined
		})
	})

	// https://github.com/catamphetamine/react-phone-number-input/issues/377
	it('should get state update from new props (`value` changed: undefined -> +78)', () => {
		getPhoneInputWithCountryStateUpdateFromNewProps(
			{ value: '+78' },
			{},
			{}
		).should.deep.equal({
			country: 'RU',
			phoneDigits: '+78',
			value: '+78'
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