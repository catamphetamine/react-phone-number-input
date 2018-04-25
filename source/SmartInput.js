import React, { Component } from 'react'
import { ReactInput } from 'input-format'

import { parsePhoneNumberCharacter, formatPhoneNumber } from './input-control'

/**
 * This input uses `input-format` library
 * for "smart" caret positioning.
 */
export default class SmartInput extends Component
{
	focus()
	{
		this.input.focus()
	}

	storeInput = (ref) => this.input = ref

	render()
	{
		const { country, metadata, ...rest } = this.props

		return (
			<ReactInput
				{...rest}
				ref={this.storeInput}
				parse={parsePhoneNumberCharacter}
				format={value => formatPhoneNumber(value, country, metadata)}/>
		)
	}
}