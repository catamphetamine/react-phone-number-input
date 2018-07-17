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
		// If set to `false`, then country flags will be shown
		// for all countries when country `<select/>` is expanded.
		// By default shows flag only for currently selected country.
		// (is `true` by default to save user's traffic
		//  because all flags are about 3 MegaBytes)
		saveOnIcons: true
	}

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
			saveOnIcons,
			scrollMaxItems,
			toggleClassName
		}
		= this.props

		return (
			<Select
				icon
				name={ name }
				value={ value }
				onChange={ onChange }
				options={ options }
				disabled={ disabled }
				tabIndex={ tabIndex }
				className={ className }
				ariaLabel={ ariaLabel }
				saveOnIcons={ saveOnIcons }
				scrollMaxItems={ scrollMaxItems }
				toggleClassName={ toggleClassName }/>
		)
	}
}