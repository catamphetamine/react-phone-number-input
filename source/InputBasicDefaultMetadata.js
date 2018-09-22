import React, { Component } from 'react'
import metadata from 'libphonenumber-js/metadata.min.json'

import InputBasic from './InputBasic'

export default class InputBasicDefaultMetadata extends Component
{
	// Proxy `.focus()` method.
	focus = () => this.input.focus()

	storeInputRef = (ref) => this.input = ref

	render()
	{
		return (
			<InputBasic
				{ ...this.props }
				ref={ this.storeInputRef }
				metadata={ metadata }/>
		)
	}
}