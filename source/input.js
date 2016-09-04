// https://github.com/sanniassin/react-input-mask/blob/master/InputElement.js
// https://github.com/halt-hammerzeit/react-phone-number-input

import React, { PropTypes } from 'react'
import ReactDOM from 'react-dom'

import { format as format_phone, parse_plaintext_international } from './phone'
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

		this.on_key_down = this.on_key_down.bind(this)
		this.on_cut = this.on_cut.bind(this)
		this.on_blur = this.on_blur.bind(this)
		this.format_input_value = this.format_input_value.bind(this)
	}

	render()
	{
		const { value, format, ...rest } = this.props

		// Currently onCut has a bug: it just deletes, but doesn't copy.
		// Since no one would really cut a phone number, I guess that's ok.

		return (
			<input
				{...rest}
				type="tel"
				ref="input"
				value={format_phone(value, format)}
				onKeyDown={this.on_key_down}
				onChange={this.format_input_value}
				onBlur={this.on_blur}
				onPaste={this.format_input_value}
				onCut={this.on_cut}/>
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

		const { onChange, format } = this.props

		if (onChange)
		{
			onChange(parse_plaintext_international(value, format))
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
	format_input_value(event, options = {})
	{
		// Get selection caret positions
		options.selection = this.get_selection()

		// Edit <input/>ted value according to the input conditions (caret position, key pressed)
		const { phone, caret } = edit(this.get_input_value(), this.get_caret_position(), this.props.format, options)

		// Set <input/> value and caret position
		this.set_input_value(phone, caret)
	}

	// Intercepts "Cut" event.
	// Special handling for "Cut" event because
	// it wouldn't copy to clipboard otherwise.
	on_cut(event)
	{
		setTimeout(() => this.format_input_value(event), 0)
	}

	// This handler is mainly for `redux-form`
	on_blur(event)
	{
		const { onBlur, format } = this.props

		if (onBlur)
		{
			onBlur(parse_plaintext_international(this.input_element().value, format))
		}
	}

	// Intercepts "Delete" and "Backspace" keys
	// (hitting "Delete" or "Backspace"
	//  at any caret position should always result in 
	//  erasing a digit)
	on_key_down(event)
	{
		const backspace = event.keyCode === Keys.Backspace
		const Delete    = event.keyCode === Keys.Delete

		if (backspace || Delete)
		{
			this.format_input_value(event, { backspace, delete: Delete })
			return event.preventDefault()
		}
	}
}

Phone_input.propTypes =
{
	format : PropTypes.oneOfType
	([
		PropTypes.shape
		({
			country  : PropTypes.string.isRequired,
			template : PropTypes.string.isRequired
		}),
		PropTypes.shape
		({
			template : PropTypes.func.isRequired
		})
	])
	.isRequired,
	value     : PropTypes.string.isRequired,
	onChange  : PropTypes.func.isRequired,
	onBlur    : PropTypes.func
}