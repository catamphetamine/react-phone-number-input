import React, { useCallback } from 'react'
import PropTypes from 'prop-types'
import Input from 'input-format/react'
import { AsYouType } from 'libphonenumber-js/core'

import { getPrefixForFormattingValueAsPhoneNumber, removePrefixFromFormattedPhoneNumber } from './helpers/inputValuePrefix.js'
import parsePhoneNumberCharacter from './helpers/parsePhoneNumberCharacter.js'

import useInputKeyDownHandler from './useInputKeyDownHandler.js'

export function createInput(defaultMetadata)
{
	/**
	 * `InputSmart` is a "smarter" implementation of a `Component`
	 * that can be passed to `<PhoneInput/>`. It parses and formats
	 * the user's and maintains the caret's position in the process.
	 * The caret positioning is maintained using `input-format` library.
	 * Relies on being run in a DOM environment for calling caret positioning functions.
	 */
	function InputSmart({
		onKeyDown,
		country,
		inputFormat,
		metadata = defaultMetadata,
		...rest
	}, ref) {
		const format = useCallback((value) => {
			// "As you type" formatter.
			const formatter = new AsYouType(country, metadata)

			const prefix = getPrefixForFormattingValueAsPhoneNumber({
				inputFormat,
				country,
				metadata
			})

			// Format the number.
			let text = formatter.input(prefix + value)
			let template = formatter.getTemplate()

			if (prefix) {
				text = removePrefixFromFormattedPhoneNumber(text, prefix)
				// `AsYouType.getTemplate()` can be `undefined`.
				if (template) {
					template = removePrefixFromFormattedPhoneNumber(template, prefix)
				}
			}

			return {
				text,
				template
			}
		}, [
			country,
			metadata
		])

		const _onKeyDown = useInputKeyDownHandler({
			onKeyDown,
			inputFormat
		})

		return (
			<Input
				{...rest}
				ref={ref}
				parse={parsePhoneNumberCharacter}
				format={format}
				onKeyDown={_onKeyDown}
			/>
		)
	}

	InputSmart = React.forwardRef(InputSmart)

	InputSmart.propTypes = {
		/**
		 * The parsed phone number.
		 * "Parsed" not in a sense of "E.164"
		 * but rather in a sense of "having only
		 * digits and possibly a leading plus character".
		 * Examples: `""`, `"+"`, `"+123"`, `"123"`.
		 */
		value: PropTypes.string.isRequired,

		/**
		 * A function of `value: string`.
		 * Updates the `value` property.
		 */
		onChange: PropTypes.func.isRequired,

		/**
		 * A function of `event: Event`.
		 * Handles `keydown` events.
		 */
		onKeyDown: PropTypes.func,

		/**
		 * A two-letter country code for formatting `value`
		 * as a national phone number (e.g. `(800) 555 35 35`).
		 * E.g. "US", "RU", etc.
		 * If no `country` is passed then `value`
		 * is formatted as an international phone number.
		 * (e.g. `+7 800 555 35 35`)
		 * This property should've been called `defaultCountry`
		 * because it only applies when the user inputs a phone number in a national format
		 * and is completely ignored when the user inputs a phone number in an international format.
		 */
		country: PropTypes.string,

		/**
		 * The format that the input field value is being input/output in.
		 */
		inputFormat : PropTypes.oneOf([
			'INTERNATIONAL',
			'NATIONAL_PART_OF_INTERNATIONAL',
			'NATIONAL',
			'INTERNATIONAL_OR_NATIONAL'
		]).isRequired,

		/**
		 * `libphonenumber-js` metadata.
		 */
		metadata: PropTypes.object
	}

	return InputSmart
}

export default createInput()