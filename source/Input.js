import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import ReactDOM from 'react-dom'
import { polyfill as reactLifecyclesCompat } from 'react-lifecycles-compat'
import { AsYouType, parse } from 'libphonenumber-js/custom'
import { ReactInput } from 'input-format'
import classNames from 'classnames'

// Could have been `import { Select } from 'react-responsive-ui'`
// but in that case Webpack bundles the whole `react-responsive-ui` package.
import Select from 'react-responsive-ui/commonjs/Select'

import InternationalIcon from './InternationalIcon'
import FlagComponent from './Flag'

import
{
	getPreSelectedCountry,
	getCountrySelectOptions,
	parsePhoneNumberCharacter,
	parsePhoneNumber,
	formatPhoneNumber,
	generateNationalNumberDigits,
	migrateParsedInputForNewCountry,
	getCountryForParsedInput,
	e164
}
from './input-control'

import { countries } from './countries'

// Allows passing custom `libphonenumber-js` metadata
// to reduce the overall bundle size.
@reactLifecyclesCompat
export default class PhoneNumberInput extends PureComponent
{
	static propTypes =
	{
		// Phone number in E.164 format.
		// E.g. "+12223333333" for USA.
		value : PropTypes.string,

		// `onChange` handler is called each time
		// the phone number `<input/>` is edited.
		onChange : PropTypes.func.isRequired,

		// `onBlur` is usually passed by `redux-form`.
		onBlur : PropTypes.func,

		// `onKeyDown` handler (e.g. to handle Enter key press).
		onKeyDown : PropTypes.func,

		// Disables both the phone number `<input/>`
		// and the country `<select/>`.
		// (is `false` by default)
		disabled : PropTypes.bool.isRequired,

		// Web browser's "autocomplete" feature
		// remembers the phone number being input
		// and can also autofill the `<input/>`
		// with previously remembered phone numbers.
		//
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

		// Should the initially passed phone number `value`
		// be converted to a national phone number for its country.
		// (is `false` by default)
		displayInitialValueAsLocalNumber : PropTypes.bool.isRequired,

		// The country to be selected by default.
		// Two-letter country code ("ISO 3166-1 alpha-2").
		country : PropTypes.string,

		// Only these countries will be available for selection.
		// Includes all countries by default.
		countries : PropTypes.arrayOf(PropTypes.string).isRequired,

		// Custom country `<select/>` option names.
		// E.g. `{ ZZ: 'Международный', RU: 'Россия', US: 'США', ... }`
		labels : PropTypes.objectOf(PropTypes.string),

		// Country flag icon components.
		// By default flag icons are inserted as `<img/>`s
		// with their `src` pointed to `flag-icon-css` github repo.
		// There might be cases (e.g. an offline application)
		// where having a large (3 megabyte) `<svg/>` flags
		// bundle is more appropriate.
		// `import flags from 'react-phone-number-input/flags'`.
		flags : PropTypes.objectOf(PropTypes.func),

		// Flag icon component.
		flagComponent : PropTypes.func.isRequired,

		// A base URL path for national flag SVG icons.
		// By default it uses the ones from `flag-icon-css` github repo.
		flagsPath : PropTypes.string.isRequired,

		// Whether to add the "International" option
		// to the list of countries.
		// By default it's added if the list of `countries` hasn't been overridden.
		international : PropTypes.bool,

		// Custom "International" country `<select/>` option icon.
		internationalIcon : PropTypes.element.isRequired,

		// Whether to use native country `<select/>` when it's expanded.
		nativeCountrySelect : PropTypes.bool.isRequired,

		// If set to `false`, then country flags will be shown
		// for all countries when country `<select/>` is expanded.
		// By default shows flag only for currently selected country.
		saveOnIcons : PropTypes.bool.isRequired,

		// Whether to show country `<select/>`.
		// (is `true` by default)
		showCountrySelect : PropTypes.bool.isRequired,

		// HTML `tabindex` attribute for the country `<select/>`.
		countrySelectTabIndex : PropTypes.number,

		// Defines the height (in items) of the expanded country `<select/>`.
		countrySelectMaxItems : PropTypes.number,

		// `aria-label` for the `<Select/>`'s toggle `<button/>`.
		countrySelectAriaLabel : PropTypes.string,

		// `aria-label` for the `<Select/>`'s "Close" button
		// (which is an "x" visible in fullscreen mode).
		// (not yet implemented but is likely to be).
		countrySelectCloseAriaLabel : PropTypes.string,

		// `<Phone/>` component CSS style object.
		style : PropTypes.object,

		// `<Phone/>` component CSS class.
		className : PropTypes.string,

		// `<input/>` CSS class.
		// Both for the phone number `<input/>` and
		// the country select autocomplete `<input/>`.
		inputClassName : PropTypes.string,

		// Country `<select/>` toggle `<button/>` CSS class
		countrySelectToggleClassName : PropTypes.string,

		// Country `<select/>` component.
		countrySelectComponent : PropTypes.func.isRequired,

		// Phone number `<input/>` component.
		inputComponent : PropTypes.func.isRequired,

		// Phone number extension element.
		ext : PropTypes.node,

		// An error message shown below the phone number `<input/>`.
		error : PropTypes.string,

		// The `error` is shown only when `indicateInvalid` is true.
		indicateInvalid : PropTypes.bool,

		// Translation.
		locale : PropTypes.objectOf(PropTypes.string),

		// `libphonenumber-js` metadata
		metadata : PropTypes.shape
		({
			country_calling_codes : PropTypes.object.isRequired,
			countries : PropTypes.object.isRequired
		})
		.isRequired
	}

	static defaultProps =
	{
		// Not disabled.
		disabled: false,

		// Remember (and autofill) the value as a phone number.
		autoComplete: 'tel',

		// Include all countries.
		countries,

		// Flag icon component.
		flagComponent: FlagComponent,

		// By default use icons from `flag-icon-css` github repo.
		flagsPath: 'https://lipis.github.io/flag-icon-css/flags/4x3/',

		// Default "International" country `<select/>` option icon (globe).
		internationalIcon: (
			<div className={ classNames('react-phone-number-input__icon', 'react-phone-number-input__icon--international') }>
				<InternationalIcon/>
			</div>
		),

		// Whether to use native country `<select/>` when it's expanded.
		nativeCountrySelect: false,

		// If set to `false`, then country flags will be shown
		// for all countries when country `<select/>` is expanded.
		// By default shows flag only for currently selected country.
		// (is `true` by default to save user's traffic
		//  because all flags are about 3 MegaBytes)
		saveOnIcons: true,

		// Show country `<select/>`.
		showCountrySelect: true,

		// Don't convert the initially passed phone number `value`
		// to a national phone number for its country.
		// The reason is that the newer generation grows up when
		// there are no stationary phones and therefore everyone inputs
		// phone numbers with a `+` in their smartphones
		// so phone numbers written in international form
		// are gradually being considered more natural than local ones.
		displayInitialValueAsLocalNumber: false,

		// `<Select/>` from `react-responsive-ui`.
		countrySelectComponent : Select,

		// `<ReactInput/>` from `input-format`.
		inputComponent : ReactInput
	}

	constructor(props)
	{
		super(props)

		const
		{
			value,
			country,
			countries,
			labels,
			international,
			metadata
		}
		= this.props

		const parsed_number = parsePhoneNumber(value, metadata)

		const pre_selected_country = getPreSelectedCountry
		(
			parsed_number,
			country,
			countries,
			international,
			metadata
		)

		this.state =
		{
			// Workaround for `this.props` inside `getDerivedStateFromProps()`.
			props : this.props,

			// The country selected.
			country : pre_selected_country,

			// Generate country `<select/>` options.
			country_select_options : generate_country_select_options(this.props),

			// `parsed_input` state property holds user's input.
			// The reason is that there's no way of finding out
			// in which form should `value` be displayed: international or national.
			// E.g. if value is `+78005553535` then it could be input
			// by a user both as `8 (800) 555-35-35` and `+7 800 555 35 35`.
			parsed_input : generate_parsed_input(value, parsed_number, this.props),

			// `value` property is duplicated in state.
			// The reason is that `getDerivedStateFromProps()`
			// needs this `value` to compare to the new `value` property
			// to find out if `parsed_input` needs updating:
			// If the `value` property changed externally
			// then it won't be equal to state `value`
			// in which case `parsed_input` and `country` get updated.
			value
		}
	}

	// Country `<select/>` `onChange` handler.
	on_country_selected = (new_country) =>
	{
		const { metadata, onChange } = this.props

		const
		{
			parsed_input : old_parsed_input,
			country      : old_country
		}
		= this.state

		// After the new `country` has been selected,
		// if the phone number `<input/>` holds any digits
		// then migrate those digits for the new `country`.
		// If returns `undefined` then it means that it stays the same.
		const new_parsed_input = migrateParsedInputForNewCountry
		(
			old_parsed_input,
			old_country,
			new_country,
			metadata
		)

		const new_value = e164(new_parsed_input, new_country, metadata)

		this.setState
		({
			country : new_country,
			parsed_input : new_parsed_input,
			value : new_value
		},
		() =>
		{
			// Update the new `value` property.
			// Doing it after the `state` has been updated
			// because `onChange()` will trigger `getDerivedStateFromProps()`
			// with the new `value` which will be compared to `state.value` there.
			onChange(new_value)

			// Focus the phone number `<input/>` upon country selection.
			// Doing it in a `setState()` callback because the phone number
			// `<input/>` is hidden while country `<select/>` is expanded.
			this.focus()
		})
	}

	// Phone number `<input/>` `onKeyDown` handler.
	on_number_key_down = (event) =>
	{
		const { onKeyDown } = this.props

		// Expand country `<select/>`` on "Down arrow" key press.
		if (event.keyCode === 40) {
			this.country_select.toggle()
		}

		if (onKeyDown) {
			onKeyDown(event)
		}
	}

	// `<input/>` `onChange` handler.
	// Updates `value` property accordingly.
	// (so that they are kept in sync)
	on_change = (parsed_input) =>
	{
		const
		{
			onChange,
			countries,
			international,
			metadata
		}
		= this.props

		let { country } = this.state

		if (parsed_input)
		{
			// If the phone number being input is an international one
			// then tries to derive the country from the phone number.
			// (regardless of whether there's any country currently selected)
			if (parsed_input[0] === '+')
			{
				country = getCountryForParsedInput
				(
					parsed_input,
					country,
					countries,
					international,
					metadata
				)
			}
			// If this `onChange()` event was triggered
			// as a result of selecting "International" country
			// then force-prepend a `+` sign if the phone number
			// `<input/>` value isn't in international format.
			else if (!country)
			{
				parsed_input = '+' + parsed_input
			}
		}

		// Generate the new `value` property.
		const value = e164(parsed_input, country, metadata)

		this.setState
		({
			parsed_input,
			value,
			country
		},
		// Update the new `value` property.
		// Doing it after the `state` has been updated
		// because `onChange()` will trigger `getDerivedStateFromProps()`
		// with the new `value` which will be compared to `state.value` there.
		() => onChange(value))
	}

	// This `onBlur` interceptor is a workaround for `redux-form`
	// so that it gets the up-to-date `value` in its `onBlur` handler.
	// Without this fix it just gets the actual (raw) input field textual value.
	//
	// A developer is not supposed to pass this `onBlur` property manually.
	// Instead, `redux-form` passes `onBlur` to this component automatically
	// and this component patches that `onBlur` handler passing it further to
	// `input-format`'s `<ReactInput/>`.
	//
	on_blur = (event) =>
	{
		const { value, onBlur } = this.props

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
				value
			}
		}

		// For `redux-form` event detection.
		// https://github.com/erikras/redux-form/blob/v5/src/events/isEvent.js
		_event.stopPropagation = event.stopPropagation
		_event.preventDefault  = event.preventDefault

		return onBlur(_event)
	}

	// When country `<select/>` is toggled.
	on_country_select_toggle = (show) =>
	{
		this.setState({
			show_country_select: show
		})
	}

	// Focuses phone number `<input/>` field
	// on tab out of the country `<select/>`.
	on_country_select_tab_out = (event) =>
	{
		event.preventDefault()

		// Focus the phone number input upon country selection
		// (do it in a timeout because the `<input/>`
		//  is hidden while selecting a country)
		setTimeout(this.focus, 0)
	}

	format_phone_number = (value) =>
	{
		const { metadata } = this.props
		const { country } = this.state

		return formatPhoneNumber(value, country, metadata)
	}

	// Can be called externally.
	focus = () => ReactDOM.findDOMNode(this.number_input).focus()

	store_country_select_instance = _ => this.country_select = _

	store_number_input_instance = _ => this.number_input = _

	static getDerivedStateFromProps(props, state)
	{
		const
		{
			country,
			value,
			props:
			{
				country : old_default_country,
			}
		}
		= state

		const
		{
			metadata,
			country : new_default_country,
			value   : new_value
		}
		= props

		const new_state = { props }

		// If `countries` or `labels` or `international` changed
		// then re-generate country `<select/>` options.
		if (props.countries !== state.props.countries ||
			props.labels !== state.props.labels ||
			props.international !== state.props.international)
		{
			new_state.country_select_options = generate_country_select_options(props)
		}

		// If the default country changed.
		// (e.g. in case of ajax GeoIP detection after page loaded)
		// then select it but only if no phone number has been entered so far.
		// Because if the user has already started inputting a phone number
		// then he's okay with no country being selected at all ("International")
		// and doesn't want to be disturbed, doesn't want his input to be screwed, etc.
		if (new_default_country !== old_default_country && !country && !value && !new_value)
		{
			return {
				...new_state,
				country : new_default_country
			}
		}
		// If a new `value` is set externally.
		// (e.g. as a result of an ajax API request
		//  to get user's phone after page loaded)
		else if (new_value !== value)
		{
			const parsed_number = parsePhoneNumber(new_value, metadata)

			return {
				...new_state,
				parsed_input : generate_parsed_input(new_value, parsed_number, props),
				value : new_value,
				country : new_value ? parsed_number.country : country
			}
		}
		else if (new_state.country_select_options)
		{
			return new_state
		}

		// https://github.com/facebook/react/issues/12562
		return null
	}

	render()
	{
		const
		{
			disabled,
			autoComplete,
			countrySelectTabIndex,
			countrySelectMaxItems,
			countrySelectAriaLabel,
			countrySelectCloseAriaLabel,
			showCountrySelect,
			nativeCountrySelect,
			saveOnIcons,
			style,
			className,
			inputClassName,
			countrySelectToggleClassName,

			error,
			indicateInvalid,

			countrySelectComponent : CountrySelectComponent,
			inputComponent : InputComponent,
			ext,

			// Extract `phone_number_input_props` via "object rest spread":
			countries,
			labels,
			country : _,
			flags,
			flagComponent,
			flagsPath,
			international,
			internationalIcon,
			displayInitialValueAsLocalNumber,
			locale,
			metadata,
			...phone_number_input_props
		}
		= this.props

		const
		{
			country,
			show_country_select,
			country_select_options,
			parsed_input
		}
		= this.state

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
					{ showCountrySelect &&
						<CountrySelectComponent
							ref={ this.store_country_select_instance }
							value={ country }
							options={ country_select_options }
							onChange={ this.on_country_selected }
							disabled={ disabled }
							onToggle={ this.on_country_select_toggle }
							onTabOut={ this.on_country_select_tab_out }
							nativeExpanded={ nativeCountrySelect }
							concise
							autocomplete
							autocompleteShowAll
							maxItems={ countrySelectMaxItems }
							tabIndex={ countrySelectTabIndex }
							focusUponSelection={ false }
							saveOnIcons={ saveOnIcons }
							name={ phone_number_input_props.name ? `${phone_number_input_props.name}__country` : undefined }
							ariaLabel={ countrySelectAriaLabel }
							closeAriaLabel={ countrySelectCloseAriaLabel }
							className={ classNames('react-phone-number-input__country',
							{
								'react-phone-number-input__country--native-expanded' : nativeCountrySelect
							}) }
							inputClassName={ inputClassName }
							toggleClassName={ countrySelectToggleClassName }/>
					}

					{/* Phone number `<input/>` */}
					{ !show_country_select &&
						<InputComponent
							type="tel"
							{ ...phone_number_input_props }
							ref={ this.store_number_input_instance }
							parse={ parsePhoneNumberCharacter }
							format={ this.format_phone_number }
							value={ parsed_input }
							onChange={ this.on_change }
							onBlur={ this.on_blur }
							onKeyDown={ this.on_number_key_down }
							disabled={ disabled }
							autoComplete={ autoComplete }
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

					{/* Phone extension `<input/>` */}
					{ ext && !show_country_select &&
						<label className="react-phone-number-input__ext">
							{labels && labels.ext || 'ext.'}
							{React.cloneElement(ext,
							{
								type : ext.props.type === undefined ? 'number' : ext.props.type,
								className : classNames
								(
									'rrui__input',
									'rrui__input-element',
									'rrui__input-field',
									{
										'rrui__input-field--disabled' : disabled
									},
									'react-phone-number-input__ext-input',
									inputClassName,
									ext.props.className
								)
							})}
						</label>
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

// Generates country `<select/>` options.
function generate_country_select_options(props)
{
	const
	{
		countries,
		labels,
		flags,
		flagsPath,
		flagComponent : FlagComponent,
		international,
		internationalIcon
	}
	= props

	return getCountrySelectOptions
	(
		countries,
		labels,
		international
	)
	.map(({ value, label }) =>
	({
		value,
		label,
		icon : value ? () => <FlagComponent country={value} flags={flags} flagsPath={flagsPath}/> : internationalIcon
	}))
}

function generate_parsed_input(value, parsed_number, props)
{
	const
	{
		displayInitialValueAsLocalNumber,
		metadata
	}
	= props

	// If the `value` (E.164 phone number)
	// belongs to the currently selected country
	// and `displayInitialValueAsLocalNumber` property is `true`
	// then convert `value` (E.164 phone number)
	// to a local phone number digits.
	// E.g. '+78005553535' -> '88005553535'.
	if (displayInitialValueAsLocalNumber && parsed_number.country)
	{
		return generateNationalNumberDigits(parsed_number, metadata)
	}

	return value
}