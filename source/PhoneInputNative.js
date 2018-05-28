import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import PhoneInput from './PhoneInput'
import CountrySelect from './CountrySelectNative'

export default class PhoneInputNative extends Component
{
	static propTypes =
	{
		// Replaces the default country select arrow.
		countrySelectArrowComponent : PropTypes.func
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
				countrySelectProperties={ countrySelectProperties }/>
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

const countrySelectProperties =
{
	countrySelectArrowComponent : 'selectArrowComponent'
}