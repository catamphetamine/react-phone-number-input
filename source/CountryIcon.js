import React from 'react'
import classNames from 'classnames'

export default function createCountryIconComponent({
	flags,
	flagUrl,
	flagComponent: FlagComponent,
	internationalIcon: InternationalIcon
}) {
	return ({ country }) => (
		<div
			className={classNames('PhoneInputCountryIcon', {
				'PhoneInputCountryIcon--square': country === undefined
			})}>
			{
				country
				?
				<FlagComponent
					country={country}
					flags={flags}
					flagUrl={flagUrl}/>
				:
				<InternationalIcon/>
			}
		</div>
	)
}