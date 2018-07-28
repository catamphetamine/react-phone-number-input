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

		let selectedOption
		for (const option of options) {
			if (!option.divider && option.value === value) {
				selectedOption = option
			}
		}

		return (
			<div className={ classNames(className, 'react-phone-number-input__country--native') }>
				{ selectedOption && React.createElement(selectedOption.icon, ({ value })) }

				<select
					name={ name }
					value={ value || 'ZZ' }
					onChange={ this.onChange }
					disabled={ disabled }
					tabIndex={ tabIndex }
					className="react-phone-number-input__country-select">
					{options.map(({ value, label, divider }) => (
						<option
							key={ divider ? '|' : value || 'ZZ' }
							value={ divider ? '|' : value || 'ZZ' }
							disabled={ divider ? true : false }
							className={ divider ? 'react-phone-number-input__country-select-divider' : undefined }>
							{ label }
						</option>
					))}
				</select>

				<SelectArrow/>
			</div>
		)
	}
}