import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

export default class CountrySelectNative extends Component
{
	static propTypes =
	{
		// A two-letter country code.
		// E.g. "US", "RU", etc.
		value : PropTypes.string,

		// Updates the `value`.
		onChange : PropTypes.func.isRequired,

		// `<select/>` options.
		options : PropTypes.arrayOf(PropTypes.shape({
			value : PropTypes.string,
			label : PropTypes.string,
			divider : PropTypes.bool
		})).isRequired,

		// HTML `name` attribute.
		name : PropTypes.string,

		// HTML `disabled` attribute.
		disabled : PropTypes.bool,

		// HTML `tabIndex` attribute.
		tabIndex : PropTypes.number,

		// Select arrow component.
		selectArrowComponent : PropTypes.element.isRequired,

		// Toggles the `--focus` CSS class.
		// https://github.com/catamphetamine/react-phone-number-input/issues/189
		onFocus : PropTypes.func,

		// Toggles the `--focus` CSS class.
		// https://github.com/catamphetamine/react-phone-number-input/issues/189
		onBlur : PropTypes.func
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
			onFocus,
			onBlur,
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
					onFocus={ onFocus }
					onBlur={ onBlur }
					disabled={ disabled }
					tabIndex={ tabIndex }
					aria-label={ this.props['aria-label'] }
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