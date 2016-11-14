// https://github.com/sanniassin/react-input-mask/blob/master/InputElement.js
// https://github.com/halt-hammerzeit/react-phone-number-input

import React, { PropTypes } from 'react'
import ReactDOM from 'react-dom'

import { edit_and_format, parse_value, format_value } from './editable'

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
		super(props)

		this.on_cut = this.on_cut.bind(this)
		this.on_paste = this.on_paste.bind(this)
		this.on_blur = this.on_blur.bind(this)
		this.on_change = this.on_change.bind(this)
		this.on_key_down = this.on_key_down.bind(this)
		this.format_input_text = this.format_input_text.bind(this)
	}

	render()
	{
		const { value, format, ...rest } = this.props

		return (
			<input
				{...rest}
				type="tel"
				ref="input"
				value={format_value(value, format)}
				onKeyDown={this.on_key_down}
				onChange={this.on_change}
				onBlur={this.on_blur}
				onPaste={this.on_paste}
				onCut={this.on_cut}/>
		)
	}

	// Gets <input/> textual value
	get_input_text()
	{
		return this.input_element().value
	}

	// Gets <input/> caret position
	get_caret_position()
	{
		return this.input_element().selectionStart
	}

	// Sets <input/> caret position
	set_caret_position(caret_position)
	{
		// DOM Node
		const input = this.input_element()

		// Set caret position
		input.setSelectionRange(caret_position, caret_position)
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

	// Returns <input/> DOM Element
	input_element()
	{
		return ReactDOM.findDOMNode(this.refs.input)
	}

	// Parses the <input/> textual value
	// into a plaintext international `value`
	parse_value()
	{
		const { format } = this.props

		return parse_value(this.get_input_text(), format)
	}

	// Formats <input/> textual value as a phone number
	format_input_text(operation)
	{
		const { format } = this.props

		// Apply the pending operation to the <input/> textual value (if any),
		// and then format the <input/> textual value as a phone number
		// (and reposition the caret position accordingly)
		const { phone, caret } = edit_and_format
		(
			operation,
			this.get_input_text(),
			format,
			this.get_caret_position(),
			this.get_selection(),
			{ has_trunk_prefix: false }
		)

		// Set <input/> textual value and caret position
		// (have to do this so that React
		//  doesn't reset caret position)
		this.set_input_text(phone, caret)
	}

	// Sets <input/> textual value and caret position
	set_input_text(text, caret_position)
	{
		// DOM Node
		const input = this.input_element()

		// set <input/> textual value manually to also set caret position
		// and prevent React from resetting the caret position later
		// inside subsequent `render()`.
		input.value = text

		// Set caret position (with the neccessary adjustments)
		if (caret_position !== undefined)
		{
			this.set_caret_position(caret_position)
		}

		const { onChange } = this.props

		if (onChange)
		{
			onChange(this.parse_value())
		}
	}

	// Intercepts "Cut" event.
	// Special handling for "Cut" event because
	// it wouldn't copy to clipboard otherwise.
	on_cut(event)
	{
		setTimeout(this.format_input_text, 0)
	}

	// This handler is a workaround for `redux-form`
	on_blur(event)
	{
		const { onBlur } = this.props

		// This `onBlur` interceptor is a workaround for `redux-form`,
		// so that it gets a parsed `value` in its `onBlur` handler,
		// not the formatted one.
		if (onBlur)
		{
			onBlur(this.parse_value())
		}
	}

	on_paste(event)
	{
		this.format_input_text()
	}

	on_change(event)
	{
		this.format_input_text()
	}

	// Intercepts "Delete" and "Backspace" keys
	// (hitting "Delete" or "Backspace"
	//  at any caret position should always result in 
	//  erasing a digit)
	on_key_down(event)
	{
		const operation = get_operation_by_event(event)

		if (operation)
		{
			this.format_input_text(operation)
			return event.preventDefault()
		}
	}
}

Phone_input.propTypes =
{
	// Phone number format description.
	// Either a basic one (with `template` being a string),
	// or a more complex one (with `template` being a function).
	format : PropTypes.oneOfType
	([
		PropTypes.shape
		({
			country  : PropTypes.string.isRequired,
			template : PropTypes.string.isRequired
		}),
		PropTypes.shape
		({
			country  : PropTypes.string.isRequired,
			template : PropTypes.func.isRequired
		})
	]),
	// `format` is not required for automatic
	// (iPhone style) phone number input
	// .isRequired,

	// Phone number `value`.
	// Is a plaintext international phone number
	// (e.g. "+12223333333" for USA)
	value : PropTypes.string,

	// This handler is called each time
	// the phone number <input/> changes its textual value.
	onChange : PropTypes.func.isRequired,

	// This `onBlur` interceptor is a workaround for `redux-form`,
	// so that it gets a parsed `value` in its `onBlur` handler,
	// not the formatted one.
	onBlur : PropTypes.func
}

// Key codes
const Keys =
{
	Backspace : 8,
	Delete    : 46
}

function get_operation_by_event(event)
{
	switch (event.keyCode)
	{
		case Keys.Backspace:
			return 'Backspace'

		case Keys.Delete:
			return 'Delete'
	}
}