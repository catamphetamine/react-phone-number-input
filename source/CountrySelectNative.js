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

	// storeSelectRef = (ref) => this.select = ref
	// ref={ this.storeSelectRef }

	onChange = (event) =>
	{
		const { onChange } = this.props
		onChange(event.target.value)
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
			// `<select/>`-specific properties:
			selectArrowComponent : SelectArrow
		}
		= this.props

		const selectedOption = options.filter(option => option.value === value)[0] || options[0]
		const SelectedCountryFlag = selectedOption.icon

		return (
			<div className={ classNames(className, 'react-phone-number-input__country--native') }>
				<SelectedCountryFlag/>

				<select
					name={ name }
					value={ value }
					onChange={ this.onChange }
					disabled={ disabled }
					tabIndex={ tabIndex }
					className="react-phone-number-input__country-select">
					{options.map(({ value, label }) => (
						<option key={ value || '-' } value={ value }>
							{ label }
						</option>
					))}
				</select>

				<SelectArrow/>
			</div>
		)
	}

	// toggle()
	// {
	// 	this.select.click()
	// }
}