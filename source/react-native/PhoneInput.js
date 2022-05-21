import React from 'react'
import PropTypes from 'prop-types'

import PhoneTextInput from './PhoneTextInput.js'
import PhoneInput_ from '../PhoneInput.js'
import InputBasic from '../InputBasic.js'

import { metadata as metadataType } from '../PropTypes.js'

/**
 * This is an _experimental_ React Native component.
 * Feedback thread: https://github.com/catamphetamine/react-phone-number-input/issues/296
 */
export function createPhoneInput(defaultMetadata) {
	let PhoneInput = ({ inputComponent, ...rest }, ref) => (
		<PhoneInput_
			{...rest}
			ref={ref}
			Component={InputBasic}
			inputComponent={PhoneTextInput}
			TextInputComponent={inputComponent} />
	)

	PhoneInput = React.forwardRef(PhoneInput)

	PhoneInput.propTypes = {
		/**
		 * Allows specifying a custom input field component,
		 * like a "Material UI" input field or something.
		 */
		inputComponent: PropTypes.elementType,

		/**
		 * `libphonenumber-js` metadata.
		 */
		metadata: metadataType.isRequired
	}

	PhoneInput.defaultProps = {
		/**
		 * `libphonenumber-js` metadata.
		 */
		metadata: defaultMetadata
	}

	return PhoneInput
}

export default createPhoneInput()