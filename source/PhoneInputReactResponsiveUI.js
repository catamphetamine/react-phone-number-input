import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import PhoneInput from './PhoneInput'
import CountrySelect from './CountrySelectReactResponsiveUI'

export default class PhoneInputReactResponsiveUI extends Component
{
	static propTypes =
	{
		// `<input/>` CSS class.
		// Both for the phone number `<input/>` and
		// the country select autocomplete `<input/>`.
		inputClassName : PropTypes.string,

		// If set to `false`, then country flags will be shown
		// for all countries when country `<select/>` is expanded.
		// By default shows flag only for currently selected country.
		saveOnIcons : PropTypes.bool,

		// Whether to use native country `<select/>` when it's expanded.
		// Deprecated. Will be removed in some future major version.
		// Use `<PhoneInputNative/>` instead.
		nativeCountrySelect : PropTypes.bool,

		// `aria-label` for the `<Select/>`'s toggle `<button/>`.
		countrySelectAriaLabel : PropTypes.string,

		// `aria-label` for the `<Select/>`'s "Close" button
		// (which is an "x" visible in fullscreen mode).
		// (not yet implemented but is likely to be).
		countrySelectCloseAriaLabel : PropTypes.string,

		// Defines the height (in items) of the expanded country `<select/>`.
		countrySelectMaxItems : PropTypes.number,

		// Country `<select/>` toggle `<button/>` CSS class.
		// Deprecated. Will be removed in some future major version.
		countrySelectToggleClassName : PropTypes.string
	}

	storeInputRef = (ref) => this.input = ref

	render()
	{
		return (
			<PhoneInput
				{ ...this.props }
				ref={ this.storeInputRef }
				getInputClassName={ this.getInputClassName }
				countrySelectComponent={ CountrySelect }
				countrySelectProperties={ countrySelectProperties }
				countrySelectHidesPhoneInputField/>
		)
	}

	getInputClassName = ({ disabled, invalid }) =>
	{
		return classNames
		(
			'rrui__input',
			'rrui__input-element',
			'rrui__input-field',
			{
				'rrui__input-field--invalid'  : invalid,
				'rrui__input-field--disabled' : disabled
			}
		)
	}

	// Proxy `.focus()` method.
	focus()
	{
		return this.input.focus()
	}
}

const countrySelectProperties =
{
	inputClassName               : 'inputClassName',
	saveOnIcons                  : 'saveOnIcons',
	nativeCountrySelect          : 'nativeExpanded',
	countrySelectAriaLabel       : 'ariaLabel',
	countrySelectCloseAriaLabel  : 'closeAriaLabel',
	countrySelectMaxItems        : 'maxItems',
	countrySelectToggleClassName : 'toggleClassName'
}