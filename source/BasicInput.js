import React, { Component } from 'react'
import ReactDOM from 'react-dom'

import { parsePhoneNumberCharacters, formatPhoneNumber } from './input-control'

export default class BasicInput extends React.Component
{
	onChange = (event) =>
	{
		const { onChange, value } = this.props

		let newValue = parsePhoneNumberCharacters(event.target.value)

		// By default, if a value is something like `"(123)"`
		// then Backspace would only erase the rightmost brace
		// becoming something like `"(123"`
		// which would give the same `"123"` value
		// which would then be formatted back to `"(123)"`
		// and so a user wouldn't be able to erase the phone number.
		// Working around this issue with this simple hack.
		if (newValue === value)
		{
			if (this.format(newValue).indexOf(event.target.value) === 0)
			{
				// Trim the last digit (or plus sign).
				newValue = newValue.slice(0, -1)
			}
		}

		onChange(newValue)
	}

	format(value)
	{
		const { country, metadata } = this.props

		return formatPhoneNumber(value, country, metadata).text
	}

	storeInstance = (ref) => this.input = ReactDOM.findDOMNode(ref)

	render()
	{
		const
		{
			value,
			onChange,
			country,
			metadata,
			...rest
		}
		= this.props

		if (this.input) {
			this.input.value = this.format(value)
		}

		return (
			<input
				{...rest}
				ref={this.storeInstance}
				value={this.format(value)}
				onChange={this.onChange}/>
		)
	}
}