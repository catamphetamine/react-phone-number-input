import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

// Default country flag icon.
// `<img/>` is wrapped in a `<div/>` to prevent SVGs from exploding in size in IE 11.
// https://github.com/catamphetamine/react-phone-number-input/issues/111
export default function FlagComponent({
	country,
	countryName,
	flags,
	flagUrl,
	...rest
}) {
	if (flags && flags[country]) {
		return flags[country]({ title: countryName })
	}
	return (
		<img
			{...rest}
			alt={countryName}
			role={countryName ? undefined : "presentation"}
			src={flagUrl.replace('{XX}', country).replace('{xx}', country.toLowerCase())}/>
	)
}

FlagComponent.propTypes = {
	// The country to be selected by default.
	// Two-letter country code ("ISO 3166-1 alpha-2").
	country: PropTypes.string.isRequired,

	// Will be HTML `title` attribute of the `<img/>`.
	countryName: PropTypes.string.isRequired,

	// Country flag icon components.
	// By default flag icons are inserted as `<img/>`s
	// with their `src` pointed to `country-flag-icons` gitlab pages website.
	// There might be cases (e.g. an offline application)
	// where having a large (3 megabyte) `<svg/>` flags
	// bundle is more appropriate.
	// `import flags from 'react-phone-number-input/flags'`.
	flags: PropTypes.objectOf(PropTypes.elementType),

	// A URL for a country flag icon.
	// By default it points to `country-flag-icons` gitlab pages website.
	flagUrl: PropTypes.string.isRequired
}
