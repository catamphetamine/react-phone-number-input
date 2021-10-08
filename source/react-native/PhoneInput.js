import React from 'react'

import PhoneTextInput from './PhoneTextInput'
import PhoneInput_ from '../PhoneInput'
import InputBasic from '../InputBasic'

import { metadata as metadataType } from '../PropTypes'

/**
 * This is an _experimental_ React Native component.
 * Feedback thread: https://github.com/catamphetamine/react-phone-number-input/issues/296
 */
export function createPhoneInput(defaultMetadata) {
	let PhoneInput = ({ inputComponent, ...rest }, ref) => (
		<PhoneInput_
			{...props}
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