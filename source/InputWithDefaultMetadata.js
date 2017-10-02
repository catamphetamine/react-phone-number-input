import React, { Component } from 'react'
import metadata from 'libphonenumber-js/metadata.min.json'

import Input from './Input'

export default class InputWithDefaultMetadata extends Component
{
	render()
	{
		return (
			<Input
				ref={ ref => this.input = ref }
				{ ...this.props }
				metadata={ metadata }/>
		)
	}

	focus()
	{
		return this.input.focus()
	}
}