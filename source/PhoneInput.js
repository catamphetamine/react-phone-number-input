import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { polyfill as reactLifecyclesCompat } from 'react-lifecycles-compat'

// import InputSmart from './InputSmart'
import InputBasic from './InputBasic'

import FlagComponent from './Flag'

import
{
	metadata as metadataPropType,
	labels as labelsPropType
}
from './PropTypes'

import
{
	getPreSelectedCountry,
	getCountrySelectOptions,
	parsePhoneNumber,
	generateNationalNumberDigits,
	migrateParsedInputForNewCountry,
	getCountryForParsedInput,
	e164,
	trimNumber
}
from './input-control'

import { getCountryCodes } from './countries'

// `PureComponent` is only available in React >= 15.3.0.
const PureComponent = React.PureComponent || React.Component

@reactLifecyclesCompat
export default class PhoneNumberInput extends PureComponent
{
	static propTypes =
	{
		/**
		 * Phone number in `E.164` format.
		 *
		 * Example:
		 *
		 * `"+12223333333"`
		 */
		value : PropTypes.string,

		/**
		 * Updates the `value` as the user inputs the phone number.
		 */
		onChange : PropTypes.func.isRequired,

		/**
		 * Toggles the `--focus` CSS class.
		 * @ignore
		 */
		onFocus : PropTypes.func,

		/**
		 * `onBlur` is usually passed by `redux-form`.
		 * @ignore
		 */
		onBlur : PropTypes.func,

		/**
		 * `onKeyDown` handler (e.g. to handle Enter key press).
		 * @ignore
		 */
		onKeyDown : PropTypes.func,

		/**
		 * Disables both the phone number `<input/>`
		 * and the country `<select/>`.
		 */
		// (is `false` by default)
		disabled : PropTypes.bool.isRequired,

		/**
		 * Sets `autoComplete` property for phone number `<input/>`.
		 *
		 * Web browser's "autocomplete" feature
		 * remembers the phone number being input
		 * and can also autofill the `<input/>`
		 * with previously remembered phone numbers.
		 *
		 * https://developers.google.com/web/updates/2015/06/checkout-faster-with-autofill
		 *
		 * For example, can be used to turn it off:
		 *
		 * "So when should you use `autocomplete="off"`?
		 *  One example is when you've implemented your own version
		 *  of autocomplete for search. Another example is any form field
		 *  where users will input and submit different kinds of information
		 *  where it would not be useful to have the browser remember
		 *  what was submitted previously".
		 */
		// (is `"tel"` by default)
		autoComplete : PropTypes.string.isRequired,

		/**
		 * Set to `true` to show the initial `value` in
		 * "national" format rather than "international".
		 *
		 * For example, if this flag is set to `true`
		 * and the initial `value="+12133734253"` is passed
		 * then the `<input/>` value will be `"(213) 373-4253"`.
		 *
		 * By default, this flag is set to `false`,
		 * meaning that if the initial `value="+12133734253"` is passed
		 * then the `<input/>` value will be `"+1 213 373 4253"`.
		 *
		 * The reason for such default behaviour is that
		 * the newer generation grows up when there are no stationary phones
		 * and therefore everyone inputs phone numbers in international format
		 * in their smartphones so people gradually get more accustomed to
		 * writing phone numbers in international format rather than in local format.
		 * Future people won't be using "national" format, only "international".
		 */
		// (is `false` by default)
		displayInitialValueAsLocalNumber : PropTypes.bool.isRequired,

		/**
		 * The country to be selected by default.
		 * For example, can be set after a GeoIP lookup.
		 *
		 * Example: `"US"`.
		 */
		// A two-letter country code ("ISO 3166-1 alpha-2").
		country : PropTypes.string,

		/**
		 * If specified, only these countries will be available for selection.
		 *
		 * Example:
		 *
		 * `["RU", "UA", "KZ"]`
		 */
		countries : PropTypes.arrayOf(PropTypes.string),

		/**
		 * Custom country `<select/>` option names.
		 *
		 * Example:
		 *
		 * `{ "ZZ": "Международный", RU: "Россия", US: "США", ... }`
		 */
		labels : labelsPropType.isRequired,

		/**
		 * The base URL path for country flag icons.
		 * By default it loads country flag icons from
		 * `flag-icon-css` repo github pages website.
		 * I imagine someone might want to download
		 * those country flag icons and host them
		 * on their own servers instead.
		 */
		flagsPath : PropTypes.string.isRequired,

		/**
		 * Custom country flag icon components.
		 * These flags replace the default ones.
		 *
		 * The shape is an object where keys are country codes
		 * and values are flag icon components.
		 * Flag icon components receive the same properties
		 * as `flagComponent` (see below).
		 *
		 * Example:
		 *
		 * `{ "RU": () => <img src="..."/> }`
		 *
		 * Can be used to replace the default flags
		 * with custom ones for certain (or all) countries.
		 *
		 * Can also be used to bundle `<svg/>` flags instead of `<img/>`s:
		 *
		 * By default flag icons are inserted as `<img/>`s
		 * with their `src` pointed to `flag-icon-css` repo github pages website.
		 *
		 * There might be some cases
		 * (e.g. a standalone "native" app, or an "intranet" web application)
		 * when including the full set of `<svg/>` country flags (3 megabytes)
		 * is more appropriate than downloading them individually at runtime only if needed.
		 *
		 * Example:
		 *
		 * `// Uses <svg/> flags (3 megabytes):`
		 *
		 * `import flags from 'react-phone-number-input/flags'`
		 *
		 * `import PhoneInput from 'react-phone-number-input'`
		 *
		 * `<PhoneInput flags={flags} .../>`
		 */
		flags : PropTypes.objectOf(PropTypes.func),

		/**
		 * Country flag icon component.
		 *
		 * Takes properties:
		 *
		 * * country : string — The country code.
		 * * flagsPath : string — The `flagsPath` property (see above).
		 * * flags : object — The `flags` property (see above).
		 */
		flagComponent : PropTypes.func.isRequired,

		/**
		 * Set to `false` to drop the "International" option from country `<select/>`.
		 */
		international : PropTypes.bool.isRequired,

		/**
		 * Custom "International" country `<select/>` option icon.
		 */
		internationalIcon : PropTypes.func.isRequired,

		/**
		 * Set to `false` to hide country `<select/>`.
		 */
		// (is `true` by default)
		showCountrySelect : PropTypes.bool.isRequired,

		/**
		 * HTML `tabindex` attribute for country `<select/>`.
		 */
		countrySelectTabIndex : PropTypes.number,

		/**
		 * Can be used to place some countries on top of the list of country `<select/>` options.
		 *
		 * * `"|"` — inserts a separator.
		 * * `"..."` — means "the rest of the countries" (can be omitted).
		 *
		 * Example:
		 *
		 * `["US", "CA", "AU", "|", "..."]`
		 */
		countryOptions : PropTypes.arrayOf(PropTypes.string),

		/**
		 * `<Phone/>` component CSS style object.
		 */
		style : PropTypes.object,

		/**
		 * `<Phone/>` component CSS class.
		 */
		className : PropTypes.string,

		/**
		 * Phone number `<input/>` CSS class.
		 */
		inputClassName : PropTypes.string,

		/**
		 * Returns phone number `<input/>` CSS class string.
		 * Receives an object of shape `{ disabled : boolean?, invalid : boolean? }`.
		 * @ignore
		 */
		getInputClassName : PropTypes.func,

		/**
		 * Country `<select/>` component.
		 *
		 * Receives properties:
		 *
		 * * `name : string?` — HTML `name` attribute.
		 * * `value : string?` — The currently selected country code.
		 * * `onChange(value : string?)` — Updates the `value`.
		 * * `onFocus()` — Is used to toggle the `--focus` CSS class.
		 * * `onBlur()` — Is used to toggle the `--focus` CSS class.
		 * * `options : object[]` — The list of all selectable countries (including "International") each being an object of shape `{ value : string?, label : string, icon : React.Component }`.
		 * * `disabled : boolean?` — HTML `disabled` attribute.
		 * * `tabIndex : (number|string)?` — HTML `tabIndex` attribute.
		 * * `className : string` — CSS class name.
		 */
		//
		// (deprecated)
		// * `hidePhoneInputField(hide : boolean)` — Can be called to show/hide phone input field. Takes `hide : boolean` argument. E.g. `react-responsive-ui` `<Select/>` uses this to hide phone number input when country select is expanded.
		// * `focusPhoneInputField()` — Can be called to manually focus phone input field. E.g. `react-responsive-ui` `<Select/>` uses this to focus phone number input after country selection in a timeout (after the phone input field is no longer hidden).
		//
		countrySelectComponent : PropTypes.func.isRequired,

		/**
		 * Phone number `<input/>` component.
		 *
		 * Receives properties:
		 *
		 * * `value : string` — The parsed phone number. E.g.: `""`, `"+"`, `"+123"`, `"123"`.
		 * * `onChange(value : string)` — Updates the `value`.
		 * * `onFocus()` — Is used to toggle the `--focus` CSS class.
		 * * `onBlur()` — Is used to toggle the `--focus` CSS class.
		 * * `country : string?` — The currently selected country. `undefined` means "International" (no country selected).
		 * * `metadata : object` — `libphonenumber-js` metadata.
		 * * All other properties should be passed through to the underlying `<input/>`.
		 *
		 * Must also implement `.focus()` method.
		 */
		inputComponent : PropTypes.func.isRequired,

		/**
		 * Set to `false` to use `inputComponent={InputBasic}`
		 * instead of `input-format`'s `<ReactInput/>`.
		 * Is `false` by default.
		 */
		// smartCaret : PropTypes.bool.isRequired,

		/**
		 * Phone number extension `<input/>` element.
		 *
		 * Example:
		 *
		 *	`ext={<input value={...} onChange={...}/>}`
		 */
		ext : PropTypes.node,

		/**
		 * If set to `true` the phone number input will get trimmed
		 * if it exceeds the maximum length for the country.
		 */
		limitMaxLength : PropTypes.bool.isRequired,

		/**
		 * An error message to show below the phone number `<input/>`. For example, `"Required"`.
		 */
		error : PropTypes.string,

		/**
		 * The `error` is shown only when `indicateInvalid` is `true`.
		 * (which is the default).
		 * @deprecated
		 * @ignore
		 */
		indicateInvalid : PropTypes.bool,

		/**
		 * Translation JSON object. See the `locales` directory for examples.
		 */
		locale : PropTypes.objectOf(PropTypes.string),

		/**
		 * `libphonenumber-js` metadata.
		 *
		 * Can be used to pass custom `libphonenumber-js` metadata
		 * to reduce the overall bundle size for those who compile "custom" metadata.
		 */
		metadata : metadataPropType.isRequired,

		/**
		 * A long time ago a person requested an `onCountryChange(country)` event listener.
		 * No valid reason was given other than compliance with some legacy code
		 * which stored both phone number and country in a database.
		 * @see  https://github.com/catamphetamine/react-phone-number-input/issues/128
		 */
		onCountryChange : PropTypes.func
	}

	static defaultProps =
	{
		/**
		 * Not disabled.
		 */
		disabled: false,

		/**
		 * Show `error` (if passed).
		 * @deprecated
		 */
		indicateInvalid : true,

		/**
		 * Remember (and autofill) the value as a phone number.
		 */
		autoComplete: 'tel',

		/**
		 * Flag icon component.
		 */
		flagComponent: FlagComponent,

		/**
		 * By default use icons from `flag-icon-css` github repo.
		 */
		flagsPath: 'https://lipis.github.io/flag-icon-css/flags/4x3/',

		/**
		 * Default "International" country `<select/>` option icon (globe).
		 */
		 // internationalIcon: InternationalIcon,

		/**
		 * Phone number `<input/>` component.
		 */
		inputComponent: InputBasic,

		/**
		 * Show country `<select/>`.
		 */
		showCountrySelect: true,

		/**
		 * Don't convert the initially passed phone number `value`
		 * to a national phone number for its country.
		 * The reason is that the newer generation grows up when
		 * there are no stationary phones and therefore everyone inputs
		 * phone numbers with a `+` in their smartphones
		 * so phone numbers written in international form
		 * are gradually being considered more natural than local ones.
		 */
		displayInitialValueAsLocalNumber: false,

		/**
		 * Set to `false` to use `inputComponent={InputBasic}`
		 * instead of `input-format`'s `<ReactInput/>`.
		 * Is `false` by default.
		 */
		// smartCaret : false,

		/**
		 * Whether to add the "International" option
		 * to the list of countries.
		 */
		international : true,

		/**
		 * If set to `true` the phone number input will get trimmed
		 * if it exceeds the maximum length for the country.
		 */
		limitMaxLength : false
	}

	constructor(props)
	{
		super(props)

		const
		{
			value,
			country,
			countries,
			countryOptions,
			labels,
			international,
			metadata
		}
		= this.props

		if (country) {
			validateCountry(country, metadata)
		}
		if (countries) {
			validateCountries(countries, metadata)
		}
		if (countryOptions) {
			validateCountryOptions(countryOptions, metadata)
		}

		const parsed_number = parsePhoneNumber(value, metadata)

		const pre_selected_country = getPreSelectedCountry
		(
			parsed_number,
			country,
			countries || getCountryCodes(labels),
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

			// `parsed_input` state property holds non-formatted user's input.
			// The reason is that there's no way of finding out
			// in which form should `value` be displayed: international or national.
			// E.g. if `value` is `+78005553535` then it could be input
			// by a user both as `8 (800) 555-35-35` and `+7 800 555 35 35`.
			// Hence storing just `value`is not sufficient for correct formatting.
			// E.g. if a user entered `8 (800) 555-35-35`
			// then value is `+78005553535` and `parsed_input` is `88005553535`
			// and if a user entered `+7 800 555 35 35`
			// then value is `+78005553535` and `parsed_input` is `+78005553535`.
			parsed_input : generateParsedInput(value, parsed_number, this.props),

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

	componentDidUpdate(prevProps) {
		const {
			country,
			countries,
			countryOptions,
			metadata
		} = this.props

		if (country && country !== prevProps.country) {
			validateCountry(country, metadata)
		}
		if (countries && countries !== prevProps.countries) {
			validateCountries(countries, metadata)
		}
		if (countryOptions && countryOptions !== prevProps.countryOptions) {
			validateCountryOptions(countryOptions, metadata)
		}
	}

	// Country `<select/>` `onChange` handler.
	onCountryChange = (new_country) =>
	{
		const
		{
			metadata,
			onChange,
			onCountryChange,
			displayInitialValueAsLocalNumber
		}
		= this.props

		const
		{
			parsed_input : old_parsed_input,
			country      : old_country
		}
		= this.state

		// After the new `country` has been selected,
		// if the phone number `<input/>` holds any digits
		// then migrate those digits for the new `country`.
		const new_parsed_input = migrateParsedInputForNewCountry
		(
			old_parsed_input,
			old_country,
			new_country,
			metadata,
			displayInitialValueAsLocalNumber
		)

		const new_value = e164(new_parsed_input, new_country, metadata)

		if (onCountryChange) {
			onCountryChange(new_country)
		}

		// Focus phone number `<input/>` upon country selection.
		this.focus()

		this.setState
		({
			country           : new_country,
			hasChangedCountry : true,
			parsed_input      : new_parsed_input,
			value             : new_value
		},
		() =>
		{
			// Update the new `value` property.
			// Doing it after the `state` has been updated
			// because `onChange()` will trigger `getDerivedStateFromProps()`
			// with the new `value` which will be compared to `state.value` there.
			onChange(new_value)
		})
	}

	// Phone number `<input/>` `onKeyDown` handler.
	onPhoneNumberKeyDown = (event) =>
	{
		const { onKeyDown } = this.props

		// Actually "Down arrow" key is used for showing "autocomplete" ("autofill") options.
		// (e.g. previously entered phone numbers for `autoComplete="tel"`)
		// so can't hijack "Down arrow" keypress here.
		// // Expand country `<select/>`` on "Down arrow" key press.
		// if (event.keyCode === 40) {
		// 	this.country_select.toggle()
		// }

		if (onKeyDown) {
			onKeyDown(event)
		}
	}

	// `<input/>` `onChange` handler.
	// Updates `value` property accordingly.
	// (so that they are kept in sync).
	// `parsed_input` must be a parsed phone number
	// or an empty string.
	// E.g.: `""`, `"+"`, `"+123"`, `"123"`.
	onChange = (parsed_input) =>
	{
		const
		{
			onChange,
			onCountryChange,
			countries,
			international,
			limitMaxLength,
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
				const old_country = country
				country = getCountryForParsedInput
				(
					parsed_input,
					country,
					countries,
					international,
					metadata
				)

				if (country !== old_country && onCountryChange) {
					onCountryChange(country)
				}
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

		// Trim the input to not exceed the maximum possible number length.
		if (limitMaxLength) {
			parsed_input = trimNumber(parsed_input, country, metadata)
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

	// Toggles the `--focus` CSS class.
	_onFocus = () => this.setState({ isFocused: true })

	// Toggles the `--focus` CSS class.
	_onBlur = () => this.setState({ isFocused: false })

	onFocus = (event) =>
	{
		const { onFocus } = this.props

		this._onFocus()

		if (onFocus) {
			onFocus(event)
		}
	}

	// This `onBlur` interceptor is a workaround for `redux-form`
	// so that it gets the up-to-date `value` in its `onBlur` handler.
	// Without this fix it just gets the actual (raw) input field textual value.
	// E.g. `+7 800 555 35 35` instead of `+78005553535`.
	//
	// A developer is not supposed to pass this `onBlur` property manually.
	// Instead, `redux-form` passes `onBlur` to this component automatically
	// and this component patches that `onBlur` handler (a hacky way but works).
	//
	onBlur = (event) =>
	{
		const { onBlur } = this.props
		const { value } = this.state

		this._onBlur()

		if (!onBlur) {
			return
		}

		// `event` is React's `SyntheticEvent`.
		// Its `.value` is read-only therefore cloning it.
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
	hidePhoneInputField = (hide) =>
	{
		this.setState({
			hidePhoneInputField: hide
		})
	}

	// Can be called externally.
	focus = () => this.number_input.focus()

	storeCountrySelectInstance = _ => this.country_select = _

	storePhoneNumberInputInstance = _ => this.number_input = _

	static getDerivedStateFromProps(props, state)
	{
		const
		{
			country,
			hasChangedCountry,
			value,
			props:
			{
				country : old_default_country,
				value   : old_value
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

		// Emulate `prevProps` via `state.props`.
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
		// then select it but only if the user didn't previously select
		// another country and no phone number has been entered so far.
		// Because if the user has already started inputting a phone number
		// then he's okay with no country being selected at all ("International")
		// and doesn't want to be disturbed, doesn't want his input to be screwed, etc.
		if (new_default_country !== old_default_country && !hasChangedCountry && !value && !new_value)
		{
			return {
				...new_state,
				country : new_default_country
			}
		}
		// If a new `value` is set externally.
		// (e.g. as a result of an ajax API request
		//  to get user's phone after page loaded)
		// The first part — `new_value !== old_value` —
		// is basically `props.value !== prevProps.value`
		// so it means "if value property was changed externally".
		// The second part — `new_value !== value` —
		// is for ignoring the `getDerivedStateFromProps()` call
		// which happens in `this.onChange()` right after `this.setState()`.
		// If this `getDerivedStateFromProps()` call isn't ignored
		// then the country flag would reset on each input.
		else if (new_value !== old_value && new_value !== value)
		{
			const parsed_number = parsePhoneNumber(new_value, metadata)

			return {
				...new_state,
				parsed_input : generateParsedInput(new_value, parsed_number, props),
				value : new_value,
				country : new_value ? parsed_number.country : country
			}
		}

		// Maybe `new_state.country_select_options` changed.
		// In any case, update `prevProps`.
		return new_state
	}

	render()
	{
		const
		{
			name,
			disabled,
			autoComplete,
			countrySelectTabIndex,
			showCountrySelect,
			style,
			className,
			inputClassName,
			getInputClassName,
			countrySelectProperties,

			error,
			indicateInvalid,

			countrySelectComponent : CountrySelectComponent,
			inputComponent : InputComponent,
			// smartCaret,
			ext,

			// Extract `phoneNumberInputProps` via "object rest spread":
			countries,
			countryOptions,
			labels,
			country : _,
			flags,
			flagComponent,
			flagsPath,
			international,
			internationalIcon,
			displayInitialValueAsLocalNumber,
			onCountryChange,
			limitMaxLength,
			locale,
			metadata,
			...phoneNumberInputProps
		}
		= this.props

		const
		{
			country,
			hidePhoneInputField,
			country_select_options,
			parsed_input,
			isFocused
		}
		= this.state

		// const InputComponent = inputComponent || (smartCaret ? InputSmart : InputBasic)

		// Extract `countrySelectProperties` from `this.props`
		// also removing them from `phoneNumberInputProps`.
		const _countrySelectProps = {}
		if (countrySelectProperties)
		{
			for (const key in countrySelectProperties)
			{
				if (this.props.hasOwnProperty(key))
				{
					_countrySelectProps[countrySelectProperties[key]] = this.props[key]
					delete phoneNumberInputProps[key]
				}
			}
		}

		return (
			<div
				style={ style }
				className={ classNames('react-phone-number-input',
				{
					'react-phone-number-input--focus'   : isFocused,
					'react-phone-number-input--invalid' : error && indicateInvalid
				},
				className) }>

				{/* Country `<select/>` and phone number `<input/>` */}
				<div className="react-phone-number-input__row">

					{/* Country `<select/>` */}
					{ showCountrySelect &&
						<CountrySelectComponent
							{..._countrySelectProps}
							ref={ this.storeCountrySelectInstance }
							name={ name ? `${name}__country` : undefined }
							value={ country }
							options={ country_select_options }
							onChange={ this.onCountryChange }
							onFocus={ this._onFocus }
							onBlur={ this._onBlur }
							disabled={ disabled }
							tabIndex={ countrySelectTabIndex }
							hidePhoneInputField={ this.hidePhoneInputField }
							focusPhoneInputField={ this.focus }
							className="react-phone-number-input__country"/>
					}

					{/* Phone number `<input/>` */}
					{ !hidePhoneInputField &&
						<InputComponent
							type="tel"
							name={ name }
							{ ...phoneNumberInputProps }
							ref={ this.storePhoneNumberInputInstance }
							metadata={ metadata }
							country={ country }
							value={ parsed_input || '' }
							onChange={ this.onChange }
							onFocus={ this.onFocus }
							onBlur={ this.onBlur }
							onKeyDown={ this.onPhoneNumberKeyDown }
							disabled={ disabled }
							autoComplete={ autoComplete }
							className={ classNames
							(
								'react-phone-number-input__input',
								'react-phone-number-input__phone',
								{
									'react-phone-number-input__input--disabled' : disabled,
									'react-phone-number-input__input--invalid'  : error && indicateInvalid
								},
								inputClassName,
								getInputClassName && getInputClassName({ disabled, invalid: error && indicateInvalid })
							) }/>
					}

					{/* Phone extension `<input/>` */}
					{ ext && !hidePhoneInputField &&
						<label className="react-phone-number-input__ext">
							{labels.ext}
							{React.cloneElement(ext,
							{
								type : ext.props.type === undefined ? 'number' : ext.props.type,
								onFocus : this._onFocus,
								onBlur : this._onBlur,
								className : classNames
								(
									'react-phone-number-input__input',
									'react-phone-number-input__ext-input',
									{
										'react-phone-number-input__input--disabled' : disabled,
									},
									inputClassName,
									getInputClassName && getInputClassName({ disabled }),
									ext.props.className
								)
							})}
						</label>
					}
				</div>

				{/* Error message */}
				{ error && indicateInvalid &&
					<div className="react-phone-number-input__error">
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
		international,
		countryOptions
	}
	= props

	const CountrySelectOptionIcon = createCountrySelectOptionIconComponent(props)

	return transformCountryOptions(getCountrySelectOptions
	(
		countries || getCountryCodes(labels),
		labels,
		international
	)
	.map(({ value, label }) =>
	({
		value,
		label,
		icon : CountrySelectOptionIcon
	})),
	countryOptions)
}

function createCountrySelectOptionIconComponent(props)
{
	const
	{
		flags,
		flagsPath,
		flagComponent : FlagComponent,
		internationalIcon : InternationalIcon
	}
	= props

	return ({ value }) => (
		<div
			className={classNames('react-phone-number-input__icon',
			{
				'react-phone-number-input__icon--international': value === undefined
			})}>
			{
				value
				?
				<FlagComponent
					country={value}
					flags={flags}
					flagsPath={flagsPath}/>
				:
				<InternationalIcon/>
			}
		</div>
	)
}

// Can move some country `<select/>` options
// to the top of the list, for example.
// See `countryOptions` property.
function transformCountryOptions(options, transform)
{
	if (!transform) {
		return options
	}

	const optionsOnTop = []
	const optionsOnBottom = []
	let appendTo = optionsOnTop

	for (const element of transform)
	{
		if (element === '|')
		{
			appendTo.push({ divider: true })
		}
		else if (element === '...' || element === '…')
		{
			appendTo = optionsOnBottom
		}
		else
		{
			// Find the position of the option.
			const index = options.indexOf(options.filter(option => option.value === element)[0])
			// Get the option.
			const option = options[index]
			// Remove the option from its default position.
			options.splice(index, 1)
			// Add the option on top.
			appendTo.push(option)
		}
	}

	return optionsOnTop.concat(options).concat(optionsOnBottom)
}

function generateParsedInput(value, parsed_number, props)
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

function validateCountryOptions(countries, metadata) {
	for (const country of countries) {
		if (country && country !== '|' && country !== '...' && country !== '…') {
			if (!metadata.countries[country]) {
				throwCountryNotFound(country)
			}
		}
	}
}

function validateCountries(countries, metadata) {
	for (const country of countries) {
		if (!metadata.countries[country]) {
			throwCountryNotFound(country)
		}
	}
}

function validateCountry(country, metadata) {
	if (!metadata.countries[country]) {
		throwCountryNotFound(country)
	}
}

function throwCountryNotFound(country) {
	throw new Error(`Country not found: ${country}`)
}
