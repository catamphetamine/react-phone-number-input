import _slicedToArray from 'babel-runtime/helpers/slicedToArray';
import _Object$keys from 'babel-runtime/core-js/object/keys';
import _extends from 'babel-runtime/helpers/extends';
import _objectWithoutProperties from 'babel-runtime/helpers/objectWithoutProperties';
import _getIterator from 'babel-runtime/core-js/get-iterator';
import _Object$getPrototypeOf from 'babel-runtime/core-js/object/get-prototype-of';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _createClass from 'babel-runtime/helpers/createClass';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import { as_you_type, parse, format, getPhoneCode } from 'libphonenumber-js';
import { ReactInput } from 'input-format';
import classNames from 'classnames';

// Not importing here directly from `react-responsive-ui` npm package
// just to reduce the overall bundle size.
import { Select } from './react-responsive-ui';

import country_names from './country names.json';
import International_icon from './international icon';

// A list of all country codes
var all_countries = [];

// Country code to country name map
var default_dictionary = {
  International: 'International'
};

// Populate `all_countries` and `default_dictionary`
var _iteratorNormalCompletion = true;
var _didIteratorError = false;
var _iteratorError = undefined;

try {
  for (var _iterator = _getIterator(country_names), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
    var item = _step.value;

    var _item = _slicedToArray(item, 2),
        code = _item[0],
        name = _item[1];

    all_countries.push(code.toUpperCase());
    default_dictionary[code.toUpperCase()] = name;
  }

  // Allows passing custom `libphonenumber-js` metadata
  // to reduce the overall bundle size.
} catch (err) {
  _didIteratorError = true;
  _iteratorError = err;
} finally {
  try {
    if (!_iteratorNormalCompletion && _iterator.return) {
      _iterator.return();
    }
  } finally {
    if (_didIteratorError) {
      throw _iteratorError;
    }
  }
}

var Input = function (_Component) {
  _inherits(Input, _Component);

  function Input(props) {
    _classCallCheck(this, Input);

    var _this = _possibleConstructorReturn(this, (Input.__proto__ || _Object$getPrototypeOf(Input)).call(this, props));

    _initialiseProps.call(_this);

    var _this$props = _this.props,
        countries = _this$props.countries,
        value = _this$props.value,
        dictionary = _this$props.dictionary,
        international = _this$props.international,
        internationalIcon = _this$props.internationalIcon,
        flags = _this$props.flags;
    var country = _this.props.country;

    // Normalize `country` code

    country = normalize_country_code(country);

    // Autodetect country if value is set
    // and is international (which it should be)
    if (!country && value && value[0] === '+') {
      // Will be left `undefined` in case of non-detection
      country = parse(value).country;
    }

    // If there will be no "International" option
    // then a `country` must be selected.
    if (!should_add_international_option(_this.props) && !country) {
      country = countries[0];
    }

    // Set the currently selected country
    _this.state.country_code = country;

    // If a phone number `value` is passed then format it
    if (value) {
      // `this.state.value_property` is the `this.props.value`
      // which corresponding to `this.state.value`.
      // It is being compared in `componentWillReceiveProps()`
      // against `newProps.value` to find out if the new `value` property
      // needs `this.state.value` recalculation.
      _this.state.value_property = value;
      // Set the currently entered `value`.
      // State `value` is either in international plaintext or just plaintext format.
      // (e.g. `+78005553535`, `1234567`)
      _this.state.value = _this.get_input_value_depending_on_the_country_selected(value, country);
    }

    // `<Select/>` options
    _this.select_options = [];

    // Whether custom country names are supplied
    var using_custom_country_names = false;

    // Add a `<Select/>` option for each country
    var _iteratorNormalCompletion2 = true;
    var _didIteratorError2 = false;
    var _iteratorError2 = undefined;

    try {
      for (var _iterator2 = _getIterator(countries), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
        var country_code = _step2.value;

        if (dictionary[country_code]) {
          using_custom_country_names = true;
        }

        _this.select_options.push({
          value: country_code,
          label: dictionary[country_code] || default_dictionary[country_code],
          icon: get_country_option_icon(country_code, _this.props)
        });
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
    } catch (err) {
      _didIteratorError2 = true;
      _iteratorError2 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion2 && _iterator2.return) {
          _iterator2.return();
        }
      } finally {
        if (_didIteratorError2) {
          throw _iteratorError2;
        }
      }
    }

    if (using_custom_country_names && String.prototype.localeCompare) {
      _this.select_options.sort(function (a, b) {
        return a.label.localeCompare(b.label);
      });
    }

    // Add the "International" option to the country list (if suitable)
    if (should_add_international_option(_this.props)) {
      _this.select_options.unshift({
        label: dictionary['International'] || default_dictionary['International'],
        icon: flags === false ? undefined : internationalIcon
      });
    }
    return _this;
  }

  // Determines the text `<input/>` `value`
  // depending on `this.props.value` and the country selected.
  //
  // E.g. when a country is selected and `this.props.value`
  // is in international format for this country
  // then it can be converted to national format.
  //
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


  _createClass(Input, [{
    key: 'get_input_value_depending_on_the_country_selected',
    value: function get_input_value_depending_on_the_country_selected(value, country_code) {
      var _props = this.props,
          metadata = _props.metadata,
          convertToNational = _props.convertToNational;


      if (!value) {
        return;
      }

      // If the country code is specified
      if (country_code) {
        // If the value has a leading plus sign
        if (value[0] === '+' && convertToNational) {
          // If it's a fully-entered phone number
          // that converts into a valid national number for this country
          // then the value is set to be that national number.

          var parsed = parse(value, metadata);

          if (parsed.country === country_code) {
            return this.format(parsed.phone, country_code).text;
          }

          // Else the leading + sign is trimmed.
          return value.slice(1);
        }

        // Else the value stays as it is
        return value;
      }

      // The country is not set.
      // Assuming that's an international phone number.

      // If the value has a leading + sign
      if (value[0] === '+') {
        // The value is correct
        return value;
      }

      // The + sign is prepended
      return '+' + value;
    }
  }, {
    key: 'set_country_code_value',
    value: function set_country_code_value(country_code) {
      var onCountryChange = this.props.onCountryChange;


      if (onCountryChange) {
        onCountryChange(country_code);
      }

      this.setState({ country_code: country_code });
    }

    // `<select/>` `onChange` handler


    // `input-format` `parse` character function
    // https://github.com/halt-hammerzeit/input-format


    // `input-format` `format` function
    // https://github.com/halt-hammerzeit/input-format


    // Can be called externally


    // `<input/>` `onKeyDown` handler


    // `<input/>` `onChange` handler.
    // Updates `this.props.value` (in e.164 phone number format)
    // according to the new `this.state.value`.
    // (keeps them in sync)


    // When country `<select/>` is toggled


    // Focuses the `<input/>` field
    // on tab out of the country `<select/>`

  }, {
    key: 'can_change_country',


    // Can a user change the default country or not.
    value: function can_change_country() {
      var countries = this.props.countries;

      // If `countries` is empty,
      // then only "International" option is available,
      // so can't switch it.
      //
      // If `countries` is a single allowed country,
      // then cant's switch it.
      //

      return countries.length > 1;
    }

    // Listen for default country property:
    // if it is set after the page loads
    // and the user hasn't selected a country yet
    // then select the default country.

  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(new_props) {
      var _props2 = this.props,
          countries = _props2.countries,
          value = _props2.value;

      // Normalize `country` codes

      var country = normalize_country_code(this.props.country);
      var new_country = normalize_country_code(new_props.country);

      // If the default country changed
      // (e.g. in case of IP detection)
      if (new_country !== country) {
        // If the phone number input field is currently empty
        // (e.g. not touched yet) then change the selected `country`
        // to the newly passed one (e.g. as a result of a GeoIP query)
        if (!value) {
          // If the passed `country` allowed then update it
          if (countries.indexOf(new_country) !== -1) {
            // Set the new `country`
            this.set_country(new_country, false);
          }
        }
      }

      // This code is executed:
      // * after `this.props.onChange(value)` is called
      // * if the `value` was externally set (e.g. cleared)
      if (new_props.value !== value) {
        // `this.state.value_property` is the `this.props.value`
        // which corresponding to `this.state.value`.
        // It is being compared in `componentWillReceiveProps()`
        // against `newProps.value` to find out if the new `value` property
        // needs `this.state.value` recalculation.
        // This is an optimization, it's like `shouldComponentUpdate()`.
        // This is supposed to save some CPU cycles, maybe not much, I didn't check.
        // Or maybe there was some other reason for this I don't remember now.
        if (new_props.value !== this.state.value_property) {
          // Update the `value` because it was externally set

          // Country code gets updated too
          var country_code = this.state.country_code;

          // Autodetect country if `value` is set
          // and is international (which it should be)
          if (new_props.value && new_props.value[0] === '+') {
            // `parse().country` will be `undefined` in case of non-detection
            country_code = parse(new_props.value).country || country_code;
          }

          this.setState({
            country_code: country_code,
            value: this.get_input_value_depending_on_the_country_selected(new_props.value, country_code),
            // `this.state.value_property` is the `this.props.value`
            // which corresponding to `this.state.value`.
            // It is being compared in `componentWillReceiveProps()`
            // against `newProps.value` to find out if the new `value` property
            // needs `this.state.value` recalculation.
            value_property: new_props.value
          });
        }
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      var _props3 = this.props,
          saveOnIcons = _props3.saveOnIcons,
          showCountrySelect = _props3.showCountrySelect,
          nativeExpanded = _props3.nativeExpanded,
          disabled = _props3.disabled,
          autoComplete = _props3.autoComplete,
          selectTabIndex = _props3.selectTabIndex,
          selectMaxItems = _props3.selectMaxItems,
          inputTabIndex = _props3.inputTabIndex,
          style = _props3.style,
          className = _props3.className,
          inputClassName = _props3.inputClassName,
          dictionary = _props3.dictionary,
          countries = _props3.countries,
          country = _props3.country,
          onCountryChange = _props3.onCountryChange,
          flags = _props3.flags,
          flagsPath = _props3.flagsPath,
          international = _props3.international,
          internationalIcon = _props3.internationalIcon,
          convertToNational = _props3.convertToNational,
          metadata = _props3.metadata,
          automaticallyScrollIntoView = _props3.automaticallyScrollIntoView,
          onDropdown = _props3.onDropdown,
          input_props = _objectWithoutProperties(_props3, ['saveOnIcons', 'showCountrySelect', 'nativeExpanded', 'disabled', 'autoComplete', 'selectTabIndex', 'selectMaxItems', 'inputTabIndex', 'style', 'className', 'inputClassName', 'dictionary', 'countries', 'country', 'onCountryChange', 'flags', 'flagsPath', 'international', 'internationalIcon', 'convertToNational', 'metadata', 'automaticallyScrollIntoView', 'onDropdown']);

      var _state = this.state,
          value = _state.value,
          country_code = _state.country_code,
          country_select_is_shown = _state.country_select_is_shown;


      var markup = React.createElement(
        'div',
        {
          style: style,
          className: classNames('react-phone-number-input', className)
        },
        showCountrySelect && this.can_change_country() && React.createElement(Select, {
          ref: function ref(_ref) {
            return _this2.select = _ref;
          },
          value: country_code,
          options: this.select_options,
          onChange: this.set_country,
          disabled: disabled,
          onToggle: this.country_select_toggled,
          onTabOut: this.on_country_select_tab_out,
          nativeExpanded: nativeExpanded,
          autocomplete: true,
          autocompleteShowAll: true,
          maxItems: selectMaxItems,
          concise: true,
          tabIndex: selectTabIndex,
          focusUponSelection: false,
          saveOnIcons: saveOnIcons,
          name: input_props.name ? input_props.name + '__country' : undefined,
          className: 'react-phone-number-input__country',
          inputClassName: inputClassName,
          automaticallyScrollIntoView: true
        }),
        !country_select_is_shown && React.createElement(ReactInput, _extends({}, input_props, {
          ref: function ref(_ref2) {
            return _this2.input = _ref2;
          },
          value: value,
          onChange: this.on_change,
          disabled: disabled,
          type: 'tel',
          autoComplete: autoComplete,
          tabIndex: inputTabIndex,
          parse: this.parse,
          format: this.format,
          onKeyDown: this.on_key_down,
          className: classNames('rrui__input', 'rrui__input-field', 'react-phone-number-input__phone', inputClassName)
        }))
      );

      return markup;
    }
  }]);

  return Input;
}(Component);

// Parses a partially entered phone number
// and returns the national number so far.
// Not using `libphonenumber-js`'s `parse`
// function here because `parse` only works
// when the number is fully entered,
// and this one is for partially entered number.


Input.propTypes = {
  // Phone number `value`.
  // Is a plaintext international phone number
  // (e.g. "+12223333333" for USA)
  value: PropTypes.string,

  // This handler is called each time
  // the phone number <input/> changes its textual value.
  onChange: PropTypes.func.isRequired,

  // This handler is called when the dropdown
  // toggles if provided.  It includes the ref
  // to it's container.
  onDropdown: PropTypes.func,

  // will attempt to scroll the dropdown list into
  // the view when it is opened
  automaticallyScrollIntoView: PropTypes.bool,

  // This `onBlur` interceptor is a workaround for `redux-form`,
  // so that it gets a parsed `value` in its `onBlur` handler,
  // not the formatted one.
  // (`redux-form` passed `onBlur` to this component
  //  and this component intercepts that `onBlur`
  //  to make sure it works correctly with `redux-form`)
  onBlur: PropTypes.func,

  // Set `onKeyDown` handler.
  // Can be used in special cases to handle e.g. enter pressed
  onKeyDown: PropTypes.func,

  // Disables both the <input/> and the <select/>
  // (is `false` by default)
  disabled: PropTypes.bool.isRequired,

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
  autoComplete: PropTypes.string.isRequired,

  // Two-letter country code
  // to be used as the default country
  // for local (non-international) phone numbers.
  country: PropTypes.string,

  // Is called when the selected country changes
  // (either by a user manually, or by autoparsing
  //  an international phone number being input).
  // This handler does not need to update the `country` property.
  // It's simply a listener for those who might need that for whatever purpose.
  onCountryChange: PropTypes.func,

  // Localization dictionary:
  // `{ International: 'Международный', RU: 'Россия', US: 'США', ... }`
  dictionary: PropTypes.objectOf(PropTypes.string),

  // An optional list of allowed countries
  countries: PropTypes.arrayOf(PropTypes.string).isRequired,

  // Custom national flag icons
  flags: PropTypes.oneOfType([PropTypes.objectOf(PropTypes.element), PropTypes.bool]),

  // A base URL path for national flag SVG icons.
  // By default it uses the ones from `flag-icon-css` github repo.
  flagsPath: PropTypes.string.isRequired,

  // Whether to use native `<select/>` when expanded
  nativeExpanded: PropTypes.bool.isRequired,

  // If set to `false`, then country flags will be shown
  // for all countries in the options list
  // (not just for selected country).
  saveOnIcons: PropTypes.bool.isRequired,

  // Whether to show country `<Select/>`
  // (is `true` by default)
  showCountrySelect: PropTypes.bool.isRequired,

  // Whether to add the "International" option
  // to the list of countries.
  international: PropTypes.bool,

  // Custom "International" phone number type icon.
  internationalIcon: PropTypes.element.isRequired,

  // Should the initially passed phone number `value`
  // be converted to a national phone number for its country.
  // (is `true` by default)
  convertToNational: PropTypes.bool.isRequired,

  // HTML `tabindex` attribute for the country select
  selectTabIndex: PropTypes.number,

  // Defines the height of the dropdown country select list
  selectMaxItems: PropTypes.number,

  // HTML `tabindex` attribute for the phone number input
  inputTabIndex: PropTypes.number,

  // CSS style object
  style: PropTypes.object,

  // Component CSS class
  className: PropTypes.string,

  // `<input/>` CSS class
  inputClassName: PropTypes.string,

  // `libphonenumber-js` metadata
  metadata: PropTypes.shape({
    countries: PropTypes.object.isRequired
  }).isRequired
};
Input.defaultProps = {
  // Is enabled
  disabled: false,

  // Remember (and autofill) as a phone number
  autoComplete: 'tel',

  // Include all countries by default
  countries: all_countries,

  // By default use the ones from `flag-icon-css` github repo.
  flagsPath: 'https://lipis.github.io/flag-icon-css/flags/4x3/',

  // Default international icon (globe)
  internationalIcon: React.createElement(
    'div',
    { className: 'react-phone-number-input__icon react-phone-number-input__icon--international' },
    React.createElement(International_icon, null)
  ),

  onDropdown: undefined,

  automaticallyScrollIntoView: false,

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

  // Convert the initially passed phone number `value`
  // to a national phone number for its country.
  convertToNational: true
};

var _initialiseProps = function _initialiseProps() {
  var _this3 = this;

  this.state = {};

  this.set_country = function (country_code, focus) {
    var metadata = _this3.props.metadata;

    // Previously selected country

    var previous_country_code = _this3.state.country_code;

    _this3.set_country_code_value(country_code);

    // Adjust the phone number (`value`)
    // according to the selected `country_code`

    var value = _this3.state.value;

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

    if (value) {
      // If switching to a country from International
      if (!previous_country_code && country_code) {
        // The value is international plaintext
        var parsed = parse(value, metadata);

        // If it's for this country,
        // then convert it to a national number
        if (parsed.country === country_code) {
          value = _this3.format(parsed.phone, country_code).text;
        } else {
          // Else just trim the + sign
          value = value.slice(1);
        }
      }

      if (previous_country_code && country_code) {
        if (value[0] === '+') {
          var _parsed = parse(value, metadata);

          if (_parsed.country === country_code) {
            value = _this3.format(_parsed.phone, country_code).text;
          } else {
            value = value.slice(1);
          }
        }
      }

      // If switching to International from a country
      if (previous_country_code && !country_code) {
        // If no leading + sign
        if (value[0] !== '+') {
          // Take the international plaintext value
          var national_number = parse_partial_number(value, previous_country_code, metadata).national_number;
          value = format(national_number, previous_country_code, 'International_plaintext', metadata);
        }
      }

      // Update the adjusted `value`
      // and update `this.props.value` (in e.164 phone number format)
      // according to the new `this.state.value`.
      // (keep them in sync)
      _this3.on_change(value, country_code, true);
    }

    // Focus the phone number input upon country selection
    // (do it in a timeout because the `<input/>`
    //  is hidden while selecting a country)
    if (focus !== false) {
      setTimeout(_this3.focus, 0);
    }
  };

  this.parse = function (character, value) {
    var countries = _this3.props.countries;


    if (character === '+') {
      // Only allow a leading `+`
      if (!value) {
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
        return character;
      }
    } else if (character >= '0' && character <= '9') {
      // For digits
      var metadata = _this3.props.metadata;
      var country_code = _this3.state.country_code;

      // If the "International" option is not available
      // and if the value has a leading `+`
      // then it means that the phone number being entered
      // is an international one, so only allow the country phone code
      // for the selected country to be entered.

      if (!should_add_international_option(_this3.props) && value && value[0] === '+') {
        if (!could_phone_number_belong_to_country(value + character, country_code, metadata)) {
          return;
        }
      }

      return character;
    }
  };

  this.format = function (value) {
    var country_code = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : _this3.state.country_code;
    var metadata = _this3.props.metadata;

    // `value` is already parsed input, i.e.
    // either International plaintext phone number
    // or just local phone number digits.

    // "As you type" formatter

    var formatter = new as_you_type(country_code, metadata);

    // Is used to check if a country code can already be derived
    _this3.formatter = formatter;

    // Format phone number
    var text = formatter.input(value);

    return { text: text, template: formatter.template };
  };

  this.focus = function () {
    ReactDOM.findDOMNode(_this3.input).focus();
  };

  this.on_key_down = function (event) {
    var onKeyDown = _this3.props.onKeyDown;

    // Expand country `<select/>`` on "Down arrow" key press

    if (event.keyCode === 40) {
      _this3.select.toggle();
    }

    if (onKeyDown) {
      onKeyDown(event);
    }
  };

  this.on_change = function (value) {
    var country_code = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : _this3.state.country_code;
    var changed_country = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
    var _props4 = _this3.props,
        metadata = _props4.metadata,
        onChange = _props4.onChange;

    // If the `<input/>` is empty then just exit

    if (!value) {
      return _this3.setState({
        // State `value` is the parsed input value
        // (e.g. `+78005553535`, `1234567`).
        value: value,
        // `this.state.value_property` is the `this.props.value`
        // which corresponding to `this.state.value`.
        // It is being compared in `componentWillReceiveProps()`
        // against `newProps.value` to find out if the new `value` property
        // needs `this.state.value` recalculation.
        value_property: value
      },
      // Write the new `this.props.value`.
      function () {
        return onChange(value);
      });
    }

    // For international phone numbers
    if (value[0] === '+') {
      // If an international phone number is being erased up to the first `+` sign
      // or if an international phone number is just starting (with a `+` sign)
      // then unset the current country because it's clear that a user intends to change it.
      if (value.length === 1) {
        // If "International" country option has not been disabled
        // then reset the currently selected country.
        if (should_add_international_option(_this3.props)) {
          country_code = undefined;
          _this3.set_country_code_value(country_code);
        }
      } else if (!changed_country && _this3.formatter.country && _this3.formatter.country !== '001') {
        // If a phone number is being input as an international one
        // and the country code can already be derived,
        // then switch the country.
        // (`001` is a special "non-geograpical entity" code in `libphonenumber` library)
        country_code = _this3.formatter.country;
        _this3.set_country_code_value(country_code);
      }
    } else if (!country_code) {
      // If "International" mode is selected
      // and the `value` doesn't start with a + sign,
      // then prepend it to the `value`.
      value = '+' + value;
    }

    // `this.state.value_property` is the `this.props.value`
    // which corresponding to `this.state.value`.
    // It is being compared in `componentWillReceiveProps()`
    // against `newProps.value` to find out if the new `value` property
    // needs `this.state.value` recalculation.
    var value_property = void 0;

    // `value` equal to `+` makes no sense
    if (value === '+') {
      value_property = undefined;
    } else if (country_code && value[0] === '+' && !(value.indexOf('+' + getPhoneCode(country_code)) === 0 && value.length > ('+' + getPhoneCode(country_code)).length)) {
      // If a phone number is in international format then check
      // that the phone number entered belongs to the selected country.
      value_property = undefined;
    } else {
      // Should be a most-probably-valid phone number
      // Convert `value` to E.164 phone number format
      value_property = e164(value, country_code, metadata);
    }

    _this3.setState({
      // State `value` is the parsed input value
      // (e.g. `+78005553535`, `1234567`).
      value: value,
      // `this.state.value_property` is the `this.props.value`
      // which corresponding to `this.state.value`.
      // It is being compared in `componentWillReceiveProps()`
      // against `newProps.value` to find out if the new `value` property
      // needs `this.state.value` recalculation.
      value_property: value_property
    },
    // Write the new `this.props.value`.
    function () {
      return onChange(value_property);
    });
  };

  this.country_select_toggled = function (is_shown) {
    if (_this3.props.onDropdown) {
      _this3.props.onDropdown(is_shown, _this3.select);
    }
    _this3.setState({ country_select_is_shown: is_shown });
  };

  this.on_country_select_tab_out = function (event) {
    event.preventDefault();

    // Focus the phone number input upon country selection
    // (do it in a timeout because the `<input/>`
    //  is hidden while selecting a country)
    setTimeout(_this3.focus, 0);
  };
};

export default Input;
function parse_partial_number(value, country_code, metadata) {
  // "As you type" formatter
  var formatter = new as_you_type(country_code, metadata);

  // Input partially entered phone number
  formatter.input(value);

  // Return the parsed partial phone number
  // (has `.national_number`, `.country`, etc)
  return formatter;
}

// Converts `value` to E.164 phone number format
function e164(value, country_code, metadata) {
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

  if (country_code) {
    if (value[0] === '+') {
      return value;
    }

    var partial_national_number = parse_partial_number(value, country_code).national_number;
    return format(partial_national_number, country_code, 'International_plaintext', metadata);
  }

  if (value[0] === '+') {
    return value;
  }

  return '+' + value;
}

// Gets country flag element by country code
function get_country_option_icon(country_code, _ref3) {
  var flags = _ref3.flags,
      flagsPath = _ref3.flagsPath;

  if (flags === false) {
    return undefined;
  }

  if (flags && flags[country_code]) {
    return flags[country_code];
  }

  return React.createElement('img', {
    className: 'react-phone-number-input__icon',
    src: '' + flagsPath + country_code.toLowerCase() + '.svg'
  });
}

// Whether to add the "International" option to the list of countries
function should_add_international_option(properties) {
  var countries = properties.countries,
      international = properties.international;

  // If this behaviour is explicitly set, then do as it says.

  if (international !== undefined) {
    return international;
  }

  // If `countries` is empty,
  // then only "International" option is available, so add it.
  if (countries.length === 0) {
    return true;
  }

  // If `countries` is a single allowed country,
  // then don't add the "International" option
  // because it would make no sense.
  if (countries.length === 1) {
    return false;
  }

  // Show the "International" option by default
  return true;
}

// Is it possible that the partially entered  phone number belongs to the given country
function could_phone_number_belong_to_country(phone_number, country_code, metadata) {
  // Strip the leading `+`
  var phone_number_digits = phone_number.slice(1);

  var _iteratorNormalCompletion3 = true;
  var _didIteratorError3 = false;
  var _iteratorError3 = undefined;

  try {
    for (var _iterator3 = _getIterator(_Object$keys(metadata.country_phone_code_to_countries)), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
      var country_phone_code = _step3.value;

      var possible_country_phone_code = phone_number_digits.substring(0, country_phone_code.length);
      if (country_phone_code.indexOf(possible_country_phone_code) === 0) {
        // This country phone code is possible.
        // Does the given country correspond to this country phone code.
        if (metadata.country_phone_code_to_countries[country_phone_code].indexOf(country_code) >= 0) {
          return true;
        }
      }
    }
  } catch (err) {
    _didIteratorError3 = true;
    _iteratorError3 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion3 && _iterator3.return) {
        _iterator3.return();
      }
    } finally {
      if (_didIteratorError3) {
        throw _iteratorError3;
      }
    }
  }
}

// Validates country code
function normalize_country_code(country) {
  // Normalize `country` if it's an empty string
  if (country === '') {
    country = undefined;
  }

  // No country is selected ("International")
  if (country === undefined || country === null) {
    return country;
  }

  // Check that `country` code exists
  if (default_dictionary[country]) {
    return country;
  }

  throw new Error('Unknown country: "' + country + '"');
}
//# sourceMappingURL=input.js.map