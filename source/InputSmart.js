import React, { Component } from 'react'
import { ReactInput } from 'input-format'

import { parsePhoneNumberCharacter } from 'libphonenumber-js/custom'
import formatPhoneNumber from './formatPhoneNumber'

/**
 * This input uses `input-format` library
 * for "smart" caret positioning.
 */
export default class InputSmart extends Component
{
	focus = () => this.input.focus()

	storeInput = (ref) => this.input = ref

	format = (value) =>
	{
		const { country, metadata } = this.props

		return formatPhoneNumber(value, country, metadata)
	}

	render()
	{
		const { country, metadata, ...rest } = this.props

		return (
			<ReactInput
				{...rest}
				ref={this.storeInput}
				parse={parsePhoneNumberCharacter}
				format={this.format}/>
		)
	}
}