import React, { Component } from 'react'
import { ReactInput } from 'input-format'

import { parsePhoneNumberCharacter, formatPhoneNumber } from './input-control'

/**
 * This input uses `input-format` library
 * for "smart" caret positioning.
 *
 * This component is implemented as a `React.Component`
 * because `ReactDOM.findDOMNode()` is used for focusing.
 */
export default class SmartInput extends Component
{
	render()
	{
		const { country, metadata, ...rest } = this.props

		return (
			<ReactInput
				{...rest}
				parse={ parsePhoneNumberCharacter }
				format={ value => formatPhoneNumber(value, country, metadata) }/>
		)
	}
}