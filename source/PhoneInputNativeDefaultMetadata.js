import React, { Component } from 'react'
import metadata from 'libphonenumber-js/metadata.min'

import PhoneInput from './PhoneInputNative'

export default class PhoneInputNativeDefaultMetadata extends Component
{
	storeInputRef = (ref) => this.input = ref

	render()
	{
		return (
			<PhoneInput
				{ ...this.props }
				ref={ this.storeInputRef }
				metadata={ metadata }/>
		)
	}

	// Proxy `.focus()` method.
	focus()
	{
		return this.input.focus()
	}
}