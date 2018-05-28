import React, { Component } from 'react'
import classNames from 'classnames'

// Could have been `import { Select } from 'react-responsive-ui'`
// but in that case Webpack bundles the whole `react-responsive-ui` package.
import Select from 'react-responsive-ui/commonjs/Select'

export default class CountrySelectReactResponsiveUI extends Component
{
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
			onToggle,
			onTabOut,
			// Deprecated properties:
			ariaLabel,
			closeAriaLabel,
			saveOnIcons,
			nativeExpanded,
			countrySelectMaxItems,
			inputClassName,
			toggleClassName
		}
		= this.props

		return (
			<Select
				name={ name }
				value={ value }
				onChange={ onChange }
				options={ options }
				disabled={ disabled }
				tabIndex={ tabIndex }
				className={ classNames(className,
				{
					'react-phone-number-input__country--native-expanded' : nativeExpanded
				}) }
				onToggle={ onToggle }
				onTabOut={ onTabOut }
				ariaLabel={ ariaLabel }
				closeAriaLabel={ closeAriaLabel }
				saveOnIcons={ saveOnIcons }
				nativeExpanded={ nativeExpanded }
				maxItems={ countrySelectMaxItems }
				inputClassName={ inputClassName }
				toggleClassName={ toggleClassName }
				focusUponSelection={ false }
				concise
				autocomplete
				autocompleteShowAll/>
		)
	}

	// toggle()
	// {
	// 	this.select.toggle()
	// }
}