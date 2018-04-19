import React from 'react'
import PropTypes from 'prop-types'

// Default country flag icon.
// `<img/>` is wrapped in a `<div/>` to prevent SVGs from exploding in size.
// https://github.com/catamphetamine/react-phone-number-input/issues/111
const FlagComponent = ({ country, flags, flagsPath }) =>
{
	if (flags && flags[country])
	{
		return React.cloneElement(flags[country](),
		{
			className: 'react-phone-number-input__icon'
		})
	}

	return (
		<div className="react-phone-number-input__icon">
			<img
				alt={country}
				className="react-phone-number-input__icon-image"
				src={`${flagsPath}${country.toLowerCase()}.svg`}/>
		</div>
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
	flags : PropTypes.objectOf(PropTypes.func),

	// A base URL path for national flag SVG icons.
	// By default it uses the ones from `flag-icon-css` github repo.
	flagsPath : PropTypes.string.isRequired
}

export default FlagComponent