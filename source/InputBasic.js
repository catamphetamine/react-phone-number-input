import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { polyfill as reactLifecyclesCompat } from 'react-lifecycles-compat'
import { parseIncompletePhoneNumber, formatIncompletePhoneNumber } from 'libphonenumber-js/custom'

/**
 * `InputBasic`'s caret is not as "smart" as the default `inputComponent`'s
 * but still works good enough. When erasing or inserting digits in the middle
 * of a phone number the caret usually jumps to the end: this is the expected
 * behaviour and it's the workaround for the [Samsung Galaxy smart caret positioning bug](https://github.com/catamphetamine/react-phone-number-input/issues/75).
 */
@reactLifecyclesCompat
export default class InputBasic extends PureComponent
{
	static propTypes =
	{
		// The parsed phone number.
		// E.g.: `""`, `"+"`, `"+123"`, `"123"`.
		value : PropTypes.string.isRequired,

		// Updates the `value`.
		onChange : PropTypes.func.isRequired,

		// A two-letter country code for formatting `value`
		// as a national phone number (e.g. `(800) 555 35 35`).
		// E.g. "US", "RU", etc.
		// If no `country` is passed then `value`
		// is formatted as an international phone number.
		// (e.g. `+7 800 555 35 35`)
		country : PropTypes.string,

		// `libphonenumber-js` metadata.
		metadata : PropTypes.object.isRequired
	}

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

		let newValue = parseIncompletePhoneNumber(event.target.value)

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

		return formatIncompletePhoneNumber(value, country, metadata)
	}

	focus = () => this.input.focus()

	storeInput = (ref) => this.input = ref

	render()
	{
		const
		{
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