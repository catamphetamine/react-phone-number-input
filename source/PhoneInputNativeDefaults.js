import React, { Component } from 'react'
import PropTypes from 'prop-types'

import labels from '../locale/en.json'
import internationalIcon from './InternationalIcon'

import {
	metadata as metadataPropType,
	labels as labelsPropType
} from './PropTypes'

import PhoneInput from './PhoneInputNative'

export function createPhoneInput(defaultMetadata)
{
	return class PhoneInputNativeDefaults extends Component
	{
		static propTypes =
		{
			metadata : metadataPropType.isRequired,
			labels : labelsPropType.isRequired,
			internationalIcon : PropTypes.elementType.isRequired
		}

		static defaultProps =
		{
			metadata: defaultMetadata,
			labels,
			internationalIcon
		}

		storeInputRef = (ref) => this.input = ref
		render = () => <PhoneInput ref={this.storeInputRef} {...this.props}/>
		focus = () => this.input.focus()
	}
}

export default createPhoneInput()