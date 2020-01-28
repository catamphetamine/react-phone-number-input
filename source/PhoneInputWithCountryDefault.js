import React from 'react'
import PropTypes from 'prop-types'

import labels from '../locale/en.json'

import {
	metadata as metadataPropType,
	labels as labelsPropType
} from './PropTypes'

import PhoneInput from './PhoneInputWithCountry'
import { CountrySelectWithIcon as CountrySelect } from './CountrySelect'

export function createPhoneInput(defaultMetadata) {
	const PhoneInputDefault = React.forwardRef((props, ref) => (
		<PhoneInput ref={ref} {...props}/>
	))

	PhoneInputDefault.propTypes = {
		metadata: metadataPropType.isRequired,
		labels: labelsPropType.isRequired,
		countrySelectComponent: PropTypes.elementType.isRequired
	}

	PhoneInputDefault.defaultProps = {
		metadata: defaultMetadata,
		labels,
		countrySelectComponent: CountrySelect
	}

	return PhoneInputDefault
}

export default createPhoneInput()