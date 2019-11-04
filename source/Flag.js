import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import { getCountryCodeForFlag } from './countries'

// Default country flag icon.
// `<img/>` is wrapped in a `<div/>` to prevent SVGs from exploding in size in IE 11.
// https://github.com/catamphetamine/react-phone-number-input/issues/111
const FlagComponent = ({ country, flags, flagsPath, className }) =>
{
	if (flags && flags[country]) {
		return flags[country]()
	}
	return (
		<img
			alt={country}
			className="react-phone-number-input__icon-image"
			src={`${flagsPath}${getCountryCodeForFlag(country).toLowerCase()}.svg`}/>
	)
}

FlagComponent.propTypes =
{
	// The country to be selected by default.
	// Two-letter country code ("ISO 3166-1 alpha-2").
	country : PropTypes.string.isRequired,

	// Country flag icon components.
	// By default flag icons are inserted as `<img/>`s
	// with their `src` pointed to `flag-icon-css` github repo.
	// There might be cases (e.g. an offline application)
	// where having a large (3 megabyte) `<svg/>` flags
	// bundle is more appropriate.
	// `import flags from 'react-phone-number-input/flags'`.
	flags : PropTypes.objectOf(PropTypes.element),

	// A base URL path for national flag SVG icons.
	// By default it uses the ones from `flag-icon-css` github repo.
	flagsPath : PropTypes.string.isRequired
}

export default FlagComponent