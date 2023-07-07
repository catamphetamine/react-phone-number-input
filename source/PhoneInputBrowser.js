import React from 'react'
import PropTypes from 'prop-types'

import PhoneInput_ from './PhoneInput.js'
import InputSmart from './InputSmart.js'
import InputBasic from './InputBasic.js'

export function createInput(defaultMetadata) {
	function PhoneInput({
		// `<input type="tel"/>`.
		type = 'tel',
		// Remember (and autofill) the value as a phone number.
		autoComplete = 'tel',
		smartCaret = true,
		metadata = defaultMetadata,
		...rest
	}, ref) {
		return (
			<PhoneInput_
				{...rest}
				type={type}
				autoComplete={autoComplete}
				metadata={metadata}
				ref={ref}
				Component={smartCaret ? InputSmart : InputBasic}
			/>
		)
	}

	PhoneInput = React.forwardRef(PhoneInput)

	PhoneInput.propTypes = {
		/**
		 * HTML `<input/>` `type` attribute.
		 */
		type: PropTypes.string,

		/**
		 * HTML `<input/>` `autocomplete` attribute.
		 */
		autoComplete: PropTypes.string,

		/**
		 * By default, the caret position is being "intelligently" managed
		 * while a user inputs a phone number.
		 * This "smart" caret behavior can be turned off
		 * by passing `smartCaret={false}` property.
		 * This is just an "escape hatch" for any possible caret position issues.
		 */
		// Is `true` by default.
		smartCaret: PropTypes.bool,

		/**
		 * `libphonenumber-js` metadata.
		 */
		metadata: PropTypes.object
	}

	return PhoneInput
}

export default createInput()