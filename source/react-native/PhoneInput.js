import React from 'react'

import PhoneTextInput from './PhoneTextInput'
import PhoneInput_ from '../PhoneInput'

import { metadata as metadataType } from '../PropTypes'

/**
 * This is an _experimental_ React Native component.
 * Feedback thread: https://github.com/catamphetamine/react-phone-number-input/issues/296
 */
export function createPhoneInput(defaultMetadata) {
  let PhoneInput = (props, ref) => {
		return (
			<PhoneInput_
				{...props}
				ref={ref}
				smartCaret={false}
				inputComponent={PhoneTextInput} />
		)
	}

	PhoneInput = React.forwardRef(PhoneInput)

	PhoneInput.propTypes = {
		metadata: metadataType.isRequired
	}

	PhoneInput.defaultProps = {
		metadata: defaultMetadata
	}

	return PhoneInput
}

export default createPhoneInput()