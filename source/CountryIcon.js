import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import DefaultInternationalIcon from './InternationalIcon'
import Flag from './Flag'

export function createCountryIconComponent({
	flags,
	flagUrl,
	flagComponent: FlagComponent,
	internationalIcon: InternationalIcon
}) {
	function CountryIcon({
		country,
		label,
		aspectRatio
	}) {
		return (
			<div
				className={classNames('PhoneInputCountryIcon', {
					'PhoneInputCountryIcon--square': aspectRatio === 1,
					'PhoneInputCountryIcon--border': country
				})}>
				{
					country
					?
					<FlagComponent
						country={country}
						countryName={label}
						flags={flags}
						flagUrl={flagUrl}/>
					:
					<InternationalIcon
						title={label}
						aspectRatio={InternationalIcon === DefaultInternationalIcon ? aspectRatio : undefined}/>
				}
			</div>
		)
	}

	CountryIcon.propTypes = {
		country: PropTypes.string.isRequired,
		label: PropTypes.string.isRequired,
		aspectRatio: PropTypes.number
	}

	return CountryIcon
}

export default createCountryIconComponent({
	// Must be equal to `defaultProps.flagUrl` in `./PhoneInputWithCountry.js`.
	flagUrl: 'https://catamphetamine.github.io/country-flag-icons/3x2/{XX}.svg',
	flagComponent: Flag,
	internationalIcon: DefaultInternationalIcon
})