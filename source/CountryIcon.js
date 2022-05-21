import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import DefaultInternationalIcon from './InternationalIcon.js'
import Flag from './Flag.js'

export function createCountryIconComponent({
	flags,
	flagUrl,
	flagComponent: FlagComponent,
	internationalIcon: InternationalIcon
}) {
	function CountryIcon({
		country,
		label,
		aspectRatio,
		...rest
	}) {
		// `aspectRatio` is currently a hack for the default "International" icon
		// to render it as a square when Unicode flag icons are used.
		// So `aspectRatio` property is only used with the default "International" icon.
		const _aspectRatio = InternationalIcon === DefaultInternationalIcon ? aspectRatio : undefined
		return (
			<div
				{...rest}
				className={classNames('PhoneInputCountryIcon', {
					'PhoneInputCountryIcon--square': _aspectRatio === 1,
					'PhoneInputCountryIcon--border': country
				})}>
				{
					country
					?
					<FlagComponent
						country={country}
						countryName={label}
						flags={flags}
						flagUrl={flagUrl}
						className="PhoneInputCountryIconImg"/>
					:
					<InternationalIcon
						title={label}
						aspectRatio={_aspectRatio}
						className="PhoneInputCountryIconImg"/>
				}
			</div>
		)
	}

	CountryIcon.propTypes = {
		country: PropTypes.string,
		label: PropTypes.string.isRequired,
		aspectRatio: PropTypes.number
	}

	return CountryIcon
}

export default createCountryIconComponent({
	// Must be equal to `defaultProps.flagUrl` in `./PhoneInputWithCountry.js`.
	flagUrl: 'https://purecatamphetamine.github.io/country-flag-icons/3x2/{XX}.svg',
	flagComponent: Flag,
	internationalIcon: DefaultInternationalIcon
})