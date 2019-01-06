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
		saveOnIcons: true,

		// Toggles the `--focus` CSS class.
		// https://github.com/catamphetamine/react-phone-number-input/issues/189
		onFocus : PropTypes.func,

		// Toggles the `--focus` CSS class.
		// https://github.com/catamphetamine/react-phone-number-input/issues/189
		onBlur : PropTypes.func
	}

	render()
	{
		const
		{
			name,
			value,
			onChange,
			onFocus,
			onBlur,
			options,
			disabled,
			tabIndex,
			className,
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
				onFocus={ onFocus }
				onBlur={ onBlur }
				options={ options }
				disabled={ disabled }
				tabIndex={ tabIndex }
				className={ className }
				aria-label={ this.props['aria-label'] }
				saveOnIcons={ saveOnIcons }
				scrollMaxItems={ scrollMaxItems }
				toggleClassName={ toggleClassName }/>
		)
	}
}