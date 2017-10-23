import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ReactDOM from 'react-dom'
import { as_you_type, parse, format, getPhoneCode, DIGITS } from 'libphonenumber-js'
import { ReactInput } from 'input-format'
import classNames from 'classnames'

// Could have been `import { Select } from 'react-responsive-ui'`
// but in that case Webpack bundles the whole `react-responsive-ui` package.
import Select from 'react-responsive-ui/commonjs/Select'

import country_names from './countries'
import InternationalIcon from './InternationalIcon'

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

// Default country flag icon
const FlagComponent = ({ countryCode, flagsPath }) => (
	<img
		alt={countryCode}
		className="react-phone-number-input__icon"
		src={`${flagsPath}${countryCode.toLowerCase()}.svg`}/>
)

// Allows passing custom `libphonenumber-js` metadata
// to reduce the overall bundle size.
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
		// so that it gets the parsed `value` in its `onBlur` handler,
		// not the formatted one.
		// A developer is not supposed to pass this `onBlur` property manually.
		// Instead, `redux-form` passes `onBlur` to this component automatically
		// and this component passes this `onBlur` property further to
		// `input-format`'s `<ReactInput/>` which then modifies this `onBlur` handler
		// to return the correct parsed `value` so that it all works with `redux-form`.
		onBlur : PropTypes.func,

		// Set `onKeyDown` handler.
		// Can be used in special cases to handle e.g. enter pressed
		onKeyDown : PropTypes.func,

		// Disables both the <input/> and the <select/>
		// (is `false` by default)
		disabled : PropTypes.bool.isRequired,

		// An error message below the `<input/>`
		error : PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),

		// If this flag is `true` then the `error` is shown.
		// If this flag is `false` then the `error` is not shown (even if passed).
		indicateInvalid : PropTypes.bool,

		// Remembers the input and also autofills it
		// with a previously remembered phone number.
		// Default value: "tel".
		//
		// https://developers.google.com/web/updates/2015/06/checkout-faster-with-autofill
		//
		// "So when should you use autocomplete="off"?
		//  One example is when you've implemented your own version
		//  of autocomplete for search. Another example is any form field
		//  where users will input and submit different kinds of information
		//  where it would not be useful to have the browser remember
		//  what was submitted previously".
		//
		autoComplete : PropTypes.string.isRequired,

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
		dictionary : PropTypes.objectOf(PropTypes.string).isRequired,

		// An optional list of allowed countries
		countries : PropTypes.arrayOf(PropTypes.string).isRequired,

		// Custom national flag icons
		flags : PropTypes.oneOfType
		([
			PropTypes.bool,
			// Legacy behaviour, will be removed
			// in some future major version upgrade.
			PropTypes.objectOf(PropTypes.element)
		]),

		// Flag icon component
		flagComponent : PropTypes.func.isRequired,

		// A base URL path for national flag SVG icons.
		// By default it uses the ones from `flag-icon-css` github repo.
		flagsPath : PropTypes.string.isRequired,

		// Whether to use native `<select/>` when expanded
		nativeExpanded : PropTypes.bool.isRequired,

		// If set to `false`, then country flags will be shown
		// for all countries in the options list
		// (not just for selected country).
		saveOnIcons : PropTypes.bool.isRequired,

		// Whether to show country `<Select/>`
		// (is `true` by default)
		showCountrySelect : PropTypes.bool.isRequired,

		// Whether to add the "International" option
		// to the list of countries.
		international : PropTypes.bool,

		// Custom "International" phone number type icon.
		internationalIcon : PropTypes.element.isRequired,

		// Should the initially passed phone number `value`
		// be converted to a national phone number for its country.
		// (is `false` by default)
		convertToNational : PropTypes.bool.isRequired,

		// HTML `tabindex` attribute for the country select
		selectTabIndex    : PropTypes.number,

		// Defines the height of the dropdown country select list
		selectMaxItems    : PropTypes.number,

		// (deprecated, use just `tabIndex` instead)
		// HTML `tabindex` attribute for the phone number `<input/>`
		inputTabIndex     : PropTypes.number,

		// `aria-label` for the `<Select/>`'s `<button/>`
		selectAriaLabel : PropTypes.string,

		// `aria-label` for the `<Select/>`'s "Close" button
		// (which is an "x" visible in fullscreen mode).
		// (not yet implemented but is likely to be)
		selectCloseAriaLabel : PropTypes.string,

		// CSS style object
		style : PropTypes.object,

		// Inline CSS styles for country `<select/>`
		selectStyle : PropTypes.object,

		// Inline CSS styles for phone number `<input/>`
		inputStyle : PropTypes.object,

		// Component CSS class
		className : PropTypes.string,

		// `<input/>` CSS class
		// (both for the phone number `<input/>` and the autocomplete `<input/>`)
		inputClassName : PropTypes.string,

		// `<Select/>` from `react-responsive-ui` is used by default
		selectComponent : PropTypes.func.isRequired,

		// `<ReactInput/>` from `input-format` is used by default
		inputComponent : PropTypes.func.isRequired,

		// `libphonenumber-js` metadata
		metadata : PropTypes.shape
		({
			country_phone_code_to_countries : PropTypes.object.isRequired,
			countries : PropTypes.object.isRequired
		})
		.isRequired
	}

	static defaultProps =
	{
		// Is enabled
		disabled: false,

		// Remember (and autofill) as a phone number
		autoComplete: 'tel',

		// Include all countries by default
		countries: all_countries,

		// Flag icon component
		flagComponent: FlagComponent,

		// By default use the ones from `flag-icon-css` github repo.
		flagsPath: 'https://lipis.github.io/flag-icon-css/flags/4x3/',

		// Default international icon (globe)
		internationalIcon: (
			<div className={ classNames('react-phone-number-input__icon', 'react-phone-number-input__icon--international') }>
				<InternationalIcon/>
			</div>
		),

		// Custom country names
		dictionary: {},

		// Whether to use native `<select/>` when expanded
		nativeExpanded: false,

		// Don't show flags for all countries in the options list
		// (show it just for selected country).
		// (to save user's traffic because all flags are about 3 MegaBytes)
		saveOnIcons: true,

		// Show country `<Select/>` by default
		showCountrySelect: true,

		// Don't convert the initially passed phone number `value`
		// to a national phone number for its country.
		// The reason is that the newer generation grows up when
		// there are no stationary phones and therefore everyone inputs
		// phone numbers with a `+` in their smartphones so local phone numbers
		// should now be considered obsolete.
		convertToNational: false,

		// `<Select/>` from `react-responsive-ui` is used by default
		selectComponent : Select,

		// `<ReactInput/>` from `input-format` is used by default
		inputComponent : ReactInput
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
		= this.props

		let { country } = this.props

		// Normalize `country` code
		country = normalize_country_code(country, dictionary)

		// Autodetect country if value is set
		// and is international (which it should be)
		if (value && value[0] === '+')
		{
			// `country` will be left `undefined` in case of non-detection
			country = parse(value).country
		}

		// If there will be no "International" option
		// then a `country` must be selected.
		if (!should_add_international_option(this.props) && !country)
		{
			country = countries[0]
		}

		// Set the currently selected country
		this.state.country_code = country

		// If a phone number `value` is passed then format it
		if (value)
		{
			// `this.state.value_property` is the `this.props.value`
			// which corresponding to `this.state.value`.
			// It is being compared in `componentWillReceiveProps()`
			// against `newProps.value` to find out if the new `value` property
			// needs `this.state.value` recalculation.
			this.state.value_property = value
			// Set the currently entered `value`.
			// State `value` is either in international plaintext or just plaintext format.
			// (e.g. `+78005553535`, `1234567`)
			this.state.value = this.get_input_value_depending_on_the_country_selected(value, country)
		}

		// `<Select/>` options
		this.select_options = []

		// Whether custom country names are supplied
		let using_custom_country_names = false

		// Add a `<Select/>` option for each country
		for (const country_code of countries)
		{
			if (dictionary[country_code])
			{
				using_custom_country_names = true
			}

			this.select_options.push
			({
				value : country_code,
				label : dictionary[country_code] || default_dictionary[country_code],
				icon  : get_country_option_icon(country_code, this.props)
			})
		}

		// Sort the list of countries alphabetically
		// (if `String.localeCompare` is available).
		// https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/String/localeCompare
		// (Which means: IE >= 11, and does not work in Safari as of May 2017)
		//
		// This is only done when custom country names
		// are supplied via `dictionary` property
		// because by default all country names are already sorted.
		//
		if (using_custom_country_names && String.prototype.localeCompare)
		{
			this.select_options.sort((a, b) => a.label.localeCompare(b.label))
		}

		// Add the "International" option to the country list (if suitable)
		if (should_add_international_option(this.props))
		{
			this.select_options.unshift
			({
				label : dictionary['International'] || default_dictionary['International'],
				icon  : flags === false ? undefined : internationalIcon
			})
		}
	}

	// Determines the text `<input/>` `value`
	// depending on `this.props.value` and the country selected.
	//
	// E.g. when a country is selected and `this.props.value`
	// is in international format for this country
	// then it can be converted to national format
	// (if `convertToNational` is `true`).
	//
	get_input_value_depending_on_the_country_selected(value, country_code)
	{
		const { metadata, convertToNational } = this.props

		if (!value)
		{
			return
		}

		// If the country code is specified
		if (country_code)
		{
			// and the phone is in international format
			// and should convert to national phone number
			if (value[0] === '+' && convertToNational)
			{
				// If it's a fully-entered phone number
				// that converts into a valid national number for this country
				// then the value is set to be that national number.

				const parsed = parse(value, metadata)

				if (parsed.country === country_code)
				{
					const input_value = format(parsed.phone, country_code, 'National', metadata)
					return this.format(input_value, country_code).text
				}
			}
		}
		// The country is not set.
		// Must be an international phone number then.
		else if (value[0] !== '+')
		{
			// The following causes the caret to move the end of the input field
			// but it's unlikely any sane person would like to erase the `+` sign
			// while inputting an international phone number without any country selected.
			return '+' + value
		}

		return value
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
	set_country = (country_code, focus) =>
	{
		const { metadata, convertToNational } = this.props

		// Previously selected country
		const previous_country_code = this.state.country_code

		this.set_country_code_value(country_code)

		// Adjust the phone number (`value`)
		// according to the selected `country_code`

		let { value } = this.state

		// If the `value` property holds any digits already
		if (value)
		{
			// If switching to a country from International or another country
			if (country_code)
			{
				// If the phone number was entered in international format.
				// The phone number may be incomplete.
				// The phone number entered not necessarily starts with
				// the previously selected country phone prefix.
				if (value[0] === '+')
				{
					// If the international phone number already contains
					// any country phone code then trim the country phone code part.
					// (that also could be the newly selected country phone code prefix)
					value = strip_country_phone_code(value, metadata)

					// Else just trim the + sign
					if (value[0] === '+')
					{
						value = value.slice('+'.length)
					}

					// Prepend country phone code part if `convertToNational` is not set
					if (!convertToNational)
					{
						value = `+${getPhoneCode(country_code)}${value}`
					}
				}
			}

			// If switching to International from a country
			if (previous_country_code && !country_code)
			{
				// If no leading `+` sign
				if (value[0] !== '+')
				{
					// Format the local phone number as an international one.
					// The phone number entered not necessarily even starts with
					// the previously selected country phone prefix.
					// Even if the phone number belongs to whole another country
					// it will still be parsed into some national phone number.
					const national_number = parse_partial_number(value, previous_country_code, metadata).national_number
					value = format(national_number, previous_country_code, 'International_plaintext', metadata)
				}
			}

			// Update the adjusted `<input/>` `value`
			// and update `this.props.value` (in e.164 phone number format)
			// according to the new `this.state.value`.
			// (keep them in sync)
			this.on_change(value, country_code, true)
		}
		// Disabling this feature because if a user selects a country
		// then it means he doesn't know how to input his phone number
		// in international format therefore not forcing it
		// by prepending `+${getPhoneCode(country_code)}`.
		//
		// else
		// {
		// 	// If the `value` property is `undefined`
		// 	// (which means the `<input/>` is either empty
		// 	//  or just the country phone code part is entered)
		// 	// and `convertToNational` wasn't set to `true`
		// 	// then populate `<input/>` with the selected country
		// 	// phone code prefix.
		// 	if (!convertToNational && country_code)
		// 	{
		// 		// Update the adjusted `<input/>` `value`
		// 		// and update `this.props.value` (in e.164 phone number format)
		// 		// according to the new `this.state.value`.
		// 		// (keep them in sync)
		// 		this.on_change(`+${getPhoneCode(country_code)}`, country_code, true)
		// 	}
		// }

		// Focus the phone number input upon country selection
		// (do it in a timeout because the `<input/>`
		//  is hidden while selecting a country)
		if (focus !== false)
		{
			setTimeout(this.focus, 0)
		}
	}

	// `input-format` `parse` character function
	// https://github.com/catamphetamine/input-format
	parse_character = (character, value) =>
	{
		const { countries } = this.props

		if (character === '+')
		{
			// Only allow a leading `+`
			if (!value)
			{
				// If the "International" option is available
				// then allow the leading `+` because it's meant to be this way.
				//
				// Otherwise, the leading `+` will either erase all subsequent digits
				// (if they're not appropriate for the selected country)
				// or the subsequent digits (if any) will join the `+`
				// forming an international phone number. Because a user
				// might be comfortable with entering an international phone number
				// (i.e. with country code) rather than the local one.
				// Therefore such possibility is given.
				//
				return character
			}
		}
		// For digits.
		// Converts wide-ascii and arabic-indic numerals to European numerals.
		// E.g. in Iraq they don't write `+442323234` but rather `+٤٤٢٣٢٣٢٣٤`.
		else if (DIGITS[character])
		{
			const { metadata } = this.props
			const { country_code } = this.state

			// If the "International" option is not available
			// and if the value has a leading `+`
			// then it means that the phone number being entered
			// is an international one, so only allow the country phone code
			// for the selected country to be entered.

			if (!should_add_international_option(this.props) && value && value[0] === '+')
			{
				if (!could_phone_number_belong_to_country(value + DIGITS[character], country_code, metadata))
				{
					return
				}
			}

			return DIGITS[character]
		}
	}

	// `input-format` `format` function
	// https://github.com/catamphetamine/input-format
	format = (input_text, country_code = this.state.country_code) =>
	{
		const { metadata } = this.props

		// "As you type" formatter
		const formatter = new as_you_type(country_code, metadata)

		// Is used to check if a country code can already be derived
		this.formatter = formatter

		// Format phone number
		const text = formatter.input(input_text)

		return { text, template: formatter.template }
	}

	// Returns `true` if the country is available in the list
	is_selectable_country = (country_code) =>
	{
		const { countries } = this.props

		for (const available_country_code of countries)
		{
			if (available_country_code === country_code)
			{
				return true
			}
		}
	}

	// Can be called externally
	focus = () =>
	{
		ReactDOM.findDOMNode(this.input).focus()
	}

	// `<input/>` `onKeyDown` handler
	on_key_down = (event) =>
	{
		const { onKeyDown } = this.props

		// Expand country `<select/>`` on "Down arrow" key press
		if (event.keyCode === 40)
		{
			this.select.toggle()
		}

		if (onKeyDown)
		{
			onKeyDown(event)
		}
	}

	// `<input/>` `onChange` handler.
	// Updates `this.props.value` (in e.164 phone number format)
	// according to the new `this.state.value`.
	// (keeps them in sync)
	on_change = (value, country_code = this.state.country_code, changed_country = false) =>
	{
		const { metadata, onChange } = this.props

		// If the `<input/>` is empty then just exit
		if (!value)
		{
			return this.setState
			({
				// State `value` is the parsed input value
				// (e.g. `+78005553535`, `1234567`).
				// This is not `this.props.value`
				// i.e. it's not neccessarily an international plaintext phone number,
				// it's just the `value` parsed by `input-format`.
				value,
				// `this.state.value_property` is the `this.props.value`
				// which corresponding to `this.state.value`.
				// It is being compared in `componentWillReceiveProps()`
				// against `newProps.value` to find out if the new `value` property
				// needs `this.state.value` recalculation.
				value_property: value
			},
			// Write the new `this.props.value`.
			() => onChange(value))
		}

		// For international phone numbers
		if (value[0] === '+')
		{
			// If an international phone number is being erased up to the first `+` sign
			// or if an international phone number is just starting (with a `+` sign)
			// then unset the current country because it's clear that a user intends to change it.
			if (value.length === 1)
			{
				// If "International" country option has not been disabled
				// then reset the currently selected country.
				if (!changed_country && should_add_international_option(this.props))
				{
					country_code = undefined
					this.set_country_code_value(country_code)
				}
			}
			else
			{
				// If a phone number is being input as an international one
				// and the country code can already be derived,
				// then switch the country.
				// (`001` is a special "non-geograpical entity" code in `libphonenumber` library)
				if (!changed_country &&
					this.formatter.country &&
					this.formatter.country !== '001' &&
					this.is_selectable_country(this.formatter.country))
				{
					country_code = this.formatter.country
					this.set_country_code_value(country_code)
				}
				// If "International" country option has not been disabled
				// and the international phone number entered doesn't correspond
				// to the currently selected country then reset the currently selected country.
				else if (!changed_country &&
					should_add_international_option(this.props) &&
					country_code &&
					value.indexOf(getPhoneCode(country_code) !== '+'.length))
				{
					country_code = undefined
					this.set_country_code_value(country_code)
				}
			}
		}
		// If "International" mode is selected
		// and the `value` doesn't start with a + sign,
		// then prepend it to the `value`.
		else if (!country_code)
		{
			value = '+' + value
		}

		// `this.state.value_property` is the `this.props.value`
		// which corresponding to `this.state.value`.
		// It is being compared in `componentWillReceiveProps()`
		// against `newProps.value` to find out if the new `value` property
		// needs `this.state.value` recalculation.
		let value_property

		// `value` equal to `+` makes no sense
		if (value === '+')
		{
			value_property = undefined
		}
		// If a phone number is in international format then check
		// that the phone number entered belongs to the selected country.
		else if (country_code && value[0] === '+' && !(value.indexOf(`+${getPhoneCode(country_code)}`) === 0 && value.length > `+${getPhoneCode(country_code)}`.length))
		{
			value_property = undefined
		}
		// Should be a most-probably-valid phone number
		else
		{
			// Convert `value` to E.164 phone number format
			value_property = e164(value, country_code, metadata)
		}

		this.setState
		({
			// State `value` is the parsed input value
			// (e.g. `+78005553535`, `1234567`).
			// This is not `this.props.value`
			// i.e. it's not neccessarily an international plaintext phone number,
			// it's just the `value` parsed by `input-format`.
			value,
			// `this.state.value_property` is the `this.props.value`
			// which corresponding to `this.state.value`.
			// It is being compared in `componentWillReceiveProps()`
			// against `newProps.value` to find out if the new `value` property
			// needs `this.state.value` recalculation.
			value_property
		},
		// Write the new `this.props.value`.
		() => onChange(value_property))
	}

	// This `onBlur` interceptor is a workaround for `redux-form`,
	// so that it gets the parsed `value` in its `onBlur` handler,
	// not the formatted one.
	// A developer is not supposed to pass this `onBlur` property manually.
	// Instead, `redux-form` passes `onBlur` to this component automatically
	// and this component passes this `onBlur` property further to
	// `input-format`'s `<ReactInput/>` which then modifies this `onBlur` handler
	// to return the correct parsed `value` so that it all works with `redux-form`.
	on_blur = (event) =>
	{
		const { onBlur } = this.props
		const { value_property } = this.state

		if (!onBlur)
		{
			return
		}

		const _event =
		{
			...event,
			target:
			{
				...event.target,
				value: value_property
			}
		}

		// For `redux-form` event detection.
		// https://github.com/erikras/redux-form/blob/v5/src/events/isEvent.js
		_event.stopPropagation = event.stopPropagation
		_event.preventDefault  = event.preventDefault

		return onBlur(_event)
	}

	// When country `<select/>` is toggled
	country_select_toggled = (is_shown) =>
	{
		this.setState({ country_select_is_shown: is_shown })
	}

	// Focuses the `<input/>` field
	// on tab out of the country `<select/>`
	on_country_select_tab_out = (event) =>
	{
		event.preventDefault()

		// Focus the phone number input upon country selection
		// (do it in a timeout because the `<input/>`
		//  is hidden while selecting a country)
		setTimeout(this.focus, 0)
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
		const { countries, value, dictionary } = this.props

		// Normalize `country` codes
		let country     = normalize_country_code(this.props.country, dictionary)
		let new_country = normalize_country_code(new_props.country, dictionary)

		// If the default country changed
		// (e.g. in case of IP detection)
		if (new_country !== country)
		{
			// If the phone number input field is currently empty
			// (e.g. not touched yet) then change the selected `country`
			// to the newly passed one (e.g. as a result of a GeoIP query)
			if (!value)
			{
				// If the passed `country` allowed then update it
				if (countries.indexOf(new_country) !== -1)
				{
					// Set the new `country`
					this.set_country(new_country, false)
				}
			}
		}

		// This code is executed:
		// * after `this.props.onChange(value)` is called
		// * if the `value` was externally set (e.g. cleared)
		if (new_props.value !== value)
		{
			// `this.state.value_property` is the `this.props.value`
			// which corresponding to `this.state.value`.
			// It is being compared in `componentWillReceiveProps()`
			// against `newProps.value` to find out if the new `value` property
			// needs `this.state.value` recalculation.
			// This is an optimization, it's like `shouldComponentUpdate()`.
			// This is supposed to save some CPU cycles, maybe not much, I didn't check.
			// Or maybe there was some other reason for this I don't remember now.
			if (new_props.value !== this.state.value_property)
			{
				// Update the `value` because it was externally set

				// Country code gets updated too
				let country_code = this.state.country_code

				// Autodetect country if `value` is set
				// and is international (which it should be)
				if (new_props.value && new_props.value[0] === '+')
				{
					// `parse().country` will be `undefined` in case of non-detection
					country_code = parse(new_props.value).country || country_code
				}

				this.setState
				({
					country_code,
					value: this.get_input_value_depending_on_the_country_selected(new_props.value, country_code),
					// `this.state.value_property` is the `this.props.value`
					// which corresponding to `this.state.value`.
					// It is being compared in `componentWillReceiveProps()`
					// against `newProps.value` to find out if the new `value` property
					// needs `this.state.value` recalculation.
					value_property: new_props.value
				})
			}
		}
	}

	store_select_instance = (instance) =>
	{
		this.select = instance
	}

	store_input_instance = (instance) =>
	{
		this.input = instance
	}

	render()
	{
		const
		{
			saveOnIcons,
			showCountrySelect,
			nativeExpanded,
			disabled,
			autoComplete,
			selectTabIndex,
			selectMaxItems,
			selectAriaLabel,
			selectCloseAriaLabel,
			inputTabIndex,
			style,
			selectStyle,
			inputStyle,
			className,
			inputClassName,

			error,
			indicateInvalid,

			selectComponent : SelectComponent,
			inputComponent  : InputComponent,

			// Extract `input_props` via "object rest spread":
			dictionary,
			countries,
			country,
			onCountryChange,
			flags,
			flagComponent,
			flagsPath,
			international,
			internationalIcon,
			convertToNational,
			metadata,
			...input_props
		}
		= this.props

		// `inputTabIndex` is deprecated, use just `tabIndex` instead
		if (inputTabIndex)
		{
			input_props.tabIndex = inputTabIndex
		}

		const
		{
			value,
			country_code,
			country_select_is_shown
		}
		= this.state

		// `type="tel"` was reported to have issues with
		// Samsung keyboards caret position on Android OS.
		// https://github.com/catamphetamine/react-phone-number-input/issues/59
		// One may choose to pass `type="text"` in those cases
		// but this will result in a non-digital input keyboard.

		return (
			<div
				style={ style }
				className={ classNames('react-phone-number-input',
				{
					'react-phone-number-input--invalid': error && indicateInvalid
				},
				className) }>

				{/* Country `<select/>` and phone number `<input/>` */}
				<div className="react-phone-number-input__row">

					{/* Country `<select/>` */}
					{ showCountrySelect && this.can_change_country() &&
						<SelectComponent
							ref={ this.store_select_instance }
							value={ country_code }
							options={ this.select_options }
							onChange={ this.set_country }
							disabled={ disabled }
							onToggle={ this.country_select_toggled }
							onTabOut={ this.on_country_select_tab_out }
							nativeExpanded={ nativeExpanded }
							autocomplete
							autocompleteShowAll
							maxItems={ selectMaxItems }
							concise
							tabIndex={ selectTabIndex }
							focusUponSelection={ false }
							saveOnIcons={ saveOnIcons }
							name={ input_props.name ? `${input_props.name}__country` : undefined }
							ariaLabel={ selectAriaLabel }
							closeAriaLabel={ selectCloseAriaLabel }
							style={ selectStyle }
							className={ classNames('react-phone-number-input__country',
							{
								'react-phone-number-input__country--native-expanded' : nativeExpanded
							}) }
							inputClassName={ inputClassName }/>
					}

					{/* Phone number `<input/>` */}
					{ !country_select_is_shown &&
						<InputComponent
							type="tel"
							{ ...input_props }
							ref={ this.store_input_instance }
							value={ value }
							onChange={ this.on_change }
							onBlur={ this.on_blur }
							disabled={ disabled }
							autoComplete={ autoComplete }
							parse={ this.parse_character }
							format={ this.format }
							onKeyDown={ this.on_key_down }
							style={ inputStyle }
							className={ classNames
							(
								'rrui__input',
								'rrui__input-element',
								'rrui__input-field',
								{
									'rrui__input-field--invalid'  : error && indicateInvalid,
									'rrui__input-field--disabled' : disabled
								},
								'react-phone-number-input__phone',
								inputClassName
							) }/>
					}
				</div>

				{/* Error message */}
				{ error && indicateInvalid &&
					<div className={ classNames('rrui__input-error', 'react-phone-number-input__error') }>
						{ error }
					</div>
				}
			</div>
		)
	}
}

// Parses a partially entered phone number
// and returns the national number so far.
// Not using `libphonenumber-js`'s `parse`
// function here because `parse` only works
// when the number is fully entered,
// and this one is for partially entered number.
function parse_partial_number(value, country_code, metadata)
{
	// "As you type" formatter
	const formatter = new as_you_type(country_code, metadata)

	// Input partially entered phone number
	formatter.input(value)

	// Return the parsed partial phone number
	// (has `.national_number`, `.country`, etc)
	return formatter
}

// Converts `value` to E.164 phone number format
function e164(value, country_code, metadata)
{
	if (!value)
	{
		return undefined
	}

	// If the phone number is being input in an international format
	if (value[0] === '+')
	{
		// If it's just the `+` sign
		if (value.length === 1)
		{
			return undefined
		}

		// If there are some digits, the `value` is returned as is
		return value
	}

	// For non-international phone number a country code is required
	if (!country_code)
	{
		return undefined
	}

	// The phone number is being input in a country-specific format

	const partial_national_number = parse_partial_number(value, country_code).national_number

	if (!partial_national_number)
	{
		return undefined
	}

	// The value is converted to international plaintext
	return format(partial_national_number, country_code, 'International_plaintext', metadata)
}

// Gets country flag element by country code
function get_country_option_icon(countryCode, { flags, flagsPath, flagComponent })
{
	if (flags === false)
	{
		return undefined
	}

	if (flags && flags[countryCode])
	{
		return flags[countryCode]
	}

	return React.createElement(flagComponent, { countryCode, flagsPath })
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

// Is it possible that the partially entered  phone number belongs to the given country
function could_phone_number_belong_to_country(phone_number, country_code, metadata)
{
	// Strip the leading `+`
	const phone_number_digits = phone_number.slice('+'.length)

	for (const country_phone_code of Object.keys(metadata.country_phone_code_to_countries))
	{
		const possible_country_phone_code = phone_number_digits.substring(0, country_phone_code.length)
		if (country_phone_code.indexOf(possible_country_phone_code) === 0)
		{
			// This country phone code is possible.
			// Does the given country correspond to this country phone code.
			if (metadata.country_phone_code_to_countries[country_phone_code].indexOf(country_code) >= 0)
			{
				return true
			}
		}
	}
}

// If a formatted phone number is an international one
// then it strips the `+${country_phone_code}` prefix from the formatted number.
function strip_country_phone_code(formatted_number, metadata)
{
	if (!formatted_number || formatted_number[0] !== '+' || formatted_number === '+')
	{
		return formatted_number
	}

	for (const country_phone_code of Object.keys(metadata.country_phone_code_to_countries))
	{
		if (formatted_number.indexOf(country_phone_code) === '+'.length)
		{
			return formatted_number.slice('+'.length + country_phone_code.length).trim()
		}
	}

	return formatted_number
}

// Validates country code
function normalize_country_code(country, dictionary)
{
	// Normalize `country` if it's an empty string
	if (country === '')
	{
		country = undefined
	}

	// No country is selected ("International")
	if (country === undefined || country === null)
	{
		return country
	}

	// Check that `country` code exists
	if (dictionary[country] || default_dictionary[country])
	{
		return country
	}

	throw new Error(`Unknown country: "${country}"`)
}
