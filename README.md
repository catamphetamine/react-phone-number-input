# react-phone-number-input

[![npm version](https://img.shields.io/npm/v/react-phone-number-input.svg?style=flat-square)](https://www.npmjs.com/package/react-phone-number-input)
[![npm downloads](https://img.shields.io/npm/dm/react-phone-number-input.svg?style=flat-square)](https://www.npmjs.com/package/react-phone-number-input)

International phone number `<input/>` for React.

[<img src="https://gitlab.com/catamphetamine/react-phone-number-input/-/raw/master/docs/images/first-glance-local.png" width="270" height="113"/>](http://catamphetamine.gitlab.io/react-phone-number-input/)

[See Demo](http://catamphetamine.gitlab.io/react-phone-number-input/)

<!-- This is a readme for the latest version (`3.x`) of the library. The previous version (`2.x`) readme could be found on [github](https://github.com/catamphetamine/react-phone-number-input/tree/2.x) until they removed it. For migrating from `2.x` to `3.x` see the [changelog](https://gitlab.com/catamphetamine/react-phone-number-input/blob/master/CHANGELOG.md). -->

<!--
## Screenshots

### Phone number input

<img src="https://gitlab.com/catamphetamine/react-phone-number-input/-/raw/master/docs/images/first-glance-local.png" width="270" height="113"/>

<img src="https://gitlab.com/catamphetamine/react-phone-number-input/-/raw/master/docs/images/first-glance.png" width="270" height="113"/>

### Country selection on desktop

<img src="https://gitlab.com/catamphetamine/react-phone-number-input/-/raw/master/docs/images/desktop-native-select.png" width="475" height="223"/>

### Country selection on mobile

<img src="https://gitlab.com/catamphetamine/react-phone-number-input/-/raw/master/docs/images/iphone-native-select.png" width="380" height="443"/>
-->

## Install

```
npm install react-phone-number-input --save
```

If you're not using a bundler then use a [standalone version from a CDN](https://gitlab.com/catamphetamine/react-phone-number-input/#cdn).

The component uses [`libphonenumber-js`](https://www.npmjs.com/package/libphonenumber-js) for phone number parsing and formatting.

## Use

The component comes in two variants: "with country select" and "without country select".

## With country select

"With country select" component requires two properties: `value` and `onChange(value)`. [See the list of all available `props`](http://catamphetamine.gitlab.io/react-phone-number-input/docs/index.html#phoneinputwithcountry).

```js
import 'react-phone-number-input/style.css'
import PhoneInput from 'react-phone-number-input'

function Example() {
  // `value` will be the parsed phone number in E.164 format.
  // Example: "+12133734253".
  const [value, setValue] = useState()
  return (
    <PhoneInput
      placeholder="Enter phone number"
      value={value}
      onChange={setValue}/>
  )
}
```

The `value` argument of `onChange(value)` function will be the parsed phone number in [E.164](https://en.wikipedia.org/wiki/E.164) format. For example, if a user chooses "United States" and enters `(213) 373-4253` in the input field then `onChange(value)` will be called with `value` being `"+12133734253"`.

Any ["falsy"](https://developer.mozilla.org/en-US/docs/Glossary/Falsy) `value` like `undefined`, `null` or an empty string `""` is treated like "empty". In case of the `onChange()` function's `value` argument though it's always `undefined` for an "empty" `value`, i.e. when the user erases the input value, `onChange()` is called with `undefined` as an argument. Perhaps `null` would've been better, but historically it has been `undefined`.

All unknown properties will be passed through to the phone number `<input/>` component.

To set a default country, pass a `defaultCountry` property (must be a supported [country code](#country-code)). Example: `<PhoneInput defaultCountry="US" .../>`.

To get the currently selected country, pass an `onCountryChange(country)` property.

To get the country of a complete phone number, use [`parsePhoneNumber(value)`](#parsephonenumberinput-string-phonenumber): `parsePhoneNumber(value) && parsePhoneNumber(value).country`.

To format `value` back to a human-readable phone number, use [`formatPhoneNumber(value)`](#formatphonenumbervalue-string-string) or [`formatPhoneNumberIntl(value)`](#formatphonenumberintlvalue-string-string).

<!--
The input is based on [`libphonenumber-js`](https://gitlab.com/catamphetamine/libphonenumber-js) phone number parsing/formatting library. The [`formatPhoneNumber(value, format)`](https://gitlab.com/catamphetamine/libphonenumber-js#formatnumbernumber-format-options) function can be used to output the `value` in `"National"` or `"International"` format.
-->

<!--
The phone number `<input/>` itself is implemented using [`input-format`](https://catamphetamine.gitlab.io/input-format/) (which has an issue with some Samsung Android phones, [see the workaround](#android)).
-->

#### CSS

"With country select" component comes with a [`style.css`](https://gitlab.com/catamphetamine/react-phone-number-input/blob/master/style.css) stylesheet. All CSS class names start with `.PhoneInput`. Additional "modifier" CSS classes: `.PhoneInput--focus` for `:focus`, `.PhoneInput--disabled` for `:disabled`, `.PhoneInput--readOnly` for `[readonly]`.

The stylesheet uses [native CSS variables](https://medium.freecodecamp.org/learn-css-variables-in-5-minutes-80cf63b4025d) for convenience. Native CSS variables work in all modern browsers, but older ones like Internet Explorer [wont't support them](https://caniuse.com/#search=var). For compatibility with such older browsers one can use a CSS transformer like [PostCSS](http://postcss.org/) with a "CSS custom properties" plugin like [`postcss-custom-properties`](https://github.com/postcss/postcss-custom-properties).

Some of the CSS variables:

* `--PhoneInputCountryFlag-height` — Flag icon height.
* `--PhoneInputCountryFlag-borderColor` — Flag icon outline color.
* `--PhoneInputCountrySelectArrow-color` — Country select arrow color.
* `--PhoneInputCountrySelectArrow-opacity` — Country select arrow opacity (when not `:focus`ed).
* `--PhoneInput-color--focus` — Flag icon `:focus` outline color, and also country select arrow `:focus` color.
* …

##### When using Webpack

When using Webpack, include the stylesheet on a page via `import`:

```js
import 'react-phone-number-input/style.css'
```

For supporting old browsers like Internet Explorer, one could
use [`postcss-loader`](https://github.com/postcss/postcss-loader) with a [CSS autoprefixer](https://github.com/postcss/autoprefixer) and [`postcss-custom-properties` transpiler](https://github.com/postcss/postcss-custom-properties).

##### When not using Webpack

Get `style.css` file from this package, optionally process it with a [CSS autoprefixer](https://github.com/postcss/autoprefixer) and [`postcss-custom-properties` transpiler](https://github.com/postcss/postcss-custom-properties) for supporting old web browsers, and then include the CSS file on a page.

```html
<head>
  <link rel="stylesheet" href="/css/react-phone-number-input/style.css"/>
</head>
```

Or include the `style.css` file directly from a [CDN](#cdn) if you don't have to support Internet Explorer.

## Without country select

"Without country select" component is just a phone number `<input/>`.

```js
import PhoneInput from 'react-phone-number-input/input'

function Example() {
  // `value` will be the parsed phone number in E.164 format.
  // Example: "+12133734253".
  const [value, setValue] = useState()
  // If `country` property is not passed
  // then "International" format is used.
  // Otherwise, "National" format is used.
  return (
    <PhoneInput
      country="US"
      value={value}
      onChange={setValue} />
  )
}
```

Doesn't require any CSS.

Receives properties:

* `country: string?` — If `country` is specified then the phone number can only be input in "national" (not "international") format, and will be parsed as a phone number belonging to the `country`. Must be a supported [country code](#country-code). Example: `country="US"`.

* `international: boolean?` — If `country` is specified and `international` property is `true` then the phone number can only be input in "international" format for that `country`. By default, the "country calling code" part (`+1` when `country` is `US`) is not included in the input field: that could be changed by passing `withCountryCallingCode` property (see below). So, if `country` is `US` and `international` property is not passed then the phone number can only be input in the "national" format for `US` (`(213) 373-4253`). But if `country` is `"US"` and `international` property is `true` then the phone number can only be input in the "international" format for `US` (`213 373 4253`) without the "country calling code" part (`+1`). This could be used for implementing phone number input components that show "country calling code" part before the input field and then the user can fill in the rest of their phone number digits in the input field.

* `withCountryCallingCode: boolean?` — If `country` is specified and `international` property is `true` then the phone number can only be input in "international" format for that `country`. By default, the "country calling code" part (example: `+1` when `country` is `US`) is not included in the input field. To change that, pass `withCountryCallingCode` property, and it will include the "country calling code" part in the input field. See the demo for an example.

* `defaultCountry: string?` — If `defaultCountry` is specified then the phone number can be input both in "international" format and "national" format. A phone number that's being input in "national" format will be parsed as a phone number belonging to the `defaultCountry`. Must be a supported [country code](#country-code). Example: `defaultCountry="US"`.

* If neither `country` nor `defaultCountry` are specified then the phone number can only be input in "international" format.

* `value: string?` — Phone number `value`. Examples: `undefined`, `"+12133734253"`.

* `onChange(value: string?)` — Updates the `value` (to `undefined` in case it's empty).

* `inputComponent: component?` — A custom `<input/>` component can be passed. In that case, it must do `React.forwardRef()` to the actual `<input/>` DOM element. Receives properties: `value: string`, `onChange(event: Event)`, and all the "rest" of the properties that're not handled by this library, like `type="tel"`, `autoComplete="tel"`, etc. Is a generic DOM `<input/>` by default.

* `smartCaret: boolean?` — When the user attempts to insert a digit somewhere in the middle of a phone number, the caret position is moved right before the next available digit skipping any punctuation in between. This is called "smart" caret positioning. Another case would be the phone number format changing as a result of the user inserting the digit somewhere in the middle, which would require re-positioning the caret because all digit positions have changed. This "smart" caret positioning feature can be turned off by passing `smartCaret={false}` property: use it in case of any possible issues with caret position during phone number input.

* `useNationalFormatForDefaultCountryValue: boolean?` — When `defaultCountry` is defined and the initial `value` corresponds to `defaultCountry`, then the `value` will be formatted as a national phone number by default. To format the initial `value` of `defaultCountry` as an international number instead set `useNationalFormatForDefaultCountryValue` property to `false`.

See the [demo](http://catamphetamine.gitlab.io/react-phone-number-input/) for the examples.

For those who want to pass custom `metadata` there's `react-phone-number-input/input-core` sub-package.

This library also exports `getCountries()` and `getCountryCallingCode(country)` functions that a developer could use to construct their own custom country select. Such custom country `<select/>` could be used in conjunction with the "without country select" `<input/>` described above.

<details>
<summary>Creating a custom country <code>&lt;select/&gt;</code></summary>

####

```js
import PropTypes from 'prop-types'
import { getCountries, getCountryCallingCode } from 'react-phone-number-input'

const CountrySelect = ({ value, onChange, labels, ...rest }) => (
  <select
    {...rest}
    value={value}
    onChange={event => onChange(event.target.value || undefined)}>
    <option value="">
      {labels['ZZ']}
    </option>
    {getCountries().map((country) => (
      <option key={country} value={country}>
        {labels[country]} +{getCountryCallingCode(country)}
      </option>
    ))}
  </select>
)

CountrySelect.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  labels: PropTypes.objectOf(PropTypes.string).isRequired
}
```

Use:

```js
import PhoneInput from 'react-phone-number-input/input'
import en from 'react-phone-number-input/locale/en'
import CountrySelect from './CountrySelect'

function Example() {
  const [country, setCountry] = useState('US')
  const [value, setValue] = useState()
  return (
    <div>
      <CountrySelect
        labels={en}
        value={country}
        onChange={setCountry}/>
      <PhoneInput
        country={country}
        value={value}
        onChange={setValue}/>
    </div>
  )
}
```
</details>

## React Native

This library also includes a React Native version of a "without country select" component. Post bug reports and suggestions in the [feedback thread](https://github.com/catamphetamine/react-phone-number-input/issues/296).

```js
import React, { useState } from 'react'
import PhoneInput from 'react-phone-number-input/react-native-input'

function Example() {
  const [value, setValue] = useState()
  return (
    <PhoneInput
      style={...}
      defaultCountry="US"
      value={value}
      onChange={setValue} />
  )
}
```

Accepts the same properties as the web version of "without country select" component, with the following differences:

* `smartCaret: boolean?` property is not accepted because "smart caret" positioning feature is not implemented in the React Native component.

* `inputComponent: component?` — A custom input field component can be passed. In that case, it must do `React.forwardRef()` to the actual input field. Receives properties: `value: string`, `onChangeText(value: string)`, and all the "rest" of the properties that're not handled by this library, like `keyboardType="phone-pad"`, `autoCompleteType="tel"`, etc. Is a generic `<TextInput/>` by default.

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

### `isPossiblePhoneNumber(value: string): boolean`

Checks if a phone number `value` is a "possible" phone number. A phone number is "possible" when it has valid length. The actual phone number digits aren't validated.

```js
import { isPossiblePhoneNumber } from 'react-phone-number-input'
isPossiblePhoneNumber('+12223333333') === true
```

### `isValidPhoneNumber(value: string): boolean`

Checks if a phone number `value` is a "valid" phone number. A phone number is "valid" when it has valid length, and the actual phone number digits match the regular expressions for that country.

```js
import { isValidPhoneNumber } from 'react-phone-number-input'
isValidPhoneNumber('+12223333333') === false
isValidPhoneNumber('+12133734253') === true
```

By default the component uses [`min` "metadata"](#min-vs-max-vs-mobile) which results in less strict validation compared to [`max`](#min-vs-max-vs-mobile) or [`mobile`](#min-vs-max-vs-mobile).

I personally don't use `isValidPhoneNumber()` for phone number validation in my projects. The rationale is that telephone numbering plans can and sometimes do change, meaning that `isValidPhoneNumber()`function may one day become outdated on a website that isn't actively maintained anymore. Imagine a "promo-site" or a "personal website" being deployed once and then running for years without any maintenance, where a client may be unable to submit a simple "Contact Us" form just because this newly allocated pool of mobile phone numbers wasn't present in that old version of `libphonenumber-js` bundled in it.

Whenever there's a "business requirement" to validate a phone number that's being input by a user, I prefer using `isPossiblePhoneNumber()` instead of `isValidPhoneNumber()`, so that it just validates the phone number length, and doesn't validate the actual phone number digits. But it doesn't mean that you shouldn't use `isValidPhoneNumber()` — maybe in your case it would make sense.

### `parsePhoneNumber(input: string): PhoneNumber?`

Parses a [`PhoneNumber`](https://gitlab.com/catamphetamine/libphonenumber-js#phonenumber) object from a `string`. This is simply an alias for [`parsePhoneNumber()`](https://gitlab.com/catamphetamine/libphonenumber-js#parsephonenumberstring-options-or-defaultcountry-phonenumber) from [`libphonenumber-js`](https://gitlab.com/catamphetamine/libphonenumber-js). Can be used to get `country` from `value`.

```js
import { parsePhoneNumber } from 'react-phone-number-input'
const phoneNumber = parsePhoneNumber('+12133734253')
if (phoneNumber) {
  phoneNumber.country === 'US'
}
```

### `getCountryCallingCode(country: string): string`

Returns the ["country calling code"](https://gitlab.com/catamphetamine/libphonenumber-js#country-calling-code) of a `country`. The `country` argument must be a supported [country code](#country-code).

This is simply an alias for [`getCountryCallingCode()`](https://gitlab.com/catamphetamine/libphonenumber-js#getcountrycallingcodecountry) from [`libphonenumber-js`](https://gitlab.com/catamphetamine/libphonenumber-js).

```js
import { getCountryCallingCode } from 'react-phone-number-input'
getCountryCallingCode('US') === '1'
```

### `isSupportedCountry(country: string): boolean`

Checks if a [country](#country-code) is supported by this library.

This is simply an alias for [`isSupportedCountry()`](https://gitlab.com/catamphetamine/libphonenumber-js#issupportedcountrycountry-string-boolean) from [`libphonenumber-js`](https://gitlab.com/catamphetamine/libphonenumber-js).

```js
import { isSupportedCountry } from 'react-phone-number-input'
isSupportedCountry('US') === true
```

## Flags URL

By default, all flags are linked from [`country-flag-icons`](https://gitlab.com/catamphetamine/country-flag-icons)'s [GitHub pages](https://purecatamphetamine.github.io/country-flag-icons/3x2) website as `<img src="..."/>`s. Any other flag icons could be used instead by passing a custom [`flagUrl`](http://catamphetamine.gitlab.io/react-phone-number-input/docs#phoneinputwithcountry) property (which is `"https://purecatamphetamine.github.io/country-flag-icons/3x2/{XX}.svg"` by default) and specifying their aspect ratio via [`--PhoneInputCountryFlag-aspectRatio`](https://gitlab.com/catamphetamine/react-phone-number-input/blob/master/style.css) CSS variable (which is `1.5` by default, meaning "3x2" aspect ratio).

For example, using [`flagpack`](https://github.com/jackiboy/flagpack) "4x3" flag icons would be as simple as:

```css
:root {
  --PhoneInputCountryFlag-aspectRatio: 1.333;
}
```

```js
<PhoneInput flagUrl="https://flag.pk/flags/4x3/{xx}.svg" .../>
```

## Including all flags

Linking flag icons as external `<img/>`s is only done to reduce the overall bundle size, because including all country flags in the code as inline `<svg/>`s would increase the bundle size by 44 kB (after gzip).

If bundle size is not an issue (for example, for a standalone non-web application, or an "intranet" application), then all country flags can be included directly in the code by passing the [`flags`](http://catamphetamine.gitlab.io/react-phone-number-input/docs#phoneinputwithcountry) property:

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

Language translations can be applied using the `labels` property. This component comes pre-packaged with several [translations](https://gitlab.com/catamphetamine/react-phone-number-input/tree/master/locale). Submit pull requests for adding new language translations.

<details>
<summary>Where to get country names for any language.</summary>

####

Country names can be copy-pasted from [`github.com/umpirsky/country-list`](https://github.com/umpirsky/country-list/blob/master/data/).

```js
JSON.stringify(
  Object.keys(countries).sort()
    .reduce((all, country) => ({ ...all, [country]: countries[country] }), {}),
  null,
  '\t'
)
````

Also note that a country names list generated from `umpirsky/country-list` won't include Ascension Island (`AC`) and Tristan da Cunha (`TA`) — they will need to be added manually.
</details>

####

The `labels` format is:

```js
{
  // Can be used as a label for country input.
  // Country `<select/>` uses this as its default `aria-label`.
  "country": "Phone number country",
  // Can be used as a label for phone number input.
  "phone": "Phone",
  // Can be used as a label for phone number extension input.
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

## `min` vs `max` vs `mobile`

This component uses [`libphonenumber-js`](https://gitlab.com/catamphetamine/libphonenumber-js) which provides different "metadata" sets, "metadata" being a list of phone number parsing and formatting rules for all countries. The complete list of those rules is huge, so `libphonenumber-js` provides a way to optimize bundle size by choosing between `max`, `min`, `mobile` and "custom" metadata:

* `max` — The complete metadata set, is about `145 kB` in size (`libphonenumber-js/metadata.max.json`). Choose this when you need the most strict version of `isValid()`, or if you need to detect phone number type ("fixed line", "mobile", etc).

* `min` — (default) The smallest metadata set, is about `80 kB` in size (`libphonenumber-js/metadata.min.json`). Choose this by default: when you don't need to detect phone number type ("fixed line", "mobile", etc), or when a basic version of `isValid()` is enough. The `min` metadata set doesn't contain the regular expressions for phone number digits validation (via [`.isValid()`](#isvalid)) and detecting phone number type (via [`.getType()`](#gettype)) for most countries. In this case, `.isValid()` still performs some basic phone number validation (for example, checks phone number length), but it doesn't validate phone number digits themselves the way `max` metadata validation does.

* `mobile` — The complete metadata set for dealing with mobile numbers _only_, is about `95 kilobytes` in size (`libphonenumber-js/metadata.mobile.json`). Choose this when you need `max` metadata and when you _only_ accept mobile numbers. Other phone number types will still be parseable, but they won't be recognized as being "valid" (`isValidPhoneNumber()` will return `false`).

To use a particular metadata set, simply import functions from a relevant sub-package.

For "with country select" component those're:

* `react-phone-number-input/max`
* `react-phone-number-input/min`
* `react-phone-number-input/mobile`

Importing functions directly from `react-phone-number-input` effectively results in using the `min` metadata.

For "without country select" component the sub-packages are:

* `react-phone-number-input/input-max`
* `react-phone-number-input/input` (for `min`)
* `react-phone-number-input/input-mobile`

Sometimes (rarely) not all countries are needed, and in those cases developers may want to [generate](#customizing-metadata) their own "custom" metadata set. For those cases, there's a `/core` sub-package that doesn't come pre-packaged with any default metadata set and instead accepts metadata as a component property and as the last argument of each exported function.

For "with country select" component, the `/core` export is `react-phone-number-input/core`, and for "without country select" component, the `/core` export is `react-phone-number-input/input-core`.

## Bug reporting

If you think that the phone number parsing/formatting/validation engine malfunctions for a particular phone number then it could be for several reasons:

* `libphonenumber-js`, which is what this package uses internally, parses/formats/validates phone numbers incorrectly. To test if that's the case, follow the instructions outlined in the [bug reporting section of `libphonenumber-js` repo readme](https://gitlab.com/catamphetamine/libphonenumber-js#bug-reporting).

* `react-phone-number-input`'s exported `isValidPhoneNumber()` function is a "stripped-down" "min" version of the same function exported from `libphonenumber-js` package, so if you think that the validation is too lax, use the `isValidPhoneNumber()` function from `libphonenumber-js/max` package instead.

* In other cases, report issues in this repo.

## Autocomplete

Make sure to put a `<PhoneInput/>` into a `<form/>` otherwise web-browser's ["autocomplete"](https://www.w3schools.com/tags/att_input_autocomplete.asp) feature may not be working: a user will be selecting his phone number from the list but [nothing will be happening](https://gitlab.com/catamphetamine/react-phone-number-input/issues/101).

## `react-hook-form`

To use this component with [`react-hook-form`](https://react-hook-form.com), use one of the four exported components:

```js
// "Without country select" component.
import PhoneInput from 'react-phone-number-input/react-hook-form-input'

// "Without country select" component (to pass custom `metadata` property).
import PhoneInput from 'react-phone-number-input/react-hook-form-input-core'

// "With country select" component.
import PhoneInputWithCountry from 'react-phone-number-input/react-hook-form'

// "With country select" component (to pass custom `metadata` property).
import PhoneInputWithCountry from 'react-phone-number-input/react-hook-form-core'
```

[Example](https://codesandbox.io/s/recursing-brook-kmtjw):

```js
// "Without country select" component.
import PhoneInput from "react-phone-number-input/react-hook-form-input"

// "With country select" component.
import PhoneInputWithCountry from "react-phone-number-input/react-hook-form"

import { useForm } from "react-hook-form"

export default function Form() {
  const {
    // Either pass a `control` property to the component
    // or wrap it in a `<FormProvider/>`.
    control,
    handleSubmit
  } = useForm()

  return (
    <form onSubmit={handleSubmit(...)}>
      <PhoneInput
        name="phoneInput"
        control={control}
        rules={{ required: true }} />

      <PhoneInputWithCountry
        name="phoneInputWithCountrySelect"
        control={control}
        rules={{ required: true }} />

      <button type="submit">
        Submit
      </button>
    </form>
  )
}
```

Both components accept properties:

* `name` — (required) Form field name.

* `control` — (required) The `control` object returned from `useForm()`.

* `rules` — (optional) Validation rules in the same format as for `register()`. Example: `{{ required: true, validate: isPossiblePhoneNumber }}`.

* `defaultValue` — (optional) A default value could be passed directly to the component, or as part of the `defaultValues` parameter of `useForm()`.

<!-- * `shouldUnregister` — (optional) (advanced) Same as `shouldUnregister` parameter of `register()` (see `react-hook-form` docs for more info). Pass `true` to clear the value from form values on input component unmount: for example, when showing or hiding phone input field. `shouldUnregister` can also be set globally for all fields when passed as a parameter to `useForm()`. -->

## Customizing

"With country select" `<PhoneInput/>` component accepts some [customization properties](http://catamphetamine.gitlab.io/react-phone-number-input/docs#phoneinputwithcountry):

* `inputComponent` — Custom phone number `<input/>` component.

<!-- * `containerComponent` — Custom wrapping `<div/>` component. -->

* `metadata` — Custom `libphonenumber-js` ["metadata"](#min-vs-max-vs-mobile).

* `labels` — Custom translation (including country names).

* `internationalIcon` — Custom "International" icon.

* `flagComponent` — Custom flag icon component.

* `countrySelectComponent` — Custom country `<select/>` component.

* `countrySelectProps.arrowComponent` — Custom arrow component of the default country `<select/>`.

### `react-phone-number-input/core`

"With country select" component imported from `react-phone-number-input/core` subpackage doesn't have default values for the following properties:

* `metadata`

* `labels`

It could be used by developers who'd like to provide their own custom-generated metadata that supports a smaller set of countries.

#### `countrySelectComponent`

React component for the country select. See [CountrySelect.js](https://gitlab.com/catamphetamine/react-phone-number-input/blob/master/source/CountrySelect.js) for an example.

Receives properties:

* `name: string?` — HTML `name` attribute.
* `value: string?` — The currently selected country code (`undefined` in case of "International").
* `onChange(value: string?)` — Updates the `value` (to `undefined` in case of "International").
* `onFocus()` — Is used to toggle the `--focus` CSS class.
* `onBlur()` — Is used to toggle the `--focus` CSS class.
* `options: object[]` — The list of all selectable countries (including "International") each being an object of shape `{ value: string?, label: string }`.
* `iconComponent: PropTypes.elementType` — React component that renders a country icon: `<Icon country={value}/>`. If `country` is `undefined` then it renders an "International" icon.
* `disabled: boolean?` — HTML `disabled` attribute.
* `readOnly: boolean?` — HTML `readonly` attribute.
* `tabIndex: (number|string)?` — HTML `tabIndex` attribute.
* `className: string` — CSS class name.

#### `inputComponent`

React component for the phone number input field. Is `"input"` by default meaning that it renders a standard DOM `<input/>`.

Receives properties:

* `value: string` — The formatted `value`.
* `onChange(event: Event)` — Updates the formatted `value` from `event.target.value`.
* `onFocus()` — Is used to toggle the `--focus` CSS class.
* `onBlur(event: Event)` — Is used to toggle the `--focus` CSS class.
* Other properties like `type="tel"` or `autoComplete="tel"` that should be passed through to the DOM `<input/>`.

Must also use `React.forwardRef()` to "forward" `ref` to the `<input/>`.

<!--
#### `inputComponent`

React component for the phone number input field (a higher-order one). See [InputSmart](https://gitlab.com/catamphetamine/react-phone-number-input/blob/master/source/InputSmart.js) and [InputBasic](https://gitlab.com/catamphetamine/react-phone-number-input/blob/master/source/InputBasic.js) for an example.

Receives properties:

* `value : string` — The parsed phone number. E.g.: `""`, `"+"`, `"+123"`, `"123"`.
* `onChange(value : string)` — Updates the `value` (to `undefined` in case it's empty).
* `onFocus()` — Is used to toggle the `--focus` CSS class.
* `onBlur()` — Is used to toggle the `--focus` CSS class.
* `country : string?` — The currently selected country. `undefined` means "International" (no country selected).
* `metadata : object` — `libphonenumber-js` metadata.
* All other properties should be passed through to the underlying `<input/>`.

Must also either use `React.forwardRef()` to "forward" `ref` to the `<input/>` or implement `.focus()` method.
-->

<!--
#### `containerComponent`

React component that contains the country picker and input. Is `"div"` by default meaning that it renders a standard DOM `<div/>`.

Receives properties:

* `style: object` — A component CSS style object.
* `className: string` — Classes to attach to the component, typically changes when component focuses or blurs.
-->

## CDN

One can use any npm CDN service, e.g. [unpkg.com](https://unpkg.com) or [jsdelivr.net](https://jsdelivr.net)

```html
<!-- Default ("min" metadata). -->
<script src="https://unpkg.com/react-phone-number-input@3.x/bundle/react-phone-number-input.js"></script>

<!-- Or "max" metadata. -->
<script src="https://unpkg.com/react-phone-number-input@3.x/bundle/react-phone-number-input-max.js"></script>

<!-- Or "mobile" metadata. -->
<script src="https://unpkg.com/react-phone-number-input@3.x/bundle/react-phone-number-input-mobile.js"></script>

<!-- Styles for the component. -->
<!-- Internet Explorer requires transpiling CSS variables. -->
<link rel="stylesheet" href="https://unpkg.com/react-phone-number-input@3.x/bundle/style.css"/>

<script>
  var PhoneInput = window.PhoneInput.default
</script>
```

Without country select:

```html
<!-- Without country `<select/>` ("min" metadata). -->
<script src="https://unpkg.com/react-phone-number-input@3.x/bundle/react-phone-number-input-input.js"></script>

<script>
  var PhoneInput = window.PhoneInput.default
</script>
```

<!--
## Advertisement

[React Responsive UI](https://catamphetamine.gitlab.io/react-responsive-ui/) component library.
-->

## Country code

A "country code" is a [two-letter ISO country code](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2) (like `US`).

This library supports all [officially assigned](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2#Officially_assigned_code_elements) ISO alpha-2 country codes, plus a few extra ones like: `AC` ([Ascension Island](https://en.wikipedia.org/wiki/Ascension_Island)), `TA` ([Tristan da Cunha](https://en.wikipedia.org/wiki/Tristan_da_Cunha)), `XK` ([Kosovo](https://en.wikipedia.org/wiki/Kosovo)).

To check whether a country code is supported, use [`isSupportedCountry()`](#issupportedcountrycountry-string-boolean) function.

## TypeScript

This library comes with TypeScript "typings". If you happen to find any bugs in those, create an issue.

## Tests

This component comes with 100% code coverage for the core `./source/helpers` directory.

To run tests:

```
npm test
```

To generate a code coverage report:

```
npm run test-coverage
```

The code coverage report can be viewed by opening `./coverage/lcov-report/index.html`.

If the code coverage report is "empty" then it means that a newer version of `handlebars` was accidentally installed and should be reverted to `handlebars@4.5.3`.

The `handlebars@4.5.3` [work](https://github.com/handlebars-lang/handlebars.js/issues/1646#issuecomment-578306544)[around](https://github.com/facebook/jest/issues/9396#issuecomment-573328488) in `devDependencies` is for the test coverage to not produce empty reports:

```
Handlebars: Access has been denied to resolve the property "statements" because it is not an "own property" of its parent.
You can add a runtime option to disable the check or this warning:
See https://handlebarsjs.com/api-reference/runtime-options.html#options-to-control-prototype-access for details
```

## GitHub

On March 9th, 2020, GitHub, Inc. silently [banned](https://medium.com/@catamphetamine/how-github-blocked-me-and-all-my-libraries-c32c61f061d3) my account (erasing all my repos, issues and comments) without any notice or explanation. Because of that, all source codes had to be promptly moved to [GitLab](https://gitlab.com/catamphetamine/react-phone-number-input). GitHub repo is now deprecated, and the latest source codes can be found on GitLab, which is also the place to report any issues.

## License

[MIT](LICENSE)
