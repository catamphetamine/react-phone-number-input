import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

// Could have been `import { Select } from 'react-responsive-ui'`
// but in that case Webpack bundles the whole `react-responsive-ui` package.
import Select from 'react-responsive-ui/commonjs/Select'

export default class CountrySelectReactResponsiveUI extends Component
{
	static defaultProps =
	{
		// Whether to use native country `<select/>` when it's expanded.
		// Deprecated. Use `<PhoneInputNative/>` instead.
		nativeExpanded: false,

		// If set to `false`, then country flags will be shown
		// for all countries when country `<select/>` is expanded.
		// By default shows flag only for currently selected country.
		// (is `true` by default to save user's traffic
		//  because all flags are about 3 MegaBytes)
		saveOnIcons: true
	}

	// storeSelectRef = (ref) => this.select = ref
	// ref={ this.storeSelectRef }

	render()
	{
		const
		{
			name,
			value,
			onChange,
			options,
			disabled,
			tabIndex,
			className,
			// Optional properties:
			hidePhoneInputField,
			// focusPhoneInputField,
			// `<Select/>`-specific properties:
			ariaLabel,
			closeAriaLabel,
			saveOnIcons,
			nativeExpanded,
			maxItems,
			inputClassName,
			toggleClassName
		}
		= this.props

		return (
			<Select
				name={ name }
				value={ value }
				onChange={ onChange }
				onInput={ onChange }
				options={ options }
				disabled={ disabled }
				tabIndex={ tabIndex }
				className={ classNames(className,
				{
					'react-phone-number-input__country--native-expanded' : nativeExpanded
				}) }
				onToggle={ hidePhoneInputField }
				onTabOut={ this.onTabOut }
				ariaLabel={ ariaLabel }
				closeAriaLabel={ closeAriaLabel }
				saveOnIcons={ saveOnIcons }
				nativeExpanded={ nativeExpanded }
				maxItems={ maxItems }
				inputClassName={ inputClassName }
				toggleClassName={ toggleClassName }
				focusUponSelection={ false }
				concise
				autocomplete
				autocompleteShowAll/>
		)
	}

	// Focuses phone number `<input/>` field
	// on tab out of the country `<select/>`.
	onTabOut = (event) =>
	{
		const { focusPhoneInputField } = this.props

		event.preventDefault()

		// Focus the phone number input upon country selection
		// (do it in a timeout because the `<input/>`
		//  is hidden while selecting a country)
		setTimeout(focusPhoneInputField, 0)
	}

	// toggle()
	// {
	// 	this.select.toggle()
	// }
}