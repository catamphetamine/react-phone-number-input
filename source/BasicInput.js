import React, { PureComponent } from 'react'
import { polyfill as reactLifecyclesCompat } from 'react-lifecycles-compat'

import { parsePhoneNumberCharacters, formatPhoneNumber } from './input-control'

/**
 * `BasicInput`'s caret is not as "smart" as the default `inputComponent`'s
 * but still works good enough. When erasing or inserting digits in the middle
 * of a phone number the caret usually jumps to the end: this is the expected
 * behaviour and it's the workaround for the [Samsung Galaxy smart caret positioning bug](https://github.com/catamphetamine/react-phone-number-input/issues/75).
 */
@reactLifecyclesCompat
export default class BasicInput extends PureComponent
{
	// Prevents React from resetting the `<input/>` caret position.
	// https://github.com/reactjs/react-redux/issues/525#issuecomment-254852039
	// https://github.com/facebook/react/issues/955
	static getDerivedStateFromProps({ value })
	{
		return { value }
	}

	state = {}

	onChange = (event) =>
	{
		const { onChange } = this.props
		const { value } = this.state

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

		// Prevents React from resetting the `<input/>` caret position.
		// https://github.com/reactjs/react-redux/issues/525#issuecomment-254852039
		// https://github.com/facebook/react/issues/955
		this.setState({ value: newValue }, () => onChange(newValue))
	}

	format(value)
	{
		const { country, metadata } = this.props

		return formatPhoneNumber(value, country, metadata).text
	}

	focus()
	{
		this.input.focus()
	}

	storeInput = (ref) => this.input = ref

	render()
	{
		const
		{
			// value,
			onChange,
			country,
			metadata,
			...rest
		}
		= this.props

		// Prevents React from resetting the `<input/>` caret position.
		// https://github.com/reactjs/react-redux/issues/525#issuecomment-254852039
		// https://github.com/facebook/react/issues/955
		const { value } = this.state

		return (
			<input
				{...rest}
				ref={this.storeInput}
				value={this.format(value)}
				onChange={this.onChange}/>
		)
	}
}