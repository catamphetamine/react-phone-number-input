import React, { useCallback, useMemo } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import getUnicodeFlagIcon from 'country-flag-icons/unicode'

export default function CountrySelect({
	value,
	onChange,
	options,
	...rest
}) {
	const onChange_ = useCallback((event) => {
		const value = event.target.value
		onChange(value === 'ZZ' ? undefined : value)
	}, [onChange])

	const selectedOption = useMemo(() => {
		return getSelectedOption(options, value)
	}, [options, value])

	// "ZZ" means "International".
	// (HTML requires each `<option/>` have some string `value`).
	return (
		<select
			{...rest}
			value={value || 'ZZ'}
			onChange={onChange_}>
			{options.map(({ value, label, divider }) => (
				<option
					key={divider ? '|' : value || 'ZZ'}
					value={divider ? '|' : value || 'ZZ'}
					disabled={divider ? true : false}
					style={divider ? DIVIDER_STYLE : undefined}>
					{label}
				</option>
			))}
		</select>
	)
}

CountrySelect.propTypes = {
	/**
	 * A two-letter country code.
	 * Example: "US", "RU", etc.
	 */
	value: PropTypes.string,

	/**
	 * A function of `value: string`.
	 * Updates the `value` property.
	 */
	onChange: PropTypes.func.isRequired,

	// `<select/>` options.
	options: PropTypes.arrayOf(PropTypes.shape({
		value: PropTypes.string,
		label: PropTypes.string,
		divider: PropTypes.bool
	})).isRequired
}

const DIVIDER_STYLE = {
	fontSize: '1px',
	backgroundColor: 'currentColor',
	color: 'inherit'
}

export function CountrySelectWithIcon({
	value,
	options,
	className,
	iconComponent: Icon,
	getIconAspectRatio,
	arrowComponent: Arrow,
	unicodeFlags,
	...rest
}) {
	const selectedOption = useMemo(() => {
		return getSelectedOption(options, value)
	}, [options, value])

	return (
		<div className="PhoneInputCountry">
			<CountrySelect
				{...rest}
				value={value}
				options={options}
				className={classNames('PhoneInputCountrySelect', className)}/>

			{/* Either a Unicode flag icon. */}
			{(unicodeFlags && value) &&
				<div className="PhoneInputCountryIconUnicode">
					{getUnicodeFlagIcon(value)}
				</div>
			}

			{/* Or an SVG flag icon. */}
			{!(unicodeFlags && value) &&
				<Icon
					aria-hidden
					country={value}
					label={selectedOption && selectedOption.label}
					aspectRatio={unicodeFlags ? 1 : undefined}/>
			}

			<Arrow/>
		</div>
	)
}

CountrySelectWithIcon.propTypes = {
	// Country flag component.
	iconComponent: PropTypes.elementType,

	// Select arrow component.
	arrowComponent: PropTypes.elementType.isRequired,

	// Set to `true` to render Unicode flag icons instead of SVG images.
	unicodeFlags: PropTypes.bool
}

CountrySelectWithIcon.defaultProps = {
	arrowComponent: () => <div className="PhoneInputCountrySelectArrow"/>
}

function getSelectedOption(options, value) {
	for (const option of options) {
		if (!option.divider && option.value === value) {
			return option
		}
	}
}