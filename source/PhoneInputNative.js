import React, { Component } from 'react'
import classNames from 'classnames'

import PhoneInput from './PhoneInput'
import CountrySelect from './CountrySelectNative'

export default class PhoneInputNative extends Component
{
	storeInputRef = (ref) => this.input = ref

	render()
	{
		return (
			<PhoneInput
				{ ...this.props }
				ref={ this.storeInputRef }
				countrySelectComponent={ CountrySelect }
				getInputClassName={ this.getInputClassName }/>
		)
	}

	getInputClassName = ({ disabled, invalid }) =>
	{
		return classNames
		(
			// Will be removed in version 2.x
			'react-phone-number-input__phone--native',
			{
				'react-phone-number-input__phone--disabled' : disabled,
				'react-phone-number-input__phone--invalid'  : invalid
			}
		)
	}

	// Proxy `.focus()` method.
	focus()
	{
		return this.input.focus()
	}
}