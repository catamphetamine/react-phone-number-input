import React, { useCallback } from 'react'
import PropTypes from 'prop-types'
import Input from 'input-format/react'
import { AsYouType, parsePhoneNumberCharacter } from 'libphonenumber-js/core'

import { getInputValuePrefix, removeInputValuePrefix } from './inputValuePrefix'

/**
 * This input uses `input-format` library
 * for "smart" caret positioning.
 */
export function createInput(defaultMetadata)
{
	function InputSmart({
		country,
		international,
		metadata,
		...rest
	}, ref) {
		const format = useCallback((value) => {
			// "As you type" formatter.
			const formatter = new AsYouType(country, metadata)
			const prefix = getInputValuePrefix(country, international, metadata)
			// Format the number.
			let text = formatter.input(prefix + value)
			let template = formatter.getTemplate()
			if (prefix) {
				text = removeInputValuePrefix(text, prefix)
				// `AsYouType.getTemplate()` can be `undefined`.
				if (template) {
					template = removeInputValuePrefix(template, prefix)
				}
			}
			return {
				text,
				template
			}
		}, [country, metadata])
		return (
			<Input
				{...rest}
				ref={ref}
				parse={parsePhoneNumberCharacter}
				format={format}/>
		)
	}

	InputSmart = React.forwardRef(InputSmart)

	InputSmart.propTypes = {
		/**
		 * A two-letter country code for formatting `value`
		 * as a national phone number (e.g. `(800) 555 35 35`).
		 * E.g. "US", "RU", etc.
		 * If no `country` is passed then `value`
		 * is formatted as an international phone number.
		 * (e.g. `+7 800 555 35 35`)
		 * Perhaps the `country` property should have been called `defaultCountry`
		 * because if `value` is an international number then `country` is ignored.
		 */
		country: PropTypes.string,

		/**
		 * If `country` property is passed along with `international={true}` property
		 * then the phone number will be input in "international" format for that `country`
		 * (without "country calling code").
		 * For example, if `country="US"` property is passed to "without country select" input
		 * then the phone number will be input in the "national" format for `US` (`(213) 373-4253`).
		 * But if both `country="US"` and `international={true}` properties are passed then
		 * the phone number will be input in the "international" format for `US` (`213 373 4253`)
		 * (without "country calling code" `+1`).
		 */
		international: PropTypes.bool,

		/**
		 * `libphonenumber-js` metadata.
		 */
		metadata: PropTypes.object.isRequired
	}

	InputSmart.defaultProps = {
		metadata: defaultMetadata
	}

	return InputSmart
}

export default createInput()