import React from 'react'
import PropTypes from 'prop-types'

import defaultLabels from '../locale/en.json.js'

import {
	metadata as metadataPropType,
	labels as labelsPropType
} from './PropTypes.js'

import PhoneInput from './PhoneInputWithCountry.js'

export function createPhoneInput(defaultMetadata) {
	const PhoneInputDefault = React.forwardRef(({
		metadata = defaultMetadata,
		labels = defaultLabels,
		...rest
	}, ref) => (
		<PhoneInput
			{...rest}
			ref={ref}
			metadata={metadata}
			labels={labels}
		/>
	))

	PhoneInputDefault.propTypes = {
		metadata: metadataPropType,
		labels: labelsPropType
	}

	return PhoneInputDefault
}

export default createPhoneInput()