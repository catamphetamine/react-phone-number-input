import React, { Component } from 'react'

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
				countrySelectComponent={ CountrySelect }/>
		)
	}

	// Proxy `.focus()` method.
	focus()
	{
		return this.input.focus()
	}
}