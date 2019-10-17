# react-phone-number-input

[![npm version](https://img.shields.io/npm/v/react-phone-number-input.svg?style=flat-square)](https://www.npmjs.com/package/react-phone-number-input)
[![npm downloads](https://img.shields.io/npm/dm/react-phone-number-input.svg?style=flat-square)](https://www.npmjs.com/package/react-phone-number-input)

International phone number `<input/>` for React.

[See Demo](http://catamphetamine.github.io/react-phone-number-input/)

## Screenshots

### Phone number input

<img src="https://raw.githubusercontent.com/catamphetamine/react-phone-number-input/master/docs/images/first-glance-local.png" width="270" height="113"/>

<img src="https://raw.githubusercontent.com/catamphetamine/react-phone-number-input/master/docs/images/first-glance.png" width="270" height="113"/>

### Country selection on desktop

<img src="https://raw.githubusercontent.com/catamphetamine/react-phone-number-input/master/docs/images/desktop-native-select.png" width="475" height="223"/>

### Country selection on mobile

<img src="https://raw.githubusercontent.com/catamphetamine/react-phone-number-input/master/docs/images/iphone-native-select.png" width="380" height="443"/>

## Install

```
npm install react-phone-number-input --save
```

If you're not using a bundler then use a [standalone version from a CDN](https://github.com/catamphetamine/react-phone-number-input/#cdn).

## Use

The component requires two properties to be passed: `value` and `onChange(value)`.

```js
import 'react-phone-number-input/style.css'
import PhoneInput from 'react-phone-number-input'

return (
  <PhoneInput
    placeholder="Enter phone number"
    value={ this.state.value }
    onChange={ value => this.setState({ value }) } />
)
```

The `value` argument of `onChange(value)` function will be the parsed phone number in [E.164](https://en.wikipedia.org/wiki/E.164) format. For example, if a user chooses "United States" and enters `(213) 373-4253` in the input field then `onChange(value)` will be called with `value` being `"+12133734253"`.

See the [list of all available `props`](http://catamphetamine.github.io/react-phone-number-input/docs/styleguide/index.html#phoneinput) for `<PhoneInput/>`. All properties not listed there will be passed through to the phone number `<input/>` component.

To set default country pass a `country` property. Example: `<PhoneInput country="US" .../>`.

To get selected `country` pass an `onCountryChange(country)` property, or use [`parsePhoneNumber(value)`](#parsephonenumberinput-string-phonenumber) function. Example: `parsePhoneNumber(value) && parsePhoneNumber(value).country`.

To format `value` back to a human-readable phone number use [`formatPhoneNumber(value)`](#formatphonenumbervalue-string-string) and [`formatPhoneNumberIntl(value)`](#formatphonenumberintlvalue-string-string) functions.

There's also a ["without country select"](#without-country-select) component available.

<!--
The input is based on [`libphonenumber-js`](https://github.com/catamphetamine/libphonenumber-js) phone number parsing/formatting library. The [`formatPhoneNumber(value, format)`](https://github.com/catamphetamine/libphonenumber-js#formatnumbernumber-format-options) function can be used to output the `value` in `"National"` or `"International"` format.
-->

<!--
The phone number `<input/>` itself is implemented using [`input-format`](https://catamphetamine.github.io/input-format/) (which has an issue with some Samsung Android phones, [see the workaround](#android)).
-->

## CSS

#### When using Webpack

```js
import 'react-phone-number-input/style.css'
```

It is also recommended to set up something like a [`postcss-loader`](https://github.com/postcss/postcss-loader) with a [CSS autoprefixer](https://github.com/postcss/autoprefixer) for supporting old web browsers.

#### When not using Webpack

Get the `style.css` file from this package, optionally process it with a [CSS autoprefixer](https://github.com/postcss/autoprefixer) for supporting old web browsers, and then include the CSS file on a page.

```html
<head>
  <link rel="stylesheet" href="/css/react-phone-number-input/style.css"/>
</head>
```

Or include the `style.css` file directly from a [CDN](#cdn).

## Utility

This package exports several utility functions.

### `formatPhoneNumber(value: string): string`

Formats `value` as a "local" phone number.

```js
import { formatPhoneNumber } from 'react-phone-number-input'
formatPhoneNumber('+12133734253') === '(213) 373-4253'
```

### `formatPhoneNumberIntl(value: string): string`

Formats `value` as an "international" phone number.

```js
import { formatPhoneNumberIntl } from 'react-phone-number-input'
formatPhoneNumberIntl('+12133734253') === '+1 213 373 4253'
```

### `isValidPhoneNumber(value: string): boolean`

Validates a phone number `value`.

```js
import { isValidPhoneNumber } from 'react-phone-number-input'
isValidPhoneNumber('+12133734253') === true
```

By default the component uses [`min` "metadata"](#min-vs-max-vs-mobile) which results in less strict validation compared to [`max`](#min-vs-max-vs-mobile) or [`mobile`](#min-vs-max-vs-mobile).

I personally [wouldn't use](https://github.com/catamphetamine/libphonenumber-js#using-phone-number-validation-feature) strict phone number validation at all because telephone numbering plans constantly evolve and validation rules do change over time which means `isValidPhoneNumber()` function may become outdated if a website isn't re-deployed regularly. Still, some people wanted this feature, so it's included.

### `parsePhoneNumber(input: string): PhoneNumber?`

Parses a [`PhoneNumber`](https://github.com/catamphetamine/libphonenumber-js#phonenumber) object from a `string`. This is simply an alias for [`parsePhoneNumberFromString()`](https://github.com/catamphetamine/libphonenumber-js#parsephonenumberfromstringstring-defaultcountry) from [`libphonenumber-js`](https://github.com/catamphetamine/libphonenumber-js). Can be used to get `country` from `value`.

```js
import { parsePhoneNumber } from 'react-phone-number-input'
const phoneNumber = parsePhoneNumber('+12133734253')
if (phoneNumber) {
  phoneNumber.country === 'US'
}
```

### `getCountryCallingCode(country: string): string`

This is simply an alias for [`getCountryCallingCode()`](https://github.com/catamphetamine/libphonenumber-js#getcountrycallingcodecountry) from [`libphonenumber-js`](https://github.com/catamphetamine/libphonenumber-js).

```js
import { getCountryCallingCode } from 'react-phone-number-input'
getCountryCallingCode('US') === '1'
```

## Flags

Including all country flags in the code in SVG format would be the best way to go but turns out they take an extra 550 kB when gzipped. That's the reason why all country flags are included as `<img src="..."/>` from [`flag-icon-css`](http://flag-icon-css.lip.is/) repo GitHub pages (can be overridden via [`flagsPath`](http://catamphetamine.github.io/react-phone-number-input/docs/styleguide/index.html#phoneinput) property).

To include all country flags in code in SVG format:

```js
import PhoneInput from 'react-phone-number-input'
import flags from 'react-phone-number-input/flags'

<PhoneInput flags={flags} .../>
```

<!--
## Android

There have been [reports](https://github.com/catamphetamine/react-phone-number-input/issues/75) of some Samsung Android phones not handling caret positioning properly (e.g. Samsung Galaxy S8+, Samsung Galaxy S7 Edge).

The workaround is to pass `smartCaret={false}` property:

```js
import PhoneInput from 'react-phone-number-input'

<PhoneInput
  smartCaret={false}
  value={this.state.value}
  onChange={value => this.setState(value)}/>
```

`smartCaret={false}` caret is not as "smart" as the default one but still works good enough (and has no issues on Samsung Android phones). When erasing or inserting digits in the middle of a phone number this caret usually jumps to the end: this is the expected behaviour because the "smart" caret positioning has been turned off specifically to fix this Samsung Android phones issue.
-->

## Localization

Language translations can be applied using the `labels` property. This component comes pre-packaged with several [translations](https://github.com/catamphetamine/react-phone-number-input/tree/master/locale) (submit pull requests for adding new language translations).

The `labels` format is:

```js
{
  // Country `<select/>` `aria-label`.
  "country": "Country",
  // Phone number `<input/>` `aria-label`.
  // (not set by default)
  "phone": "Phone",
  // Phone number "extension" `aria-label`.
  // (not set by default)
  "ext": "ext.",
  // Country names.
  "AB": "Abkhazia",
  "AC": "Ascension Island",
  ...,
  "ZZ": "International"
}
```

An example of using translated `labels`:

```js
import ru from 'react-phone-number-input/locale/ru'
<PhoneInput ... labels={ru}/>
```

By default, the country `<select/>` has `aria-label` set to `labels.country` which is `"Country"` for the default `labels`. When passing `labels` for other languages the default `aria-label` of the country `<select/>` will be translated too. To set a custom `aria-label` on the country `<select/>` pass a `countrySelectAriaLabel` property to `<PhoneInput/>`.

The phone `<input/>` `aria-label` is not set automatically to `labels.phone` for legacy reasons. To set it manually pass an `aria-label` property to `<PhoneInput/>`.

## `min` vs `max` vs `mobile`

This component uses [`libphonenumber-js`](https://github.com/catamphetamine/libphonenumber-js) which requires choosing a "metadata" set to be used, "metadata" being a list of phone number parsing and formatting rules for all countries. The complete list of rules is huge, so `libphonenumber-js` provides a way to optimize bundle size by choosing between `max`, `min`, `mobile` and custom metadata:

* `max` — The complete metadata set, is about `140 kilobytes` in size (`libphonenumber-js/metadata.full.json`).

* `min` — (default) The smallest metadata set, is about `75 kilobytes` in size (`libphonenumber-js/metadata.min.json`). Doesn't contain regular expressions for advanced phone number validation. Some simple phone number validation still works (basic length check, etc), it's just that it's loose compared to the "advanced" validation (not so strict). Choose this when not using `isValidPhoneNumber(value)` function.

* `mobile` — The complete metadata set for dealing with mobile numbers _only_, is about `105 kilobytes` in size (`libphonenumber-js/metadata.mobile.json`). Choose this when using `isValidPhoneNumber(value)` function, but only dealing with mobile phone numbers.

To use a particular metadata set import the component from the relevant sub-package: `react-phone-number-input/max`, `react-phone-number-input/min` or `react-phone-number-input/mobile`.

Importing the component directly from `react-phone-number-input` results in using the `min` metadata which means loose (non-strict) phone number validation.

Sometimes (rarely) not all countries are needed and in those cases the developers may want to [generate](https://github.com/catamphetamine/libphonenumber-js#customizing-metadata) their own "custom" metadata set. For those cases there's `react-phone-number-input/core` sub-package which doesn't come pre-wired with any default metadata and instead accepts the metadata as a property.

## Bug reporting

If you think that the phone number parsing/formatting/validation engine malfunctions for a particular phone number then follow the [bug reporting instructions in `libphonenumber-js` repo](https://github.com/catamphetamine/libphonenumber-js#bug-reporting). Otherwise report issues in this repo.

## Autocomplete

Make sure to put a `<PhoneInput/>` into a `<form/>` otherwise web-browser's ["autocomplete"](https://www.w3schools.com/tags/att_input_autocomplete.asp) feature may not be working: a user will be selecting his phone number from the list but [nothing will be happening](https://github.com/catamphetamine/react-phone-number-input/issues/101).

## Without country select

Some people prefer just a phone number input component without country `<select/>`.

```js
import PhoneInput from 'react-phone-number-input/input'

class Example extends Component {
  state = {
    value: ''
  }

  render() {
    // If `country` property is not passed
    // then "International" format is used.
    return (
      <PhoneInput
        country="US"
        value={ this.state.value }
        onChange={ value => this.setState({ value }) } />
    )
  }
}
```

Receives properties:

* `country: string?` — If no `country` is specified then the phone number can only be input in international format.
* `value: string?` — Phone number `value`. Examples: `undefined`, `"+12133734253"`.
* `onChange(value: string?)` — Updates the `value`.
* `inputComponent: component?` — A custom `<input/>` component can be passed.

For those who want to pass custom `metadata` there's `react-phone-number-input/input-core` subpackage.

## Custom country `<select/>`

One can supply their own country `<select/>` component in case the native one doesn't fit the app. See [`countrySelectComponent`](https://github.com/catamphetamine/react-phone-number-input#customizing) property.

For example, one may choose [`react-responsive-ui`](https://catamphetamine.github.io/react-responsive-ui/)'s [`<Select/>` component](https://github.com/catamphetamine/react-phone-number-input/blob/master/source/CountrySelectReactResponsiveUI.js) over the [native country `<select/>`](https://github.com/catamphetamine/react-phone-number-input/blob/master/source/CountrySelectNative.js).

<!--
// Or import styles individually to reduce bundle size for a little bit:
// import 'react-responsive-ui/variables.css'
// import 'react-responsive-ui/styles/Expandable.css'
// ...
// import 'react-responsive-ui/styles/Select.css'
-->

```js
import 'react-phone-number-input/style.css'

// Requires "CSS custom properties" support.
// For Internet Explorer use PostCSS with "CSS custom properties" plugin.
import 'react-responsive-ui/style.css'

// A `<PhoneInput/>` with custom `countrySelectComponent`.
import PhoneInput from 'react-phone-number-input/react-responsive-ui'

return (
  <PhoneInput
    placeholder="Enter phone number"
    value={ this.state.phone }
    onChange={ phone => this.setState({ phone }) } />
)
```

## Extensions

There's nothing special about a phone number extension input: it doesn't need any formatting, it can just be a simple `<input type="number"/>`. Still, some users kept asking for a phone number extension input feature. So I added a basic phone number extension input support. It can be activated by passing `ext` property (a `React.Element`, see the demo).

```js
import React, { Component } from 'react'
import { Field, reduxForm } from 'redux-form'
import PhoneInput from 'react-phone-number-input'

class Form extends Component {
  render() {
    const ext = (
      <input
        value={ ... }
        onChange={ ... }
        type="number"
        noValidate />
    )

    return (
      <form onSubmit={ ... }>
        <PhoneInput
          value={ ... }
          onChange={ ... }
          ext={ ext } />

        <button type="submit">
          Submit
        </button>
      </form>
    );
  }
}
```

In a real-world application the `ext` property is most likely gonna be a "form field", e.g. an [`easy-react-form`](https://github.com/catamphetamine/basic-react-form) `<Field/>`, or a `redux-form` `<Field/>`, or a `react-final-form` `<Field/>`.

Phone number extension input will appear to the right of the phone number input. One can always skip using the `ext` property and add a completely separate form field for phone number extension input instead.

`{ number, ext }` object can be converted to an [RFC3966](https://www.ietf.org/rfc/rfc3966.txt) string for storing it in a database.

```js
import { formatRFC3966 } from 'react-phone-number-input'

formatRFC3966({ number: '+12133734253', ext: '123' })
// 'tel:+12133734253;ext=123'
```

Use the accompanying `parseRFC3966()` function to convert an RFC3966 string into an object having shape `{ number, ext }`.

```js
import { parseRFC3966 } from 'react-phone-number-input'

parseRFC3966('tel:+12133734253;ext=123')
// { number: '+12133734253', ext: '123' }
```

## Customizing

The `<PhoneInput/>` component accepts some [customization properties](http://catamphetamine.github.io/react-phone-number-input/docs/styleguide/index.html#phoneinput):

* `metadata` — Custom `libphonenumber-js` ["metadata"](#min-vs-max-vs-mobile).

* `labels` — Custom translation (including country names).

* `internationalIcon` — Custom "International" icon.

* `numberInputComponent` — Custom phone number `<input/>` component.

* `countrySelectComponent` — Custom country `<select/>` component.

```js
import PhoneInput from 'react-phone-number-input/min'

import metadata from 'libphonenumber-js/metadata.min.json'
import labels from 'react-phone-number-input/locale/ru'
import InternationalIcon from 'react-phone-number-input/international-icon'

<PhoneInput
  numberInputComponent={...}
  countrySelectComponent={...}
  labels={labels}
  metadata={metadata}
  internationalIcon={InternationalIcon}/>
```

All these customization properties have their default values. If some of those default values are not used, and the developer wants to reduce the bundle size a bit, then they can use the `/core` export instead of the default export to import a `<PhoneInput/>` component which doesn't include any of the default customization properties: in this case all customization properties must be passed.

```js
import PhoneInput from 'react-phone-number-input/core'
```

#### `countrySelectComponent`

React component for the country select. See [CountrySelectNative](https://github.com/catamphetamine/react-phone-number-input/blob/master/source/CountrySelectNative.js) and [CountrySelectReactResponsiveUI](https://github.com/catamphetamine/react-phone-number-input/blob/master/source/CountrySelectReactResponsiveUI.js) for an example.

Receives properties:

* `name : string?` — HTML `name` attribute.
* `value : string?` — The currently selected country code.
* `onChange(value : string?)` — Updates the `value`.
* `onFocus()` — Is used to toggle the `--focus` CSS class.
* `onBlur()` — Is used to toggle the `--focus` CSS class.
* `options : object[]` — The list of all selectable countries (including "International") each being an object of shape `{ value : string?, label : string, icon : React.Component }`.
* `disabled : boolean?` — HTML `disabled` attribute.
* `tabIndex : (number|string)?` — HTML `tabIndex` attribute.
* `className : string` — CSS class name.

#### `numberInputComponent`

React component for the phone number input field. Is `"input"` by default meaning that it renders a standard DOM `<input/>`.

Receives properties:

* `value: string` — The formatted `value`.
* `onChange(event: Event)` — Updates the formatted `value` from `event.target.value`.
* `onFocus()` — Is used to toggle the `--focus` CSS class.
* `onBlur(event: Event)` — Is used to toggle the `--focus` CSS class.
* Other properties like `type="tel"` or `autoComplete="tel"` that should be passed through to the DOM `<input/>`.

Must also either use `React.forwardRef()` to "forward" `ref` to the `<input/>` or implement `.focus()` method.

<!--
#### `inputComponent`

React component for the phone number input field (a higher-order one). See [InputSmart](https://github.com/catamphetamine/react-phone-number-input/blob/master/source/InputSmart.js) and [InputBasic](https://github.com/catamphetamine/react-phone-number-input/blob/master/source/InputBasic.js) for an example.

Receives properties:

* `value : string` — The parsed phone number. E.g.: `""`, `"+"`, `"+123"`, `"123"`.
* `onChange(value : string)` — Updates the `value`.
* `onFocus()` — Is used to toggle the `--focus` CSS class.
* `onBlur()` — Is used to toggle the `--focus` CSS class.
* `country : string?` — The currently selected country. `undefined` means "International" (no country selected).
* `metadata : object` — `libphonenumber-js` metadata.
* All other properties should be passed through to the underlying `<input/>`.

Must also either use `React.forwardRef()` to "forward" `ref` to the `<input/>` or implement `.focus()` method.
-->

## CDN

One can use any npm CDN service, e.g. [unpkg.com](https://unpkg.com) or [jsdelivr.net](https://jsdelivr.net)

```html
<!-- `libphonenumber-js` (is used internally by `react-phone-number-input`). -->
<script src="https://unpkg.com/libphonenumber-js@1.x/bundle/libphonenumber-js.min.js"></script>

<!-- Either `react-phone-number-input` with "native" country `<select/>`. -->
<script src="https://unpkg.com/react-phone-number-input@2.x/bundle/react-phone-number-input-native.js"></script>

<!-- or `react-phone-number-input` with "native" country `<select/>` (with "max" metadata). -->
<script src="https://unpkg.com/react-phone-number-input@2.x/bundle/react-phone-number-input-native-max.js"></script>

<!-- or `react-phone-number-input` with "native" country `<select/>` (with "mobile" metadata). -->
<script src="https://unpkg.com/react-phone-number-input@2.x/bundle/react-phone-number-input-native-mobile.js"></script>

<!-- Or `react-phone-number-input` with `react-responsive-ui` `<Select/>`. -->
<script src="https://unpkg.com/react-phone-number-input@2.x/bundle/react-phone-number-input-react-responsive-ui.js"></script>

<!-- Or `react-phone-number-input` without country `<select/>`. -->
<script src="https://unpkg.com/react-phone-number-input@2.x/bundle/react-phone-number-input-no-country-select.js"></script>

<!-- Styles for the component. -->
<link rel="stylesheet" href="https://unpkg.com/react-phone-number-input@2.x/bundle/style.css"/>

<!-- Styles for `react-responsive-ui` `<Select/> -->
<!-- (only if `react-responsive-ui` `<Select/>` is used). -->
<link rel="stylesheet" href="https://unpkg.com/react-responsive-ui@^0.14.0/style.css"/>

<script>
  var PhoneInput = window['react-phone-number-input']
</script>
```

## Advertisement

[React Responsive UI](https://catamphetamine.github.io/react-responsive-ui/) component library.

## License

[MIT](LICENSE)
