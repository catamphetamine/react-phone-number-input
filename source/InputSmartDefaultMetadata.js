import React, { Component } from 'react'
import metadata from 'libphonenumber-js/metadata.min.json'

import InputSmart from './InputSmart'

export default class InputSmartDefaultMetadata extends Component
{
	// Proxy `.focus()` method.
	focus = () => this.input.focus()

	storeInputRef = (ref) => this.input = ref

	render()
	{
		return (
			<InputSmart
				{ ...this.props }
				ref={ this.storeInputRef }
				metadata={ metadata }/>
		)
	}
}