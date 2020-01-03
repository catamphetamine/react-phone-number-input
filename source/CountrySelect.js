import React, { useCallback, useMemo } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import getUnicodeFlagIcon from 'country-flag-icons/unicode'

export default function CountrySelect({
	value,
	onChange,
	options,
	className,
	iconComponent: Icon,
	getIconAspectRatio,
	arrowComponent: Arrow,
	unicodeFlags,
	...rest
}) {
	const onChange_ = useCallback((event) => {
		const value = event.target.value
		onChange(value === 'ZZ' ? undefined : value)
	}, [onChange])

	const selectedOption = useMemo(() => {
		for (const option of options) {
			if (!option.divider && option.value === value) {
				return option
			}
		}
	}, [options, value])

	// "ZZ" means "International".
	// (HTML requires each `<option/>` have some string `value`).
	return (
		<div className="PhoneInputCountry">
			<select
				{...rest}
				value={value || 'ZZ'}
				onChange={onChange_}
				className="PhoneInputCountrySelect">
				{options.map(({ value, label, divider }) => (
					<option
						key={divider ? '|' : value || 'ZZ'}
						value={divider ? '|' : value || 'ZZ'}
						disabled={divider ? true : false}
						className={divider ? 'PhoneInputCountrySelectDivider' : undefined}>
						{label}
					</option>
				))}
			</select>

			{/* Either a Unicode flag icon. */}
			{(unicodeFlags && value) &&
				<div className="PhoneInputCountryIcon PhoneInputCountryIcon--square PhoneInputCountryIcon--unicode">
					{getUnicodeFlagIcon(value)}
				</div>
			}

			{/* Or an SVG flag icon. */}
			{!(unicodeFlags && value) &&
				<Icon
					country={value}
					label={selectedOption && selectedOption.label}
					aspectRatio={unicodeFlags ? 1 : undefined}/>
			}

			<Arrow/>
		</div>
	)
}

CountrySelect.propTypes = {
	// A two-letter country code.
	// E.g. "US", "RU", etc.
	value: PropTypes.string,

	// Updates the `value`.
	onChange: PropTypes.func.isRequired,

	// `<select/>` options.
	options: PropTypes.arrayOf(PropTypes.shape({
		value: PropTypes.string,
		label: PropTypes.string,
		divider : PropTypes.bool
	})).isRequired,

	// Country flag component.
	iconComponent: PropTypes.elementType,

	// Select arrow component.
	arrowComponent: PropTypes.elementType.isRequired,

	// Set to `true` to render Unicode flag icons instead of SVG images.
	unicodeFlags: PropTypes.bool
}

CountrySelect.defaultProps = {
	// Is "International" icon square?
	arrowComponent: () => <div className="PhoneInputCountrySelectArrow"/>
}
