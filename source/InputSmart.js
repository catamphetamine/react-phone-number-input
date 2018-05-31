import React, { Component } from 'react'
import { ReactInput } from 'input-format'

// Both these functions are exported from `react-phone-number-input`.
import { parsePhoneNumberCharacter } from './parsePhoneNumberCharacters'
import formatPhoneNumber from './formatPhoneNumber'

/**
 * This input uses `input-format` library
 * for "smart" caret positioning.
 */
export default class InputSmart extends Component
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