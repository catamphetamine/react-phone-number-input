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
				countrySelectComponent={ CountrySelect }
				countrySelectProperties={ countrySelectProperties }/>
		)
	}

	// Proxy `.focus()` method.
	focus = () => this.input.focus()
}

const countrySelectProperties =
{
	countrySelectArrowComponent : 'selectArrowComponent'
}