import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import PhoneInput from './PhoneInput'
import CountrySelect from './CountrySelectNative'

export default class PhoneInputNative extends Component
{
	static propTypes = {
		// (optional)
		// Replaces the default country select arrow.
		countrySelectArrowComponent : PropTypes.element
	}

	// These two country-select-related properties are
	// implemented as `defaultProps` instead of passing them
	// directly to the `<PhoneInput/>` because `<PhoneInputNative/>`
	// is the default export of this library and therefore people pass
	// `countrySelectComponent` property to this `<PhoneInputNative/>` component
	// and when they don't see any changes they might get confused.
	// https://github.com/catamphetamine/react-phone-number-input/issues/229
	static defaultProps = {
		countrySelectComponent: CountrySelect,
		countrySelectProperties: COUNTRY_SELECT_PROPERTIES
	}

	storeInputRef = (ref) => this.input = ref

	render() {
		return (
			<PhoneInput ref={this.storeInputRef} {...this.props}/>
		)
	}

	// Proxy `.focus()` method.
	focus = () => this.input.focus()
}

const COUNTRY_SELECT_PROPERTIES = {
	countrySelectArrowComponent : 'selectArrowComponent'
}