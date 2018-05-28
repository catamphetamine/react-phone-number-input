import React, { Component } from 'react'
import classNames from 'classnames'

import PhoneInput from './PhoneInput'
import CountrySelect from './CountrySelectReactResponsiveUI'

export default class PhoneInputReactResponsiveUI extends Component
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