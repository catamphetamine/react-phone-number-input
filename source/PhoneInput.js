import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { polyfill as reactLifecyclesCompat } from "react-lifecycles-compat";
import { parseDigits } from "libphonenumber-js/core";

// import InputSmart from './InputSmart'
import InputBasic from "./InputBasic";

import FlagComponent from "./Flag";

import {
  metadata as metadataPropType,
  labels as labelsPropType
} from "./PropTypes";

import {
  getPreSelectedCountry,
  getCountrySelectOptions,
  parsePhoneNumber,
  generateNationalNumberDigits,
  migrateParsedInputForNewCountry,
  getCountryForPartialE164Number,
  parseInput,
  e164
} from "./input-control";

import { getCountryCodes } from "./countries";

// `PureComponent` is only available in React >= 15.3.0.
const PureComponent = React.PureComponent || React.Component;

@reactLifecyclesCompat
export default class PhoneNumberInput extends PureComponent {
  static propTypes = {
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
     * Disables both the phone number `<input/>`
     * and the country `<select/>`.
     */
    // (is `false` by default)
    disabled: PropTypes.bool.isRequired,

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
    country: PropTypes.string,

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
     * The base URL path for country flag icons.
     * By default it loads country flag icons from
     * `flag-icon-css` repo github pages website.
     * I imagine someone might want to download
     * those country flag icons and host them
     * on their own servers instead.
     * Warning: in future new countries can be added
     * to the country select which would result in
     * "Image not found" errors when using custom `flagsPath`
     * due to the custom-hosted flags bundle being outdated
     * and missing the new flags.
     * So if using custom `flagsPath` always check `CHANGELOG.md`
     * for new country announcements before updating this library.
     */
    flagsPath: PropTypes.string.isRequired,

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
    flags: PropTypes.objectOf(PropTypes.element),

    /**
     * Country flag icon component.
     *
     * Takes properties:
     *
     * * country : string — The country code.
     * * flagsPath : string — The `flagsPath` property (see above).
     * * flags : object — The `flags` property (see above).
     */
    flagComponent: PropTypes.element.isRequired,

    /**
     * Set to `false` to drop the "International" option from country `<select/>`.
     */
    international: PropTypes.bool.isRequired,

    /**
     * Custom "International" country `<select/>` option icon.
     */
    internationalIcon: PropTypes.element.isRequired,

    /**
     * Set to `false` to hide country `<select/>`.
     */
    // (is `true` by default)
    showCountrySelect: PropTypes.bool.isRequired,

    /**
     * HTML `tabindex` attribute for country `<select/>`.
     */
    countrySelectTabIndex: PropTypes.number,

    /**
     * HTML `aria-label` attribute for country `<select/>`.
     * The default is `.country` of the `labels` property
     * which is `"Country"` for the default `labels`.
     */
    countrySelectAriaLabel: PropTypes.string,

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
    countryOptions: PropTypes.arrayOf(PropTypes.string),

    /**
     * `<Phone/>` component CSS style object.
     */
    style: PropTypes.object,

    /**
     * `<Phone/>` component CSS class.
     */
    className: PropTypes.string,

    /**
     * Phone number `<input/>` CSS class.
     */
    inputClassName: PropTypes.string,

    /**
     * Returns phone number `<input/>` CSS class string.
     * Receives an object of shape `{ disabled : boolean?, invalid : boolean? }`.
     * @ignore
     */
    getInputClassName: PropTypes.func,

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
    countrySelectComponent: PropTypes.element.isRequired,

    /**
     * Country `<select/>` component props.
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
     * * `onBlur(event: Event)` — Is used to toggle the `--focus` CSS class.
     * * Other properties like `type="tel"` or `autoComplete="tel"` that should be passed through to the DOM `<input/>`.
     *
     * Must also either use `React.forwardRef()` to "forward" `ref` to the `<input/>` or implement `.focus()` method.
     */
    numberInputComponent: PropTypes.element.isRequired,

    /**
     * Phone number `<input/>` component props.
     */
    numberInputProps: PropTypes.object,

    /**
     * Phone number `<input/>` component (a higher-order one).
     *
     * Receives properties:
     *
     * * `value : string` — The parsed phone number. E.g.: `""`, `"+"`, `"+123"`, `"123"`.
     * * `onChange(value? : string)` — Updates the `value`.
     * * `onFocus()` — Is used to toggle the `--focus` CSS class.
     * * `onBlur()` — Is used to toggle the `--focus` CSS class.
     * * `country : string?` — The currently selected country. `undefined` means "International" (no country selected).
     * * `metadata : object` — `libphonenumber-js` metadata.
     * * `inputComponent : element` — Phone number `<input/>` component. This is basically the `numberInputComponent` property renamed to `inputComponent`.
     * * All other properties should be passed through to the underlying `<input/>`.
     *
     * Must also either use `React.forwardRef()` to "forward" `ref` to the `<input/>` or implement `.focus()` method.
     *
     * @ignore
     */
    inputComponent: PropTypes.element.isRequired,

    /**
     * Set to `false` to use `inputComponent={InputBasic}`
     * instead of `input-format`'s `<ReactInput/>`.
     */
    // Is `false` by default.
    // smartCaret : PropTypes.bool.isRequired,

    /**
     * Phone number extension `<input/>` element.
     *
     * Example:
     *
     *	`ext={<input value={...} onChange={...}/>}`
     */
    ext: PropTypes.node,

    /**
     * If set to `true` the phone number input will get trimmed
     * if it exceeds the maximum length for the country.
     */
    limitMaxLength: PropTypes.bool.isRequired,

    /**
     * An error message to show below the phone number `<input/>`. For example, `"Required"`.
     */
    error: PropTypes.string,

    /**
     * The `error` is shown only when `indicateInvalid` is `true`.
     * (which is the default).
     * @deprecated
     * @ignore
     */
    indicateInvalid: PropTypes.bool,

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
    onCountryChange: PropTypes.func,

    /**
     * Disables only the phone number `<input/>`.
     *
     * Some users choose to implement a digital keyboard component for phone number input.
     * In such cases the phone number input field must be disabled in order for the default system keyboard to not show up on focus.
     * At the same time, country select should not be disabled in order for the user to be able to choose their country.
     */
    // (is `false` by default)
    // https://github.com/catamphetamine/react-phone-number-input/issues/215
    disablePhoneInput: PropTypes.bool.isRequired
  };

  static defaultProps = {
    /**
     * Not disabled.
     */
    disabled: false,
    disablePhoneInput: false,

    /**
     * Show `error` (if passed).
     * @deprecated
     */
    indicateInvalid: true,

    /**
     * Remember (and autofill) the value as a phone number.
     */
    autoComplete: "tel",

    /**
     * Flag icon component.
     */
    flagComponent: FlagComponent,

    /**
     * By default, use icons from `flag-icon-css` github repo.
     */
    flagsPath: "https://lipis.github.io/flag-icon-css/flags/4x3/",

    /**
     * Default "International" country `<select/>` option icon (globe).
     */
    // internationalIcon: InternationalIcon,

    /**
     * Phone number `<input/>` component.
     */
    numberInputComponent: "input",

    /**
     * Phone number `<input/>` component (a higher-order one).
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
    international: true,

    /**
     * If set to `true` the phone number input will get trimmed
     * if it exceeds the maximum length for the country.
     */
    limitMaxLength: false
  };

  constructor(props) {
    super(props);

    const { value, labels, international, metadata } = this.props;

    let { country, countries, countryOptions } = this.props;

    // Validate `country`.
    if (country) {
      if (!this.isCountrySupportedWithError(country)) {
        country = undefined;
      }
    }

    // Validate `countries`.
    countries = filterCountries(countries, metadata);

    // Validate `countryOptions`.
    countryOptions = filterCountryOptions(countryOptions, metadata);

    const phoneNumber = parsePhoneNumber(value, metadata);

    const pre_selected_country = getPreSelectedCountry(
      phoneNumber,
      country,
      countries ||
        getCountryCodes(labels).filter(
          _ => _ === "ZZ" || metadata.countries[_]
        ),
      international,
      metadata
    );

    this.state = {
      // Workaround for `this.props` inside `getDerivedStateFromProps()`.
      props: this.props,

      // The country selected.
      country: pre_selected_country,

      // `countries` are stored in `this.state` because they're filtered.
      // For example, a developer might theoretically pass some unsupported
      // countries as part of the `countries` property, and because of that
      // the component uses `this.state.countries` (which are filtered)
      // instead of `this.props.countries`
      // (which could potentially contain unsupported countries).
      countries,

      // Generate country `<select/>` options.
      country_select_options: generateCountrySelectOptions(
        countries,
        countryOptions,
        this.props
      ),

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
      parsed_input: generateParsedInput(value, phoneNumber, this.props),

      // `value` property is duplicated in state.
      // The reason is that `getDerivedStateFromProps()`
      // needs this `value` to compare to the new `value` property
      // to find out if `parsed_input` needs updating:
      // If the `value` property was changed externally
      // then it won't be equal to `state.value`
      // in which case `parsed_input` and `country` should be updated.
      value
    };
  }

  componentDidMount() {
    const { onCountryChange } = this.props;
    let { country } = this.props;
    const { country: selectedCountry } = this.state;

    if (onCountryChange) {
      if (!country || !this.isCountrySupportedWithError(country)) {
        country = undefined;
      }
      if (selectedCountry !== country) {
        onCountryChange(selectedCountry);
      }
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const { onCountryChange } = this.props;
    // Call `onCountryChange` when user selects another country.
    if (onCountryChange && this.state.country !== prevState.country) {
      onCountryChange(this.state.country);
    }
  }

  // A shorthand for not passing `metadata` as a second argument.
  isCountrySupportedWithError = country => {
    const { metadata } = this.props;
    return isCountrySupportedWithError(country, metadata);
  };

  // Country `<select/>` `onChange` handler.
  onCountryChange = new_country => {
    const { metadata, onChange } = this.props;

    const { parsed_input: old_parsed_input, country: old_country } = this.state;

    // After the new `country` has been selected,
    // if the phone number `<input/>` holds any digits
    // then migrate those digits for the new `country`.
    const new_parsed_input = migrateParsedInputForNewCountry(
      old_parsed_input,
      old_country,
      new_country,
      metadata,
      // Convert to "local" phone number format.
      true
    );

    const new_value = e164(new_parsed_input, new_country, metadata);

    // Focus phone number `<input/>` upon country selection.
    this.focus();

    // If the user has already manually selected a country
    // then don't override that already selected country
    // if the default `country` property changes.
    // That's what `hasUserSelectedACountry` flag is for.

    this.setState(
      {
        country: new_country,
        hasUserSelectedACountry: true,
        parsed_input: new_parsed_input,
        value: new_value
      },
      () => {
        // Update the new `value` property.
        // Doing it after the `state` has been updated
        // because `onChange()` will trigger `getDerivedStateFromProps()`
        // with the new `value` which will be compared to `state.value` there.
        onChange(new_value);
      }
    );
  };

  // Phone number `<input/>` `onKeyDown` handler.
  onPhoneNumberKeyDown = event => {
    const { onKeyDown } = this.props;

    // Actually "Down arrow" key is used for showing "autocomplete" ("autofill") options.
    // (e.g. previously entered phone numbers for `autoComplete="tel"`)
    // so can't hijack "Down arrow" keypress here.
    // // Expand country `<select/>`` on "Down arrow" key press.
    // if (event.keyCode === 40) {
    // 	this.country_select.toggle()
    // }

    if (onKeyDown) {
      onKeyDown(event);
    }
  };

  /**
   * `<input/>` `onChange()` handler.
   * Updates `value` property accordingly (so that they are kept in sync).
   * @param {string?} input — Either a parsed phone number or an empty string. Examples: `""`, `"+"`, `"+123"`, `"123"`.
   */
  onChange = _input => {
    const { onChange, international, limitMaxLength, metadata } = this.props;

    const { input, country, value } = parseInput(
      _input,
      this.state.parsed_input,
      this.state.country,
      this.state.countries,
      international,
      limitMaxLength,
      metadata
    );

    this.setState(
      {
        parsed_input: input,
        value,
        country
      },
      // Update the new `value` property.
      // Doing it after the `state` has been updated
      // because `onChange()` will trigger `getDerivedStateFromProps()`
      // with the new `value` which will be compared to `state.value` there.
      () => onChange(value)
    );
  };

  // Toggles the `--focus` CSS class.
  _onFocus = () => this.setState({ isFocused: true });

  // Toggles the `--focus` CSS class.
  _onBlur = () => this.setState({ isFocused: false });

  onFocus = event => {
    const { onFocus } = this.props;
    this._onFocus();
    if (onFocus) {
      onFocus(event);
    }
  };

  // This `onBlur` interceptor is a workaround for `redux-form`
  // so that it gets the up-to-date `value` in its `onBlur` handler.
  // Without this fix it just gets the actual (raw) input field textual value.
  // E.g. `+7 800 555 35 35` instead of `+78005553535`.
  //
  // A developer is not supposed to pass this `onBlur` property manually.
  // Instead, `redux-form` passes `onBlur` to this component automatically
  // and this component patches that `onBlur` handler (a hacky way but works).
  //
  onBlur = event => {
    const { onBlur } = this.props;
    const { value } = this.state;

    this._onBlur();

    if (!onBlur) {
      return;
    }

    // `event` is React's `SyntheticEvent`.
    // Its `.value` is read-only therefore cloning it.
    const _event = {
      ...event,
      target: {
        ...event.target,
        value
      }
    };

    // For `redux-form` event detection.
    // https://github.com/erikras/redux-form/blob/v5/src/events/isEvent.js
    _event.stopPropagation = event.stopPropagation;
    _event.preventDefault = event.preventDefault;

    return onBlur(_event);
  };

  // When country `<select/>` is toggled.
  hidePhoneInputField = hide => {
    this.setState({
      hidePhoneInputField: hide
    });
  };

  // Can be called externally.
  focus = () => this.number_input.focus();

  storeCountrySelectInstance = _ => (this.country_select = _);

  storePhoneNumberInputInstance = _ => (this.number_input = _);

  // `state` holds previous props as `props`, and also:
  // * `country` — The currently selected country, e.g. `"RU"`.
  // * `value` — The currently entered phone number (E.164), e.g. `+78005553535`.
  // * `parsed_input` — The parsed `<input/>` value, e.g. `8005553535`.
  // (and a couple of other less significant properties)
  static getDerivedStateFromProps(props, state) {
    const {
      country,
      hasUserSelectedACountry,
      value,
      props: { country: old_default_country, value: old_value }
    } = state;

    const {
      metadata,
      countries,
      country: new_default_country,
      value: new_value
    } = props;

    const new_state = {
      // Emulate `prevProps` via `state.props`.
      props,
      // If the user has already manually selected a country
      // then don't override that already selected country
      // if the default `country` property changes.
      // That's what `hasUserSelectedACountry` flag is for.
      hasUserSelectedACountry
    };

    // If `countries` or `labels` or `international` changed
    // then re-generate country `<select/>` options.
    if (
      props.countries !== state.props.countries ||
      props.labels !== state.props.labels ||
      props.international !== state.props.international
    ) {
      // Re-generate country select options.
      new_state.country_select_options = generateCountrySelectOptions(
        filterCountries(props.countries, metadata),
        filterCountryOptions(props.countryOptions, metadata),
        props
      );
    }

    // If the default country changed.
    // (e.g. in case of ajax GeoIP detection after page loaded)
    // then select it but only if the user hasn't already manually
    // selected a country and no phone number has been entered so far.
    // Because if the user has already started inputting a phone number
    // then he's okay with no country being selected at all ("International")
    // and doesn't want to be disturbed, doesn't want his input to be screwed, etc.
    if (
      new_default_country !== old_default_country &&
      !hasUserSelectedACountry &&
      !value &&
      !new_value
    ) {
      return {
        ...new_state,
        country: isCountrySupportedWithError(new_default_country, metadata)
          ? new_default_country
          : old_default_country
        // `value` is `undefined`.
        // `parsed_input` is `undefined` because `value` is `undefined`.
      };
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
    else if (new_value !== old_value && new_value !== value) {
      const phoneNumber = parsePhoneNumber(new_value, metadata);
      let parsedCountry;
      if (phoneNumber) {
        const countries = filterCountries(props.countries, metadata);
        if (!countries || countries.indexOf(phoneNumber.country) >= 0) {
          parsedCountry = phoneNumber.country;
        }
      }
      return {
        ...new_state,
        parsed_input: generateParsedInput(new_value, phoneNumber, props),
        value: new_value,
        country: new_value ? parsedCountry : country
      };
    }

    // `country` didn't change.
    // `value` didn't change.
    // `parsed_input` didn't change, because `value` didn't change.
    //
    // Maybe `new_state.country_select_options` changed.
    // In any case, update `prevProps`.
    return new_state;
  }

  render() {
    const {
      name,
      disabled,
      disablePhoneInput,
      autoComplete,
      countrySelectTabIndex,
      showCountrySelect,
      style,
      className,
      inputClassName,
      getInputClassName,
      countrySelectAriaLabel,
      countrySelectProperties,

      error,
      indicateInvalid,

      countrySelectComponent: CountrySelectComponent,
      countrySelectProps,
      inputComponent: InputComponent,
      numberInputComponent: inputComponent,
      numberInputProps,
      // smartCaret,
      ext,

      // Extract `phoneNumberInputProps` via "object rest spread":
      country: _,
      countries,
      countryOptions,
      labels,
      flags,
      flagComponent,
      flagsPath,
      international,
      internationalIcon,
      displayInitialValueAsLocalNumber,
      onCountryChange,
      limitMaxLength,
      metadata,
      ...phoneNumberInputProps
    } = this.props;

    const {
      country,
      hidePhoneInputField,
      country_select_options,
      parsed_input,
      isFocused
    } = this.state;

    // const InputComponent = InputComponent || (smartCaret ? InputSmart : InputBasic)

    // Extract `countrySelectProperties` from `this.props`
    // also removing them from `phoneNumberInputProps`.
    const _countrySelectProps = {};
    if (countrySelectProperties) {
      for (const key in countrySelectProperties) {
        if (this.props.hasOwnProperty(key)) {
          _countrySelectProps[countrySelectProperties[key]] = this.props[key];
          delete phoneNumberInputProps[key];
        }
      }
    }

    // Could use something like `aria-label={labels.phone}` on the `<InputComponent/>`,
    // however, some users may have already been using this component with one of:
    // * `<label/>` container
    // * `aria-labelledby`
    // * `id` and `<label for/>`
    // https://developers.google.com/web/fundamentals/accessibility/semantics-aria/aria-labels-and-relationships
    // Maybe in some future major version update.

    return (
      <div
        style={style}
        className={classNames(
          "react-phone-number-input",
          {
            "react-phone-number-input--focus": isFocused,
            "react-phone-number-input--invalid": error && indicateInvalid
          },
          className
        )}
      >
        {/* Country `<select/>` and phone number `<input/>` */}
        <div className="react-phone-number-input__row">
          {/* Country `<select/>` */}
          {showCountrySelect && (
            <CountrySelectComponent
              {..._countrySelectProps}
              ref={this.storeCountrySelectInstance}
              name={name ? `${name}__country` : undefined}
              aria-label={countrySelectAriaLabel || labels.country}
              tabIndex={countrySelectTabIndex}
              {...countrySelectProps}
              value={country}
              options={country_select_options}
              onChange={this.onCountryChange}
              onFocus={this._onFocus}
              onBlur={this._onBlur}
              disabled={disabled}
              hidePhoneInputField={this.hidePhoneInputField}
              focusPhoneInputField={this.focus}
              className="react-phone-number-input__country"
            />
          )}

          {/* Phone number `<input/>` */}
          {!hidePhoneInputField && (
            <InputComponent
              type="tel"
              autoComplete={autoComplete}
              {...numberInputProps}
              {...phoneNumberInputProps}
              ref={this.storePhoneNumberInputInstance}
              name={name}
              metadata={metadata}
              country={country}
              value={parsed_input || ""}
              onChange={this.onChange}
              onFocus={this.onFocus}
              onBlur={this.onBlur}
              onKeyDown={this.onPhoneNumberKeyDown}
              disabled={disabled || disablePhoneInput}
              inputComponent={inputComponent}
              className={classNames(
                "react-phone-number-input__input",
                "react-phone-number-input__phone",
                {
                  "react-phone-number-input__input--disabled":
                    disabled || disablePhoneInput,
                  "react-phone-number-input__input--invalid":
                    error && indicateInvalid
                },
                inputClassName,
                getInputClassName &&
                  getInputClassName({
                    disabled: disabled || disablePhoneInput,
                    invalid: error && indicateInvalid
                  })
              )}
            />
          )}

          {/* Phone extension `<input/>` */}
          {ext && !hidePhoneInputField && (
            <label className="react-phone-number-input__ext">
              {labels.ext}
              {React.cloneElement(ext, {
                onChange: ext.props.onChange
                  ? event => ext.props.onChange(parseExtDigits(event))
                  : undefined,
                onFocus: this._onFocus,
                onBlur: this._onBlur,
                className: classNames(
                  "react-phone-number-input__input",
                  "react-phone-number-input__ext-input",
                  {
                    "react-phone-number-input__input--disabled":
                      disabled || disablePhoneInput
                  },
                  inputClassName,
                  getInputClassName &&
                    getInputClassName({
                      disabled: disabled || disablePhoneInput
                    }),
                  ext.props.className
                )
              })}
            </label>
          )}
        </div>

        {/* Error message */}
        {error && indicateInvalid && (
          <div className="react-phone-number-input__error">{error}</div>
        )}
      </div>
    );
  }
}

// Generates country `<select/>` options.
function generateCountrySelectOptions(countries, countryOptions, props) {
  const { labels, international, metadata } = props;

  const CountrySelectOptionIcon = createCountrySelectOptionIconComponent(props);

  return transformCountryOptions(
    getCountrySelectOptions(
      countries ||
        getCountryCodes(labels).filter(
          country => country === "ZZ" || isCountrySupported(country, metadata)
        ),
      labels,
      international
    ).map(({ value, label }) => ({
      value,
      label,
      icon: CountrySelectOptionIcon
    })),
    countryOptions
  );
}

function createCountrySelectOptionIconComponent(props) {
  const {
    flags,
    flagsPath,
    flagComponent: FlagComponent,
    internationalIcon: InternationalIcon
  } = props;

  return ({ value }) => (
    <div
      className={classNames("react-phone-number-input__icon", {
        "react-phone-number-input__icon--international": value === undefined
      })}
    >
      {value ? (
        <FlagComponent country={value} flags={flags} flagsPath={flagsPath} />
      ) : (
        <InternationalIcon />
      )}
    </div>
  );
}

// Can move some country `<select/>` options
// to the top of the list, for example.
// See `countryOptions` property.
function transformCountryOptions(options, transform) {
  if (!transform) {
    return options;
  }

  const optionsOnTop = [];
  const optionsOnBottom = [];
  let appendTo = optionsOnTop;

  for (const element of transform) {
    if (element === "|") {
      appendTo.push({ divider: true });
    } else if (element === "..." || element === "…") {
      appendTo = optionsOnBottom;
    } else {
      // Find the position of the option.
      const index = options.indexOf(
        options.filter(option => option.value === element)[0]
      );
      // Get the option.
      const option = options[index];
      // Remove the option from its default position.
      options.splice(index, 1);
      // Add the option on top.
      appendTo.push(option);
    }
  }

  return optionsOnTop.concat(options).concat(optionsOnBottom);
}

function generateParsedInput(value, phoneNumber, props) {
  const { displayInitialValueAsLocalNumber } = props;

  // If the `value` (E.164 phone number)
  // belongs to the currently selected country
  // and `displayInitialValueAsLocalNumber` property is `true`
  // then convert `value` (E.164 phone number)
  // to a local phone number digits.
  // E.g. '+78005553535' -> '88005553535'.
  if (displayInitialValueAsLocalNumber && phoneNumber && phoneNumber.country) {
    return generateNationalNumberDigits(phoneNumber);
  }

  return value;
}

function isCountrySupported(country, metadata) {
  return metadata.countries.hasOwnProperty(country);
}

function isCountrySupportedWithError(country, metadata) {
  if (isCountrySupported(country, metadata)) {
    return true;
  } else {
    console.error(`Country not found: ${country}`);
    return false;
  }
}

function isCountryOptionSupportedWithError(countryOption, metadata) {
  switch (countryOption) {
    case "|":
    case "...":
    case "…":
      return true;
    default:
      return isCountrySupportedWithError(countryOption, metadata);
  }
}

function filterCountries(countries, metadata) {
  if (countries) {
    countries = countries.filter(country =>
      isCountrySupportedWithError(country, metadata)
    );
    if (countries.length === 0) {
      countries = undefined;
    }
  }
  return countries;
}

function filterCountryOptions(countryOptions, metadata) {
  if (countryOptions) {
    countryOptions = countryOptions.filter(countryOption =>
      isCountryOptionSupportedWithError(countryOption, metadata)
    );
    if (countryOptions.length === 0) {
      countryOptions = undefined;
    }
  }
  return countryOptions;
}

function parseExtDigits(event) {
  if (event) {
    if (typeof event === "string") {
      event = parseDigits(event);
    } else if (event.target && event.target.value) {
      event.target.value = parseDigits(event.target.value);
    }
  }
  return event;
}
