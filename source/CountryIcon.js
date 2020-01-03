import React from 'react'
import classNames from 'classnames'

import InternationalIcon from './InternationalIcon'
import Flag from './Flag'

export function createCountryIconComponent({
	flags,
	flagUrl,
	flagComponent: FlagComponent,
	internationalIcon: InternationalIcon
}) {
	return function CountryIcon({ country, label }) {
		return (
			<div
				className={classNames('PhoneInputCountryIcon', {
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
					<InternationalIcon title={label}/>
				}
			</div>
		)
	}
}

export default createCountryIconComponent({
	// Must be equal to `defaultProps.flagUrl` in `./PhoneInputWithCountry.js`.
	flagUrl: 'https://catamphetamine.github.io/country-flag-icons/3x2/{XX}.svg',
	flagComponent: Flag,
	internationalIcon: InternationalIcon
})