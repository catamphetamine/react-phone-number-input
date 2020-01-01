import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import getFlagCountryCode from './getFlagCountryCode'

// Default country flag icon.
// `<img/>` is wrapped in a `<div/>` to prevent SVGs from exploding in size in IE 11.
// https://github.com/catamphetamine/react-phone-number-input/issues/111
export default function FlagComponent({
	country,
	flags,
	flagUrl,
	className
}) {
	if (flags && flags[country]) {
		return flags[country]()
	}
	return (
		<img
			alt={country}
			className="PhoneInputCountryIconImg"
			src={flagUrl.replace('{0}', getFlagCountryCode(country).toLowerCase())}/>
	)
}

FlagComponent.propTypes = {
	// The country to be selected by default.
	// Two-letter country code ("ISO 3166-1 alpha-2").
	country: PropTypes.string.isRequired,

	// Country flag icon components.
	// By default flag icons are inserted as `<img/>`s
	// with their `src` pointed to `flag-icon-css` github repo.
	// There might be cases (e.g. an offline application)
	// where having a large (3 megabyte) `<svg/>` flags
	// bundle is more appropriate.
	// `import flags from 'react-phone-number-input/flags'`.
	flags: PropTypes.objectOf(PropTypes.elementType),

	// A URL for a country flag icon.
	// By default it points to `flag-icon-css` github pages website.
	flagUrl: PropTypes.string.isRequired
}