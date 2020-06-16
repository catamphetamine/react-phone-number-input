import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import InputSmart from './InputSmart'
import InputBasic from './InputBasic'

import Flag from './Flag'
import InternationalIcon from './InternationalIcon'

import {
	sortCountryOptions,
	isCountrySupportedWithError,
	getSupportedCountries,
	getSupportedCountryOptions,
	getCountries
} from './countries'

import { createCountryIconComponent } from './CountryIcon'

import {
	metadata as metadataPropType,
	labels as labelsPropType
} from './PropTypes'

import {
	getPreSelectedCountry,
	getCountrySelectOptions,
	parsePhoneNumber,
	generateNationalNumberDigits,
	migrateParsedInputForNewCountry,
	getCountryForPartialE164Number,
	getInitialParsedInput,
	parseInput,
	e164
} from './phoneInputHelpers'

class PhoneNumberInput_ extends React.PureComponent {
	inputRef = React.createRef()

	constructor(props) {
		super(props)

		const {
			value,
			labels,
			addInternationalOption,
			metadata,
			countryOptionsOrder
		} = this.props

		let {
			defaultCountry,
			countries
		} = this.props

		// Validate `defaultCountry`.
		if (defaultCountry) {
			if (!this.isCountrySupportedWithError(defaultCountry)) {
				defaultCountry = undefined
			}
		}

		// Validate `countries`.
		countries = getSupportedCountries(countries, metadata)

		const phoneNumber = parsePhoneNumber(value, metadata)

		this.CountryIcon = createCountryIconComponent(this.props)

		this.state = {
			// Workaround for `this.props` inside `getDerivedStateFromProps()`.
			props: this.props,

			// The country selected.
			country: getPreSelectedCountry(
				phoneNumber,
				defaultCountry,
				countries || getCountries(metadata),
				addInternationalOption,
				metadata
			),

			// `countries` are stored in `this.state` because they're filtered.
			// For example, a developer might theoretically pass some unsupported
			// countries as part of the `countries` property, and because of that
			// the component uses `this.state.countries` (which are filtered)
			// instead of `this.props.countries`
			// (which could potentially contain unsupported countries).
			countries,

			// `parsedInput` state property holds non-formatted user's input.
			// The reason is that there's no way of finding out
			// in which form should `value` be displayed: international or national.
			// E.g. if `value` is `+78005553535` then it could be input
			// by a user both as `8 (800) 555-35-35` and `+7 800 555 35 35`.
			// Hence storing just `value`is not sufficient for correct formatting.
			// E.g. if a user entered `8 (800) 555-35-35`
			// then value is `+78005553535` and `parsedInput` is `88005553535`
			// and if a user entered `+7 800 555 35 35`
			// then value is `+78005553535` and `parsedInput` is `+78005553535`.
			parsedInput: generateInitialParsedInput(value, phoneNumber, this.props),

			// `value` property is duplicated in state.
			// The reason is that `getDerivedStateFromProps()`
			// needs this `value` to compare to the new `value` property
			// to find out if `parsedInput` needs updating:
			// If the `value` property was changed externally
			// then it won't be equal to `state.value`
			// in which case `parsedInput` and `country` should be updated.
			value
		}
	}

	componentDidMount() {
		const { onCountryChange } = this.props
		let { defaultCountry } = this.props
		const { country: selectedCountry } = this.state
		if (onCountryChange) {
			if (defaultCountry) {
				if (!this.isCountrySupportedWithError(defaultCountry)) {
					defaultCountry = undefined
				}
			}
			if (selectedCountry !== defaultCountry) {
				onCountryChange(selectedCountry)
			}
		}
	}

	componentDidUpdate(prevProps, prevState) {
		const { onCountryChange } = this.props
		const { country } = this.state
		// Call `onCountryChange` when user selects another country.
		if (onCountryChange && country !== prevState.country) {
			onCountryChange(country)
		}
	}

	// A shorthand for not passing `metadata` as a second argument.
	isCountrySupportedWithError = (country) => {
		const { metadata } = this.props
		return isCountrySupportedWithError(country, metadata)
	}

	// Country `<select/>` `onChange` handler.
	onCountryChange = (newCountry) => {
		const {
			international,
			metadata,
			onChange
		} = this.props

		const {
			parsedInput: prevParsedInput,
			country: prevCountry
		} = this.state

		// After the new `country` has been selected,
		// if the phone number `<input/>` holds any digits
		// then migrate those digits for the new `country`.
		const newParsedInput = migrateParsedInputForNewCountry(
			prevParsedInput,
			prevCountry,
			newCountry,
			metadata,
			// Convert the phone number to "national" format
			// when the user changes the selected country by hand.
			international ? false : true
		)

		const newValue = e164(newParsedInput, newCountry, metadata)

		// Focus phone number `<input/>` upon country selection.
		this.getInputRef().current.focus()

		// If the user has already manually selected a country
		// then don't override that already selected country
		// if the `defaultCountry` property changes.
		// That's what `hasUserSelectedACountry` flag is for.

		this.setState({
			country: newCountry,
			hasUserSelectedACountry: true,
			parsedInput: newParsedInput,
			value: newValue
		},
		() => {
			// Update the new `value` property.
			// Doing it after the `state` has been updated
			// because `onChange()` will trigger `getDerivedStateFromProps()`
			// with the new `value` which will be compared to `state.value` there.
			onChange(newValue)
		})
	}

	/**
	 * `<input/>` `onChange()` handler.
	 * Updates `value` property accordingly (so that they are kept in sync).
	 * @param {string?} input — Either a parsed phone number or an empty string. Examples: `""`, `"+"`, `"+123"`, `"123"`.
	 */
	onChange = (_input) => {
		const {
			defaultCountry,
			onChange,
			addInternationalOption,
			international,
			limitMaxLength,
			metadata
		} = this.props

		const {
			input,
			country,
			value
		} = parseInput(
			_input,
			this.state.parsedInput,
			this.state.country,
			defaultCountry,
			this.state.countries,
			addInternationalOption,
			international,
			limitMaxLength,
			metadata
		)

		this.setState({
			parsedInput: input,
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

	onFocus = (event) => {
		this._onFocus()
		const { onFocus } = this.props
		if (onFocus) {
			onFocus(event)
		}
	}

	onBlur = (event) => {
		const { onBlur } = this.props
		this._onBlur()
		if (onBlur) {
			onBlur(event)
		}
	}

	onCountryFocus = (event) => {
		this._onFocus()
		// this.setState({ countrySelectFocused: true })
		const { countrySelectProps } = this.props
		if (countrySelectProps) {
			const { onFocus } = countrySelectProps
			if (onFocus) {
				onFocus(event)
			}
		}
	}

	onCountryBlur = (event) => {
		this._onBlur()
		// this.setState({ countrySelectFocused: false })
		const { countrySelectProps } = this.props
		if (countrySelectProps) {
			const { onBlur } = countrySelectProps
			if (onBlur) {
				onBlur(event)
			}
		}
	}

	getInputRef() {
		const { inputRef } = this.props
		return inputRef || this.inputRef
	}

	// `state` holds previous props as `props`, and also:
	// * `country` — The currently selected country, e.g. `"RU"`.
	// * `value` — The currently entered phone number (E.164), e.g. `+78005553535`.
	// * `parsedInput` — The parsed `<input/>` value, e.g. `8005553535`.
	// (and a couple of other less significant properties)
	static getDerivedStateFromProps(props, state) {
		const {
			country,
			hasUserSelectedACountry,
			value,
			props: {
				defaultCountry: prevDefaultCountry,
				value: prevValue,
				reset: prevReset
			}
		} = state

		const {
			metadata,
			countries,
			defaultCountry: newDefaultCountry,
			value: newValue,
			reset: newReset,
			international
		} = props

		const newState = {
			// Emulate `prevProps` via `state.props`.
			props,
			// If the user has already manually selected a country
			// then don't override that already selected country
			// if the `defaultCountry` property changes.
			// That's what `hasUserSelectedACountry` flag is for.
			hasUserSelectedACountry
		}

		// Some users requested a way to reset the component
		// (both number `<input/>` and country `<select/>`).
		// Whenever `reset` property changes both number `<input/>`
		// and country `<select/>` are reset.
		// It's not implemented as some instance `.reset()` method
		// because `ref` is forwarded to `<input/>`.
		// It's also not replaced with just resetting `country` on
		// external `value` reset, because a user could select a country
		// and then not input any `value`, and so the selected country
		// would be "stuck", if not using this `reset` property.
		// https://github.com/catamphetamine/react-phone-number-input/issues/300
		if (newReset !== prevReset) {
			return {
				...newState,
				parsedInput: undefined,
				value: undefined,
				country: newDefaultCountry,
				hasUserSelectedACountry: undefined
			}
		}

		// If the default country changed.
		// (e.g. in case of ajax GeoIP detection after page loaded)
		// then select it but only if the user hasn't already manually
		// selected a country and no phone number has been entered so far.
		// Because if the user has already started inputting a phone number
		// then he's okay with no country being selected at all ("International")
		// and doesn't want to be disturbed, doesn't want his input to be screwed, etc.
		if (newDefaultCountry !== prevDefaultCountry &&
			!hasUserSelectedACountry && (
				(!value && !newValue) ||
				(international &&
					value === getInitialParsedInput(undefined, prevDefaultCountry, international, metadata) &&
					value === getInitialParsedInput(undefined, newDefaultCountry, international, metadata)
				)
			)
		) {
			return {
				...newState,
				country: isCountrySupportedWithError(newDefaultCountry, metadata) ? newDefaultCountry : prevDefaultCountry,
				// If `parsedInput` is empty, then automatically select the new `country`
				// and set `parsedInput` to `+{getCountryCallingCode(newCountry)}`.
				parsedInput: generateInitialParsedInput(newValue, undefined, props)
				// `value` is `undefined`.
				// `parsedInput` is `undefined` because `value` is `undefined`.
			}
		}
		// If a new `value` is set externally.
		// (e.g. as a result of an ajax API request
		//  to get user's phone after page loaded)
		// The first part — `newValue !== prevValue` —
		// is basically `props.value !== prevProps.value`
		// so it means "if value property was changed externally".
		// The second part — `newValue !== value` —
		// is for ignoring the `getDerivedStateFromProps()` call
		// which happens in `this.onChange()` right after `this.setState()`.
		// If this `getDerivedStateFromProps()` call isn't ignored
		// then the country flag would reset on each input.
		else if (newValue !== prevValue && newValue !== value) {
			const phoneNumber = parsePhoneNumber(newValue, metadata)
			let parsedCountry
			if (phoneNumber) {
				const countries = getSupportedCountries(props.countries, metadata)
				if (!countries || countries.indexOf(phoneNumber.country) >= 0) {
					parsedCountry = phoneNumber.country
				}
			}
			if (!newValue) {
				newState.hasUserSelectedACountry = undefined
			}
			return {
				...newState,
				parsedInput: generateInitialParsedInput(newValue, phoneNumber, props),
				value: newValue,
				country: newValue ? parsedCountry : newDefaultCountry
			}
		}

		// `defaultCountry` didn't change.
		// `value` didn't change.
		// `parsedInput` didn't change, because `value` didn't change.
		//
		// So no need to update state here really.
		// Could as well return `null` explicitly
		// to indicate that the `state` hasn't changed.
		// But just in case, returns `newState`.
		// (who knows if someone adds something
		// changing `newState` above in some future)
		return newState
	}

	render() {
		const {
			// Generic HTML attributes.
			name,
			disabled,
			autoComplete,
			style,
			className,

			// Number `<input/>` properties.
			inputRef,
			inputComponent,
			numberInputProps,
			smartCaret,

			// Country `<select/>` properties.
			countrySelectComponent: CountrySelectComponent,
			countrySelectProps,

			// Container `<div/>` properties.
			containerComponent: ContainerComponent,

			// Get "rest" properties (passed through to number `<input/>`).
			defaultCountry,
			countries,
			countryOptionsOrder,
			labels,
			flags,
			flagComponent,
			flagUrl,
			addInternationalOption,
			internationalIcon,
			displayInitialValueAsLocalNumber,
			onCountryChange,
			limitMaxLength,
			reset,
			metadata,
			international,
			...rest
		} = this.props

		const {
			country,
			parsedInput,
			isFocused
		} = this.state

		const InputComponent = smartCaret ? InputSmart : InputBasic

		const countrySelectOptions = useMemoCountrySelectOptions(() => {
			return sortCountryOptions(
				getCountrySelectOptions(
					countries || getCountries(metadata),
					labels,
					addInternationalOption
				),
				getSupportedCountryOptions(countryOptionsOrder, metadata)
			)
		}, [
			countries,
			countryOptionsOrder,
			addInternationalOption,
			labels,
			metadata
		])

		return (
			<ContainerComponent
				style={style}
				className={classNames(className, 'PhoneInput', {
					'PhoneInput--focus': isFocused
				})}>

				{/* Country `<select/>` */}
				<CountrySelectComponent
					name={name ? `${name}Country` : undefined}
					aria-label={labels.country}
					{...countrySelectProps}
					value={country}
					options={countrySelectOptions}
					onChange={this.onCountryChange}
					onFocus={this.onCountryFocus}
					onBlur={this.onCountryBlur}
					disabled={disabled || (countrySelectProps && countrySelectProps.disabled)}
					iconComponent={this.CountryIcon}/>

				{/* Phone number `<input/>` */}
				<InputComponent
					ref={this.getInputRef()}
					type="tel"
					autoComplete={autoComplete}
					{...numberInputProps}
					{...rest}
					name={name}
					metadata={metadata}
					country={country}
					value={parsedInput || ''}
					onChange={this.onChange}
					onFocus={this.onFocus}
					onBlur={this.onBlur}
					disabled={disabled}
					inputComponent={inputComponent}
					className={classNames(
						'PhoneInputInput',
						numberInputProps && numberInputProps.className,
						rest.className
					)}/>
			</ContainerComponent>
		)
	}
}

// This wrapper is only to `.forwardRef()` to the `<input/>`.
const PhoneNumberInput = React.forwardRef((props, ref) => (
	<PhoneNumberInput_ {...props} inputRef={ref}/>
))

PhoneNumberInput.propTypes = {
	/**
	 * Phone number in `E.164` format.
	 *
	 * Example:
	 *
	 * `"+12223333333"`
	 */
	value: PropTypes.string,

	/**
	 * Updates the `value` as the user inputs the phone number.
	 */
	onChange: PropTypes.func.isRequired,

	/**
	 * Toggles the `--focus` CSS class.
	 * @ignore
	 */
	onFocus: PropTypes.func,

	/**
	 * `onBlur` is usually passed by `redux-form`.
	 * @ignore
	 */
	onBlur: PropTypes.func,

	/**
	 * `onKeyDown` handler (e.g. to handle Enter key press).
	 * @ignore
	 */
	onKeyDown: PropTypes.func,

	/**
	 * Set to `true` to disable both the phone number `<input/>`
	 * and the country `<select/>`.
	 */
	disabled: PropTypes.bool,

	/**
	 * Sets `autoComplete` property for phone number `<input/>`.
	 *
	 * Web browser's "autocomplete" feature
	 * remembers the phone number being input
	 * and can also autofill the `<input/>`
	 * with previously remembered phone numbers.
	 *
	 * https://developers.google.com
	 * /web/updates/2015/06/checkout-faster-with-autofill
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
	autoComplete: PropTypes.string.isRequired,

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
	displayInitialValueAsLocalNumber: PropTypes.bool.isRequired,

	/**
	 * The country to be selected by default.
	 * For example, can be set after a GeoIP lookup.
	 *
	 * Example: `"US"`.
	 */
	// A two-letter country code ("ISO 3166-1 alpha-2").
	defaultCountry: PropTypes.string,

	/**
	 * If specified, only these countries will be available for selection.
	 *
	 * Example:
	 *
	 * `["RU", "UA", "KZ"]`
	 */
	countries: PropTypes.arrayOf(PropTypes.string),

	/**
	 * Custom country `<select/>` option names.
	 * Also some labels like "ext" and country `<select/>` `aria-label`.
	 *
	 * Example:
	 *
	 * `{ "ZZ": "Международный", RU: "Россия", US: "США", ... }`
	 *
	 * See the `locales` directory for examples.
	 */
	labels: labelsPropType.isRequired,

	/**
	 * A URL template of a country flag, where
	 * "{XX}" is a two-letter country code in upper case,
	 * or where "{xx}" is a two-letter country code in lower case.
	 * By default it points to `country-flag-icons` gitlab pages website.
	 * I imagine someone might want to download those country flag icons
	 * and host them on their own servers instead
	 * (all flags are available in the `country-flag-icons` library).
	 * There's a catch though: new countries may be added in future,
	 * so when hosting country flag icons on your own server
	 * one should check the `CHANGELOG.md` every time before updating this library,
	 * otherwise there's a possibility that some new country flag would be missing.
	 */
	flagUrl: PropTypes.string.isRequired,

	/**
	 * Custom country flag icon components.
	 * These flags will be used instead of the default ones.
	 * The the "Flags" section of the readme for more info.
	 *
	 * The shape is an object where keys are country codes
	 * and values are flag icon components.
	 * Flag icon components receive the same properties
	 * as `flagComponent` (see below).
	 *
	 * Example:
	 *
	 * `{ "RU": (props) => <img src="..."/> }`
	 *
	 * Example:
	 *
	 * `import flags from 'country-flag-icons/react/3x2'`
	 *
	 * `import PhoneInput from 'react-phone-number-input'`
	 *
	 * `<PhoneInput flags={flags} .../>`
	 */
	flags: PropTypes.objectOf(PropTypes.elementType),

	/**
	 * Country flag icon component.
	 *
	 * Takes properties:
	 *
	 * * `country: string` — The country code.
	 * * `countryName: string` — The country name.
	 * * `flagUrl: string` — The `flagUrl` property (see above).
	 * * `flags: object` — The `flags` property (see above).
	 */
	flagComponent: PropTypes.elementType.isRequired,

	/**
	 * Set to `false` to remove the "International" option from country `<select/>`.
	 */
	addInternationalOption: PropTypes.bool.isRequired,

	/**
	 * "International" icon component.
	 * Should have the same aspect ratio.
	 *
	 * Receives properties:
	 *
	 * * `title: string` — "International" country option label.
	 */
	internationalIcon: PropTypes.elementType.isRequired,

	/**
	 * Can be used to place some countries on top of the list of country `<select/>` options.
	 *
	 * * `"|"` — inserts a separator.
	 * * `"..."` — means "the rest of the countries" (can be omitted, in which case it will automatically be added at the end).
	 *
	 * Example:
	 *
	 * `["US", "CA", "AU", "|", "..."]`
	 */
	countryOptionsOrder: PropTypes.arrayOf(PropTypes.string),

	/**
	 * `<Phone/>` component CSS style object.
	 */
	style: PropTypes.object,

	/**
	 * `<Phone/>` component CSS class.
	 */
	className: PropTypes.string,

	/**
	 * Country `<select/>` component.
	 *
	 * Receives properties:
	 *
	 * * `name: string?` — HTML `name` attribute.
	 * * `value: string?` — The currently selected country code.
	 * * `onChange(value: string?)` — Updates the `value`.
	 * * `onFocus()` — Is used to toggle the `--focus` CSS class.
	 * * `onBlur()` — Is used to toggle the `--focus` CSS class.
	 * * `options: object[]` — The list of all selectable countries (including "International") each being an object of shape `{ value: string?, label: string }`.
	 * * `iconComponent: PropTypes.elementType` — React component that renders a country icon: `<Icon country={value}/>`. If `country` is `undefined` then it renders an "International" icon.
	 * * `disabled: boolean?` — HTML `disabled` attribute.
	 * * `tabIndex: (number|string)?` — HTML `tabIndex` attribute.
	 * * `className: string` — CSS class name.
	 */
	countrySelectComponent: PropTypes.elementType.isRequired,

	/**
	 * Country `<select/>` component props.
	 * Along with the usual DOM properties such as `aria-label` and `tabIndex`,
	 * some custom properties are supported, such as `arrowComponent` and `unicodeFlags`.
	 */
	countrySelectProps: PropTypes.object,

	/**
	 * Phone number `<input/>` component.
	 *
	 * Receives properties:
	 *
	 * * `value: string` — The formatted `value`.
	 * * `onChange(event: Event)` — Updates the formatted `value` from `event.target.value`.
	 * * `onFocus()` — Is used to toggle the `--focus` CSS class.
	 * * `onBlur()` — Is used to toggle the `--focus` CSS class.
	 * * Other properties like `type="tel"` or `autoComplete="tel"` that should be passed through to the DOM `<input/>`.
	 *
	 * Must also either use `React.forwardRef()` to "forward" `ref` to the `<input/>` or implement `.focus()` method.
	 */
	inputComponent: PropTypes.elementType.isRequired,

	/**
	 * Wrapping `<div/>` component.
	 *
	 * Receives properties:
	 *
	 * * `style: object` — A component CSS style object.
	 * * `className: string` — Classes to attach to the component, typically changes when component focuses or blurs.
	 */
	containerComponent: PropTypes.elementType.isRequired,

	/**
	 * Phone number `<input/>` component props.
	 */
	numberInputProps: PropTypes.object,

	/**
	 * By default, the caret position is being "intelligently" managed
	 * while a user inputs a phone number.
	 * This "smart" caret behavior can be turned off
	 * by passing `smartCaret={false}` property.
	 * This is just an "escape hatch" for any possible caret position issues.
	 */
	// Is `true` by default.
	smartCaret: PropTypes.bool.isRequired,

	/**
	 * Set to `true` to force "international" phone number format.
	 */
	international: PropTypes.bool,

	/**
	 * If set to `true`, the phone number input will get trimmed
	 * if it exceeds the maximum length for the country.
	 */
	limitMaxLength: PropTypes.bool.isRequired,

	/**
	 * `libphonenumber-js` metadata.
	 *
	 * Can be used to pass custom `libphonenumber-js` metadata
	 * to reduce the overall bundle size for those who compile "custom" metadata.
	 */
	metadata: metadataPropType.isRequired,

	/**
	 * Is called every time the selected country changes:
	 * either programmatically or when user selects it manually from the list.
	 */
	// People have been asking for a way to get the selected country.
	// @see  https://github.com/catamphetamine/react-phone-number-input/issues/128
	// For some it's just a "business requirement".
	// I guess it's about gathering as much info on the user as a website can
	// without introducing any addional fields that would complicate the form
	// therefore reducing "conversion" (that's a marketing term).
	// Assuming that the phone number's country is the user's country
	// is not 100% correct but in most cases I guess it's valid.
	onCountryChange: PropTypes.func
}

PhoneNumberInput.defaultProps = {
	/**
	 * Remember (and autofill) the value as a phone number.
	 */
	autoComplete: 'tel',

	/**
	 * Flag icon component.
	 */
	flagComponent: Flag,

	/**
	 * By default, uses icons from `country-flag-icons` gitlab pages website.
	 */
	// Must be equal to `flagUrl` in `./CountryIcon.js`.
	flagUrl: 'https://catamphetamine.gitlab.io/country-flag-icons/3x2/{XX}.svg',

	/**
	 * Default "International" country `<select/>` option icon.
	 */
	internationalIcon: InternationalIcon,

	/**
	 * Phone number `<input/>` component.
	 */
	inputComponent: 'input',

	/**
	 * Wrapping `<div/>` component.
	 */
	containerComponent: 'div',

	/**
	 * Some users requested a way to reset the component:
	 * both number `<input/>` and country `<select/>`.
	 * Whenever `reset` property changes both number `<input/>`
	 * and country `<select/>` are reset.
	 * It's not implemented as some instance `.reset()` method
	 * because `ref` is forwarded to `<input/>`.
	 * It's also not replaced with just resetting `country` on
	 * external `value` reset, because a user could select a country
	 * and then not input any `value`, and so the selected country
	 * would be "stuck", if not using this `reset` property.
	 */
	// https://github.com/catamphetamine/react-phone-number-input/issues/300
	reset: PropTypes.any,

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
	 * Set to `false` to use "basic" caret instead of the "smart" one.
	 */
	smartCaret: true,

	/**
	 * Whether to add the "International" option
	 * to the list of countries.
	 */
	addInternationalOption: true,

	/**
	 * If set to `true` the phone number input will get trimmed
	 * if it exceeds the maximum length for the country.
	 */
	limitMaxLength: false
}

export default PhoneNumberInput

/**
 * Gets initial `parsedInput` value.
 * @param  {string} [value]
 * @param  {PhoneNumber} [phoneNumber]
 * @param  {boolean} [options.international]
 * @param  {string} [options.defaultCountry]
 * @param  {boolean} options.displayInitialValueAsLocalNumber
 * @param  {object} options.metadata
 * @return {string} [parsedInput]
 */
function generateInitialParsedInput(value, phoneNumber, {
	international,
	defaultCountry,
	metadata,
	displayInitialValueAsLocalNumber
}) {
	// If the `value` (E.164 phone number)
	// belongs to the currently selected country
	// and `displayInitialValueAsLocalNumber` property is `true`
	// then convert `value` (E.164 phone number)
	// to a local phone number digits.
	// E.g. '+78005553535' -> '88005553535'.
	if (displayInitialValueAsLocalNumber && phoneNumber && phoneNumber.country) {
		return generateNationalNumberDigits(phoneNumber)
	}
	return getInitialParsedInput(value, defaultCountry, international, metadata)
}

let countrySelectOptionsMemo
let countrySelectOptionsMemoDependencies
function useMemoCountrySelectOptions(generator, dependencies) {
	if (!countrySelectOptionsMemoDependencies ||
		!areEqualArrays(dependencies, countrySelectOptionsMemoDependencies)) {
		countrySelectOptionsMemo = generator()
		countrySelectOptionsMemoDependencies = dependencies
	}
	return countrySelectOptionsMemo
}

function areEqualArrays(a, b) {
	if (a.length !== b.length) {
		return false
	}
	let i = 0
	while (i < a.length) {
		if (a[i] !== b[i]) {
			return false
		}
		i++
	}
	return true
}