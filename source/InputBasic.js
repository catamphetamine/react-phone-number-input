import React from 'react'
import PropTypes from 'prop-types'
import { parseIncompletePhoneNumber, formatIncompletePhoneNumber } from 'libphonenumber-js/core'
import { polyfill as reactLifecyclesCompat } from 'react-lifecycles-compat'

// `PureComponent` is only available in React >= 15.3.0.
const PureComponent = React.PureComponent || React.Component

export function createInput(defaultMetadata)
{
	/**
	 * `InputBasic`'s caret is not as "smart" as the default `inputComponent`'s
	 * but still works good enough. When erasing or inserting digits in the middle
	 * of a phone number the caret usually jumps to the end: this is the expected
	 * behaviour and it's the workaround for the [Samsung Galaxy smart caret positioning bug](https://github.com/catamphetamine/react-phone-number-input/issues/75).
	 */
	class InputBasic extends PureComponent
	{
		static propTypes =
		{
			// The parsed phone number.
			// E.g.: `""`, `"+"`, `"+123"`, `"123"`.
			value : PropTypes.string.isRequired,

			// Updates the `value`.
			onChange : PropTypes.func.isRequired,

			// Toggles the `--focus` CSS class.
			// https://github.com/catamphetamine/react-phone-number-input/issues/189
			onFocus : PropTypes.func,

			// `onBlur` workaround for `redux-form`'s bug.
			onBlur : PropTypes.func,

			// A two-letter country code for formatting `value`
			// as a national phone number (e.g. `(800) 555 35 35`).
			// E.g. "US", "RU", etc.
			// If no `country` is passed then `value`
			// is formatted as an international phone number.
			// (e.g. `+7 800 555 35 35`)
			country : PropTypes.string,

			// `libphonenumber-js` metadata.
			metadata : PropTypes.object.isRequired,

			// The `<input/>` component.
			inputComponent : PropTypes.elementType.isRequired
		}

		static defaultProps =
		{
			metadata : defaultMetadata
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

		// This `onBlur` interceptor is a workaround for `redux-form`'s bug
		// so that it gets the up-to-date `value` in its `onBlur` handler.
		// Without this fix it just gets the actual (raw) input field textual value.
		// E.g. `+7 800 555 35 35` instead of `+78005553535`.
		//
		// New `value` is taken from `event` in `redux-form`'s `handleBlur()`.
		// https://github.com/erikras/redux-form/blob/785edf8aac3adc84aba2ab6898a4aa8c48687750/src/ConnectedField.js#L168
		// `redux-form` shouldn't have taken the new `value` from `event`.
		//
		// A developer is not supposed to pass this `onBlur` property manually.
		// Instead, `redux-form` passes `onBlur` to this component automatically
		// and this component patches that `onBlur` handler (a hacky way but works).
		//
		onBlur = (event) =>
		{
			const { onBlur } = this.props
			const { value } = this.state

			if (onBlur)
			{
				// `event` is React's `SyntheticEvent`.
				// Its `.value` is read-only therefore cloning it.
				const _event =
				{
					...event,
					target:
					{
						...event.target,
						value
					}
				}

				// Workaround for `redux-form` event detection.
				// https://github.com/erikras/redux-form/blob/v5/src/events/isEvent.js
				_event.stopPropagation = event.stopPropagation
				_event.preventDefault  = event.preventDefault

				return onBlur(_event)
			}
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
				onFocus,
				country,
				metadata,
				inputComponent: Input,
				...rest
			}
			= this.props

			// Prevents React from resetting the `<input/>` caret position.
			// https://github.com/reactjs/react-redux/issues/525#issuecomment-254852039
			// https://github.com/facebook/react/issues/955
			const { value } = this.state

			return (
				<Input
					{...rest}
					ref={this.storeInput}
					value={this.format(value)}
					onChange={this.onChange}
					onFocus={onFocus}
					onBlur={this.onBlur}/>
			)
		}
	}

	return reactLifecyclesCompat(InputBasic)
}

export default createInput()