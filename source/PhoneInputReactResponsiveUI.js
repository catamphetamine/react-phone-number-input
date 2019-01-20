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

		// `aria-label` for the `<Select/>`'s toggle `<button/>`.
		countrySelectAriaLabel : PropTypes.string,

		// `aria-label` for the `<Select/>`'s "Close" button
		// (which is an "x" visible in fullscreen mode).
		// (not yet implemented but is likely to be).
		countrySelectCloseAriaLabel : PropTypes.string,

		// Defines the height (in items) of the expanded country `<select/>`.
		countrySelectMaxItems : PropTypes.number
	}

	// These two country-select-related properties are
	// implemented as `defaultProps` instead of passing them
	// directly to the `<PhoneInput/>` analogous to how it's
	// implemented in `<PhoneInputNative/>` (see `./PhoneInputNative.js` notes).
	static defaultProps = {
		countrySelectComponent: CountrySelect,
		countrySelectProperties: COUNTRY_SELECT_PROPERTIES,
		getInputClassName
	}

	storeInputRef = (ref) => this.input = ref

	render() {
		return (
			<PhoneInput ref={this.storeInputRef} {...this.props}/>
		)
	}

	// Proxy `.focus()` method.
	focus = () => this.input.focus()
}

const COUNTRY_SELECT_PROPERTIES =
{
	inputClassName               : 'inputClassName',
	saveOnIcons                  : 'saveOnIcons',
	countrySelectAriaLabel       : 'ariaLabel',
	countrySelectCloseAriaLabel  : 'closeAriaLabel',
	countrySelectMaxItems        : 'maxItems'
}

function getInputClassName({ disabled, invalid })
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