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
	flagUrl: 'https://catamphetamine.github.io/react-phone-number-input/flags/3x2/{0}.svg',
	flagComponent: Flag,
	internationalIcon: InternationalIcon
})