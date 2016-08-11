// https://github.com/sanniassin/react-input-mask/blob/master/InputElement.js
// https://github.com/halt-hammerzeit/react-phone-number-input

import React, { PropTypes } from 'react'
import ReactDOM from 'react-dom'

import { format, cleartext_international } from './phone'
import edit from './editor'

// Key codes
const Keys =
{
	Backspace : 8,
	Delete    : 46
}

// Usage:
//
// <Phone
// 	value={this.state.phone}
// 	format={format.RU}
// 	onChange={phone => this.setState({ phone })}
// 	className="phone-input"
// 	style={{ color: 'black' }} />
//
export default class Phone_input extends React.Component
{
	constructor(props, context)
	{
		super(props, context)

		this.onKeyDown = this.onKeyDown.bind(this)
		this.format_input_value = this.format_input_value.bind(this)
	}

	render()
	{
		const { name, value, placeholder, className, style } = this.props

		return (
			<input
				type="tel"
				name={name}
				ref="input"
				value={format(value, this.props.format)}
				onKeyDown={this.onKeyDown}
				onChange={event => this.format_input_value()}
				onPaste={event => this.format_input_value()}
				onCut={event => this.format_input_value({ delete: true })}
				placeholder={placeholder}
				className={className}
				style={style} />
		)
	}

	// Returns <input/> DOM Element
	input_element()
	{
		return ReactDOM.findDOMNode(this.refs.input)
	}

	// Sets <input/> value and caret position
	set_input_value(value, caret_position)
	{
		// DOM Node
		const input = this.input_element()

		// set <input/> value manually to also set caret position
		// and prevent React from resetting the caret position later
		// inside subsequent `render()`.
		input.value = value

		// Set caret position (with the neccessary adjustments)
		if (caret_position !== undefined)
		{
			input.setSelectionRange(caret_position, caret_position)
		}

		if (this.props.onChange)
		{
			this.props.onChange(cleartext_international(value, this.props.format))
		}
	}

	// Gets <input/> value
	get_input_value()
	{
		return this.input_element().value
	}

	// Gets <input/> caret position
	get_caret_position()
	{
		return this.input_element().selectionStart
	}

	// Gets <input/> selected position
	get_selection()
	{
		// DOM Node
		const input = this.input_element()

		// If no selection, return nothing
		if (input.selectionStart === input.selectionEnd)
		{
			return
		}

		return { start: input.selectionStart, end: input.selectionEnd }
	}

	// Formats input value as a phone number
	format_input_value(options = {})
	{
		// Get selection caret positions
		options.selection = this.get_selection()

		// Edit <input/>ted value according to the input conditions (caret position, key pressed)
		const { phone, caret } = edit(this.get_input_value(), this.get_caret_position(), this.props.format, options)

		// Set <input/> value and caret position
		this.set_input_value(phone, caret)
	}

	// Intercepts "Delete" and "Backspace" keys
	// (hitting "Delete" or "Backspace"
	//  at any caret position should always result in 
	//  erasing a digit)
	onKeyDown(event)
	{
		const backspace = event.keyCode === Keys.Backspace
		const Delete    = event.keyCode === Keys.Delete

		if (backspace || Delete)
		{
			this.format_input_value({ backspace, delete: Delete })
			return event.preventDefault()
		}
	}
}

Phone_input.propTypes =
{
	format    : PropTypes.shape
	({
		country : PropTypes.string.isRequired,
		city    : PropTypes.number.isRequired,
		number  : PropTypes.arrayOf(PropTypes.number),
	})
	.isRequired,
	value     : PropTypes.string.isRequired,
	onChange  : PropTypes.func.isRequired,
	className : PropTypes.string,
	style     : PropTypes.object
}