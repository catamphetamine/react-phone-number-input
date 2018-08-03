import React, { Component } from 'react'
import { ReactInput } from 'input-format'
import { AsYouType } from 'libphonenumber-js/custom'

import { parsePhoneNumberCharacter } from 'libphonenumber-js/custom'

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

		// "As you type" formatter.
		const formatter = new AsYouType(country, metadata)

		// Format the number.
		const text = formatter.input(value)

		return { text, template: formatter.getTemplate() }
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