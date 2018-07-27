import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

export default class CountrySelectNative extends Component
{
	static propTypes =
	{
		selectArrowComponent : PropTypes.func.isRequired
	}

	static defaultProps =
	{
		selectArrowComponent : () => <div className="react-phone-number-input__country-select-arrow"/>
	}

	onChange = (event) =>
	{
		const { onChange } = this.props
		const value = event.target.value
		onChange(value === 'ZZ' ? undefined : value)
	}

	render()
	{
		const
		{
			name,
			value,
			options,
			disabled,
			tabIndex,
			className,
			selectArrowComponent : SelectArrow
		}
		= this.props

		const selectedOption = getSelectedOption(options, value)

		return (
			<div className={ classNames(className, 'react-phone-number-input__country--native') }>
				{ selectedOption && selectedOption.icon && React.createElement(selectedOption.icon) }

				<select
					name={ name }
					value={ value || 'ZZ' }
					onChange={ this.onChange }
					disabled={ disabled }
					tabIndex={ tabIndex }
					className="react-phone-number-input__country-select">
					{options.map(({ value, label, disabled, style, className }, i) => (
						<option
							key={ disabled ? i : value || '-' }
							value={ disabled ? undefined : value || 'ZZ' }
							disabled={ disabled }
							style={ style }
							className={ className }>
							{ label }
						</option>
					))}
				</select>

				<SelectArrow/>
			</div>
		)
	}
}

function getSelectedOption(options, value)
{
	for (const option of options)
	{
		if (!option.disabled && option.value === value)
		{
			return option
		}
	}

	for (const option of options)
	{
		if (!option.disabled)
		{
			return option
		}
	}
}