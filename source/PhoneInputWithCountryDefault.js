import React from 'react'
import PropTypes from 'prop-types'

import labels from '../locale/en.json.js'

import {
	metadata as metadataPropType,
	labels as labelsPropType
} from './PropTypes.js'

import PhoneInput from './PhoneInputWithCountry.js'

export function createPhoneInput(defaultMetadata) {
	const PhoneInputDefault = React.forwardRef((props, ref) => (
		<PhoneInput ref={ref} {...props}/>
	))

	PhoneInputDefault.propTypes = {
		metadata: metadataPropType.isRequired,
		labels: labelsPropType.isRequired
	}

	PhoneInputDefault.defaultProps = {
		metadata: defaultMetadata,
		labels
	}

	return PhoneInputDefault
}

export default createPhoneInput()