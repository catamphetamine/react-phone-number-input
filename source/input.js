import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom'
import { as_you_type, parse, format, metadata, get_phone_code } from 'libphonenumber-js'
import { ReactInput } from 'input-format'
import classNames from 'classnames'

// Not importing here directly from `react-responsive-ui` npm package
// just to reduce the overall bundle size.
import { Select } from './react-responsive-ui'

import country_names from './country names'
import International_icon from './international icon'

// Generate default country options list
const country_options = country_names.map(([value, label]) =>
({
	value : value.toUpperCase(),
	label
}))

export default class Input extends Component
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

		// Two-letter country code
		// to be used as the default country
		// for local (non-international) phone numbers.
		country : PropTypes.string,

		// Localization dictionary:
		// `{ International: 'Международный', RU: 'Россия', US: 'США', ... }`
		dictionary : PropTypes.objectOf(PropTypes.string),

		// A custom selectable options list.
		// May be used to show all country flags in the <select/> list.
		//
		// Example:
		//
		// SVG flags for all countries (3 MegaBytes in size).
		// Too big for the public internet, but may be suitable
		// for enterprise software (e.g. CRM systems).
		// import countriesWithFlags from 'react-phone-number-input/countries-with-flags'
		//
		// <Phone ... countries={countriesWithFlags}/>
		//
		// (and that should be working)
		//
		countries : PropTypes.arrayOf(PropTypes.shape
		({
			// Option value
			value : React.PropTypes.string.isRequired,
			// Option label
			label : React.PropTypes.string.isRequired,
			// Option icon
			icon  : React.PropTypes.element
		}))
		.isRequired,

		// If set to `false`, then country flags will be shown
		// for all countries in the options list
		// (not just for selected country).
		saveOnIcons : PropTypes.bool,

		// Custom "International" phone number type icon.
		internationalIcon : PropTypes.element.isRequired,

		// A base URL path for national flag SVG icons.
		// By default it uses the ones from `flag-icon-css` github repo.
		flagsPath : PropTypes.string.isRequired,

		// CSS style object
		style : PropTypes.object,

		// CSS class
		className : PropTypes.string
	}

	static defaultProps =
	{
		// By default use the ones from `flag-icon-css` github repo.
		flagsPath: 'https://lipis.github.io/flag-icon-css/flags/4x3/',

		// Default international icon (globe)
		internationalIcon: <div className="react-phone-number-input__icon react-phone-number-input__icon--international"><International_icon/></div>,

		// Default country labels
		countries: country_options,

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

		// If the default country is set, then populate it
		this.state.country_code = props.country

		if (props.value)
		{
			this.state.value = this.correct_initial_value_if_neccessary(props.value, props.country)
		}

		// Set country option icons (national flags)
		// for those option list items
		// which don't have an icon set.
		for (const country_option of props.countries)
		{
			if (!country_option.icon)
			{
				country_option.icon = <img className="react-phone-number-input__icon" src={`${props.flagsPath}${country_option.value.toLowerCase()}.svg`}/>
			}
		}

		this.on_key_down = this.on_key_down.bind(this)
		this.on_change   = this.on_change.bind(this)
		this.set_country = this.set_country.bind(this)
		this.parse       = this.parse.bind(this)
		this.format      = this.format.bind(this)
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
	//   If the value has a leading plus sign
	//     The value stays as it is
	//   Else
	//     The plus sign is prepended
	//
	correct_initial_value_if_neccessary(value, country_code)
	{
		if (!value)
		{
			return
		}

		if (country_code)
		{
			if (value[0] === '+')
			{
				const parsed = parse(value)

				if (parsed.country === country_code)
				{
					return this.format(parsed.phone, country_code).text
				}
				else
				{
					return value.slice(1)
				}
			}
		}
		else
		{
			if (value[0] !== '+')
			{
				return '+' + value
			}
		}

		return value
	}

	set_country(country_code)
	{
		const previous_country_code = this.state.country_code

		if (country_code === '-')
		{
			country_code = undefined
		}

		this.setState({ country_code })

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
			if (!previous_country_code && country_code)
			{
				// The value is international plaintext
				const parsed = parse(value)

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
					const parsed = parse(value)

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

			if (previous_country_code && !country_code)
			{
				if (value[0] !== '+')
				{
					value = format(parse_national_number(value, previous_country_code), previous_country_code, 'International_plaintext')
				}
			}

			this.on_change(value, country_code)
		}

		// Focus the phone number input upon country selection
		// (do it in a timeout because of autocomplete's own focus timeout)
		ReactDOM.findDOMNode(this.input).focus()
	}

	parse(character, value)
	{
		if (character === '+')
		{
			// Only leading '+' is allowed
			if (!value)
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

	format(value, country_code = this.state.country_code)
	{
		// `value` is already parsed input, i.e.
		// either International plaintext phone number
		// or just local phone number digits.

		// "As you type" formatter
		const formatter = new as_you_type(country_code)

		// Is used to check if a country code can already be derived
		this.formatter = formatter

		// Format phone number
		const text = formatter.input(value)

		return { text, template: formatter.template }
	}

	on_key_down(event)
	{
		// on "Down arrow"
		if (event.keyCode === 40)
		{
			this.select.toggle()
		}
	}

	on_change(value, country_code = this.state.country_code)
	{
		const { onChange } = this.props

		if (!value)
		{
			this.setState({ value })
			return onChange(value)
		}

		// If a phone number is being input as an international one
		// and the country code can already be derived,
		// then switch the country.
		if (value && value[0] === '+' && this.formatter.country && this.formatter.country !== '001')
		{
			this.setState({ country_code: this.formatter.country })
		}

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
				onChange(value)
			}
			else
			{
				onChange(format(parse_national_number(value, country_code), country_code, 'International_plaintext'))
			}
		}
		else
		{
			if (value[0] === '+')
			{
				onChange(value)
			}
			else
			{
				value = '+' + value
				onChange(value)
			}
		}

		this.setState({ value })
	}

	render()
	{
		const
		{
			dictionary,
			saveOnIcons,
			countries,
			internationalIcon,
			country,
			flagsPath,
			style,
			className,
			...input_props
		}
		= this.props

		const items =
		[{
			value : '-',
			label : dictionary.International || 'International',
			icon  : internationalIcon
		}]
		.concat(countries || country_options)

		const markup =
		(
			<div style={style} className={classNames('react-phone-number-input', className)}>
				<Select
					ref={ref => this.select = ref}
					autocomplete
					concise
					focusUponSelection={false}
					saveOnIcons={saveOnIcons === undefined ? !countries : saveOnIcons}
					name={input_props.name ? `${input_props.name}__country` : undefined}
					value={this.state.country_code || '-'}
					options={items}
					onChange={this.set_country}/>

				<ReactInput
					{...input_props}
					value={this.state.value}
					onChange={this.on_change}
					ref={ref => this.input = ref}
					type="tel"
					parse={this.parse}
					format={this.format}
					onKeyDown={this.on_key_down}/>
			</div>
		)

		return markup
	}
}

function parse_national_number(value, country_code)
{
	// "As you type" formatter
	const formatter = new as_you_type(country_code)

	// Format phone number
	formatter.input(value)

	return formatter.national_number
}