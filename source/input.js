// https://github.com/sanniassin/react-input-mask/blob/master/InputElement.js
// https://github.com/halt-hammerzeit/react-phone-number-input

import React, { PropTypes } from 'react'
import ReactDOM from 'react-dom'

import edit from './editor'

// Usage:
//
// <Phone
// 	value={this.state.phone}
// 	format={formats.RU}
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
		const { className, style } = this.props

		return (
			<input
				type="tel"
				ref="input"
				value={this.props.value}
				onKeyDown={this.onKeyDown}
				onChange={event => this.format_input_value()}
				onPaste={event => this.format_input_value()}
				onCut={event => this.format_input_value({ delete: true })}
				className={className}
				style={style} />
		)
	}

	// Sets <input/> value and caret position
	set_input_value(value, caret_position)
	{
		// DOM Node
		const input = ReactDOM.findDOMNode(this.refs.input)

		input.value = value

		if (this.props.onChange)
		{
			this.props.onChange(value)
		}

		// Set caret position (with the neccessary adjustments)
		if (caret_position !== undefined)
		{
			input.setSelectionRange(caret_position, caret_position)
		}
	}

	// Gets <input/> value
	get_input_value()
	{
		// DOM Node
		const input = ReactDOM.findDOMNode(this.refs.input)

		return input.value
	}

	// Gets <input/> caret position
	get_caret_position()
	{
		// DOM Node
		const input = ReactDOM.findDOMNode(this.refs.input)

		return input.selectionStart
	}

	// Gets <input/> selected position
	get_selection()
	{
		// DOM Node
		const input = ReactDOM.findDOMNode(this.refs.input)

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
	onKeyDown(event)
	{
		const key = event.keyCode

		// If "Backspace" key was pressed (key code: 8)
		if (key === 8)
		{
			this.format_input_value({ backspace: true })
			event.preventDefault()
			return
		}

		// If "Delete" key was pressed (key code: 46)
		if (key === 46)
		{
			this.format_input_value({ delete: true })
			event.preventDefault()
			return
		}
	}
}

Phone_input.propTypes =
{
	format    : PropTypes.object.isRequired,
	value     : PropTypes.string.isRequired,
	onChange  : PropTypes.func.isRequired,
	className : PropTypes.string,
	style     : PropTypes.object
}