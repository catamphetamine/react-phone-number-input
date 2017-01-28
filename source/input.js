import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom'
import { as_you_type, parse, format } from 'libphonenumber-js/custom.es6'
import { ReactInput } from 'input-format'
import classNames from 'classnames'

// Not importing here directly from `react-responsive-ui` npm package
// just to reduce the overall bundle size.
import { Select } from './react-responsive-ui'

import country_names from './country names'
import International_icon from './international icon'

// A list of all country codes
const all_countries = []

// Country code to country name map
const default_dictionary =
{
	International: 'International'
}

// Populate `all_countries` and `default_dictionary`
for (const item of country_names)
{
	const [code, name] = item

	all_countries.push(code.toUpperCase())
	default_dictionary[code.toUpperCase()] = name
}

// Allows passing custom `libphonenumber-js` metadata
// to reduce the overall bundle size.
export default function create_phone_number_input_with_metadata(metadata)
{
	const parse_phone_number = parse.bind({ metadata })
	const format_phone_number = format.bind({ metadata })
	const as_you_type_formatter = as_you_type(metadata)

	return class Input extends Component
	{
		static propTypes =
		{
			// Phone number `value`.
			// Is a plaintext international phone number
			// (e.g. "+12223333333" for USA)
			value : PropTypes.string,

			// This handler is called each time
			// the phone number <input/> changes its textual value.
			onChange : PropTypes.func.isRequired,

			// This `onBlur` interceptor is a workaround for `redux-form`,
			// so that it gets a parsed `value` in its `onBlur` handler,
			// not the formatted one.
			// (`redux-form` passed `onBlur` to this component
			//  and this component intercepts that `onBlur`
			//  to make sure it works correctly with `redux-form`)
			onBlur : PropTypes.func,

			// Disables both the <input/> and the <select/>
			// (is `false` by default)
			disabled : PropTypes.bool.isRequired,

			// Two-letter country code
			// to be used as the default country
			// for local (non-international) phone numbers.
			country : PropTypes.string,

			// Is called when the selected country changes
			// (either by a user manually, or by autoparsing
			//  an international phone number being input).
			// This handler does not need to update the `country` property.
			// It's simply a listener for those who might need that for whatever purpose.
			onCountryChange : PropTypes.func,

			// Localization dictionary:
			// `{ International: 'Международный', RU: 'Россия', US: 'США', ... }`
			dictionary : PropTypes.objectOf(PropTypes.string),

			// An optional list of allowed countries
			countries : PropTypes.arrayOf(PropTypes.string).isRequired,

			// Custom national flag icons
			flags : PropTypes.oneOfType
			([
				PropTypes.objectOf(React.PropTypes.element),
				PropTypes.bool
			]),

			// A base URL path for national flag SVG icons.
			// By default it uses the ones from `flag-icon-css` github repo.
			flagsPath : PropTypes.string.isRequired,

			// If set to `false`, then country flags will be shown
			// for all countries in the options list
			// (not just for selected country).
			saveOnIcons : PropTypes.bool.isRequired,

			// Whether to add the "International" option
			// to the list of countries.
			international : PropTypes.bool,

			// Custom "International" phone number type icon.
			internationalIcon : PropTypes.element.isRequired,

			// CSS style object
			style : PropTypes.object,

			// CSS class
			className : PropTypes.string
		}

		static defaultProps =
		{
			// Is enabled
			disabled: false,

			// Include all countries by default
			countries: all_countries,

			// By default use the ones from `flag-icon-css` github repo.
			flagsPath: 'https://lipis.github.io/flag-icon-css/flags/4x3/',

			// Default international icon (globe)
			internationalIcon: <div className="react-phone-number-input__icon react-phone-number-input__icon--international"><International_icon/></div>,

			// Custom country names
			dictionary: {},

			// Don't show flags for all countries in the options list
			// (show it just for selected country).
			// (to save user's traffic because all flags are about 3 MegaBytes)
			saveOnIcons: true
		}

		state = {}

		constructor(props)
		{
			super(props)

			const
			{
				countries,
				value,
				dictionary,
				international,
				internationalIcon,
				flags
			}
			= props

			let { country } = props

			// If there will be no "International" option
			// then a `country` must be selected.
			if (!should_add_international_option(props) && !country)
			{
				country = countries[0]
			}

			// Set the currently selected country
			this.state.country_code = country

			// If a phone number `value` is passed then format it
			if (value)
			{
				// Set the currently entered `value`
				this.state.value = this.correct_initial_value_if_neccessary(value, country)
			}

			// `<Select/>` options
			this.select_options = []

			// Add the "International" option to the country list (if suitable)
			if (should_add_international_option(props))
			{
				this.select_options.push
				({
					label : from_dictionary('International', props),
					icon  : flags === false ? undefined : internationalIcon
				})
			}

			// Add a `<Select/>` option for each country
			for (const country_code of countries)
			{
				this.select_options.push
				({
					value : country_code,
					label : from_dictionary(country_code, props),
					icon  : get_country_option_icon(country_code, props)
				})
			}

			this.on_key_down = this.on_key_down.bind(this)
			this.on_change   = this.on_change.bind(this)
			this.set_country = this.set_country.bind(this)
			this.parse       = this.parse.bind(this)
			this.format      = this.format.bind(this)

			this.country_select_toggled    = this.country_select_toggled.bind(this)
			this.on_country_select_tab_out = this.on_country_select_tab_out.bind(this)
		}

		// If the country code is specified
		//   If the value has a leading plus sign
		//     If it converts into a valid national number for this country
		//       Then the value is set to be that national number
		//     Else
		//       The leading + sign is trimmed
		//   Else
		//     The value stays as it is
		// Else
		//   If the value has a leading + sign
		//     The value stays as it is
		//   Else
		//     The + sign is prepended
		//
		correct_initial_value_if_neccessary(value, country_code)
		{
			if (!value)
			{
				return
			}

			// If the country code is specified
			if (country_code)
			{
				// If the value has a leading plus sign
				if (value[0] === '+')
				{
					// If it's a fully-entered phone number
					// that converts into a valid national number for this country
					// then the value is set to be that national number.

					const parsed = parse_phone_number(value)

					if (parsed.country === country_code)
					{
						return this.format(parsed.phone, country_code).text
					}

					// Else the leading + sign is trimmed.
					return value.slice(1)
				}

				// Else the value stays as it is
				return value
			}

			// The country is not set.
			// Assuming that's an international phone number.

			// If the value has a leading + sign
			if (value[0] === '+')
			{
				// The value is correct
				return value
			}

			// The + sign is prepended
			return '+' + value
		}

		set_country_code_value(country_code)
		{
			const { onCountryChange } = this.props

			if (onCountryChange)
			{
				onCountryChange(country_code)
			}

			this.setState({ country_code })
		}

		// `<select/>` `onChange` handler
		set_country(country_code)
		{
			// Previously selected country
			const previous_country_code = this.state.country_code

			this.set_country_code_value(country_code)

			// Adjust the phone number (`value`)
			// according to the selected `country_code`

			let { value } = this.state

			// If switching to a country from International
			//   If the international number belongs to this country
			//     Convert it to a national number
			//   Else
			//     Trim the leading + sign
			//
			// If switching to a country from a country
			//   If the value has a leading + sign
			//     If the international number belongs to this country
			//       Convert it to a national number
			//     Else
			//       Trim the leading + sign
			//   Else
			//     The value stays as it is
			//
			// If switching to International from a country
			//   If the value has a leading + sign
			//     The value stays as it is
			//   Else
			//     Take the international plaintext value

			if (value)
			{
				// If switching to a country from International
				if (!previous_country_code && country_code)
				{
					// The value is international plaintext
					const parsed = parse_phone_number(value)

					// If it's for this country,
					// then convert it to a national number
					if (parsed.country === country_code)
					{
						value = this.format(parsed.phone, country_code).text
					}
					// Else just trim the + sign
					else
					{
						value = value.slice(1)
					}
				}

				if (previous_country_code && country_code)
				{
					if (value[0] === '+')
					{
						const parsed = parse_phone_number(value)

						if (parsed.country === country_code)
						{
							value = this.format(parsed.phone, country_code).text
						}
						else
						{
							value = value.slice(1)
						}
					}
				}

				// If switching to International from a country
				if (previous_country_code && !country_code)
				{
					// If no leading + sign
					if (value[0] !== '+')
					{
						// Take the international plaintext value
						value = format_phone_number(parse_partial_number(value, previous_country_code).national_number, previous_country_code, 'International_plaintext')
					}
				}

				// Update the adjusted `value`
				// and update `this.props.value` (in e.164 phone number format)
				// according to the new `this.state.value`.
				// (keep them in sync)
				this.on_change(value, country_code)
			}

			// Focus the phone number input upon country selection
			// (do it in a timeout because the `<input/>`
			//  is hidden while selecting a country)
			setTimeout(() => ReactDOM.findDOMNode(this.input).focus(), 0)
		}

		// `input-format` `parse` character function
		// https://github.com/halt-hammerzeit/input-format
		parse(character, value)
		{
			const { countries } = this.props

			if (character === '+')
			{
				// If the "International" option is available
				// then allow the leading `+`.
				if (should_add_international_option(this.props) && !value)
				{
					return character
				}
			}
			// Allow digits
			else if (character >= '0' && character <= '9')
			{
				return character
			}
		}

		// `input-format` `format` function
		// https://github.com/halt-hammerzeit/input-format
		format(value, country_code = this.state.country_code)
		{
			// `value` is already parsed input, i.e.
			// either International plaintext phone number
			// or just local phone number digits.

			// "As you type" formatter
			const formatter = new as_you_type_formatter(country_code)

			// Is used to check if a country code can already be derived
			this.formatter = formatter

			// Format phone number
			const text = formatter.input(value)

			return { text, template: formatter.template }
		}

		// `<input/>` `onKeyDown` handler
		on_key_down(event)
		{
			// Expand country `<select/>`` on "Down arrow" key press
			if (event.keyCode === 40)
			{
				this.select.toggle()
			}
		}

		// `<input/>` `onChange` handler.
		// Updates `this.props.value` (in e.164 phone number format)
		// according to the new `this.state.value`.
		// (keeps them in sync)
		on_change(value, country_code = this.state.country_code)
		{
			const { onChange } = this.props

			// If the `<input/>` is empty then just exit
			if (!value)
			{
				this.setState({ value })
				return onChange(value)
			}

			// If a phone number is being input as an international one
			// and the country code can already be derived,
			// then switch the country.
			// (`001` is a special "non-geograpical entity" code in `libphonenumber` library)
			if (value[0] === '+' && this.formatter.country && this.formatter.country !== '001')
			{
				country_code = this.formatter.country
				this.set_country_code_value(country_code)
			}

			// If "International" mode is selected
			// and the `value` doesn't start with a + sign,
			// then prepend it to the `value`.
			if (value[0] !== '+' && !country_code)
			{
				value = '+' + value
			}

			// Convert `value` to E.164 phone number format
			// and write it to `this.props.value`.
			onChange(e164(value, country_code))

			// Update the `value`
			this.setState({ value })
		}

		// When country `<select/>` is toggled
		country_select_toggled(is_shown)
		{
			this.setState({ country_select_is_shown: is_shown })
		}

		// Focuses the `<input/>` field
		// on tab out of the country `<select/>`
		on_country_select_tab_out(event)
		{
			event.preventDefault()

			// Focus the phone number input upon country selection
			// (do it in a timeout because the `<input/>`
			//  is hidden while selecting a country)
			setTimeout(() => ReactDOM.findDOMNode(this.input).focus(), 0)
		}

		// Can a user change the default country or not.
		can_change_country()
		{
			const { countries } = this.props

			// If `countries` is empty,
			// then only "International" option is available,
			// so can't switch it.
			//
			// If `countries` is a single allowed country,
			// then cant's switch it.
			//
			return countries.length > 1
		}

		// Listen for default country property:
		// if it is set after the page loads
		// and the user hasn't selected a country yet
		// then select the default country.
		componentWillReceiveProps(new_props)
		{
			const { countries, country, value } = this.props

			// If the default country changed
			// (e.g. in case of IP detection)
			if (new_props.country !== country)
			{
				// If the phone number input field is currently empty
				// (e.g. not touched yet) then change the selected `country`
				// to the newly passed one (e.g. as a result of a GeoIP query)
				if (!value)
				{
					// If the passed `country` allowed then update it
					if (countries.indexOf(new_props.country) !== -1)
					{
						// Set the new `country`
						this.set_country(new_props.country)
					}
				}
			}
		}

		render()
		{
			const
			{
				dictionary,
				saveOnIcons,
				international,
				internationalIcon,
				country,
				countries,
				onCountryChange,
				flags,
				flagsPath,
				disabled,
				style,
				className,
				...input_props
			}
			= this.props

			const { country_select_is_shown } = this.state

			const markup =
			(
				<div style={ style } className={ classNames('react-phone-number-input', className,
				{
					'react-phone-number-input--valid': this.formatter && this.formatter.valid
				}) }>
					{ this.can_change_country() &&
						<Select
							ref={ ref => this.select = ref }
							value={ this.state.country_code }
							options={ this.select_options }
							onChange={ this.set_country }
							disabled={ disabled }
							onToggle={ this.country_select_toggled }
							onTabOut={ this.on_country_select_tab_out }
							autocomplete
							concise
							focusUponSelection={ false }
							saveOnIcons={ saveOnIcons }
							name={ input_props.name ? `${input_props.name}__country` : undefined }
							className="react-phone-number-input__country"
							style={ select_style }/>
					}

					{ !country_select_is_shown &&
						<ReactInput
							{ ...input_props }
							ref={ ref => this.input = ref }
							value={ this.state.value }
							onChange={ this.on_change }
							disabled={ disabled }
							type="tel"
							parse={ this.parse }
							format={ this.format }
							onKeyDown={ this.on_key_down }
							className={ classNames('react-phone-number-input__phone',
							{
								'react-phone-number-input__phone--valid': this.formatter && this.formatter.valid
							}) }
							style={ input_style }/>
					}
				</div>
			)

			return markup
		}
	}

	// Parses a partially entered phone number
	// and returns the national number so far.
	// Not using `libphonenumber-js`'s `parse`
	// function here because `parse` only works
	// when the number is fully entered,
	// and this one is for partially entered number.
	function parse_partial_number(value, country_code)
	{
		// "As you type" formatter
		const formatter = new as_you_type_formatter(country_code)

		// Input partially entered phone number
		formatter.input(value)

		// Return the parsed partial phone number
		// (has `.national_number`, `.country`, etc)
		return formatter
	}

	// Converts `value` to E.164 phone number format
	function e164(value, country_code)
	{
		// If the phone number is being input in a country-specific format
		//   If the value has a leading + sign
		//     The value stays as it is
		//   Else
		//     The value is converted to international plaintext
		// Else, the phone number is being input in an international format
		//   If the value has a leading + sign
		//     The value stays as it is
		//   Else
		//     The value is prepended with a + sign

		if (country_code)
		{
			if (value[0] === '+')
			{
				return value
			}

			const partial_national_number = parse_partial_number(value, country_code).national_number
			return format_phone_number(partial_national_number, country_code, 'International_plaintext')
		}

		if (value[0] === '+')
		{
			return value
		}

		return '+' + value
	}
}

const select_style =
{
	display       : 'inline-block',
	verticalAlign : 'bottom'
}

const input_style = select_style

// Gets country flag element by country code
function get_country_option_icon(country_code, { flags, flagsPath })
{
	if (flags === false)
	{
		return undefined
	}

	if (flags && flags[country_code])
	{
		return flags[country_code]
	}

	return <img
		className="react-phone-number-input__icon"
		src={`${flagsPath}${country_code.toLowerCase()}.svg`}/>
}

// Whether to add the "International" option to the list of countries
function should_add_international_option(properties)
{
	const { countries, international } = properties

	// If this behaviour is explicitly set, then do as it says.
	if (international !== undefined)
	{
		return international
	}

	// If `countries` is empty,
	// then only "International" option is available, so add it.
	if (countries.length === 0)
	{
		return true
	}

	// If `countries` is a single allowed country,
	// then don't add the "International" option
	// because it would make no sense.
	if (countries.length === 1)
	{
		return false
	}

	// Show the "International" option by default
	return true
}

// Gets a text from dictionary
function from_dictionary(key, properties)
{
	const { dictionary } = properties

	return dictionary[key] || default_dictionary[key]
}