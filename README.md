# react-phone-number-input

[![npm version](https://img.shields.io/npm/v/react-phone-number-input.svg?style=flat-square)](https://www.npmjs.com/package/react-phone-number-input)
[![npm downloads](https://img.shields.io/npm/dm/react-phone-number-input.svg?style=flat-square)](https://www.npmjs.com/package/react-phone-number-input)

International phone number `<input/>` for React.

[See Demo](http://catamphetamine.github.io/react-phone-number-input/)

This is a readme for the latest version (`3.x`) of the library. The previous version (`2.x`) readme can be found [here](https://github.com/catamphetamine/react-phone-number-input/tree/2.x). For migrating from `2.x` to `3.x` see the [changelog](https://github.com/catamphetamine/react-phone-number-input/blob/master/CHANGELOG.md).

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

The component requires two properties: `value` and `onChange(value)`.

```js
import 'react-phone-number-input/style.css'
import PhoneInput from 'react-phone-number-input'

const [value, setValue] = useState()
return (
  <PhoneInput
    placeholder="Enter phone number"
    value={value}
    onChange={setValue}/>
)
```

The `value` argument of `onChange(value)` function will be the parsed phone number in [E.164](https://en.wikipedia.org/wiki/E.164) format. For example, if a user chooses "United States" and enters `(213) 373-4253` in the input field then `onChange(value)` will be called with `value` being `"+12133734253"`.

See the [list of all available `props`](http://catamphetamine.github.io/react-phone-number-input/docs/styleguide/index.html#phoneinputwithcountry) for `<PhoneInput/>`. All properties not listed there will be passed through to the phone number `<input/>` component.

To set default country pass a `defaultCountry` property. Example: `<PhoneInput defaultCountry="US" .../>`.

To get selected country pass an `onCountryChange(country)` property, or use [`parsePhoneNumber(value)`](#parsephonenumberinput-string-phonenumber) function to get `country` from `value`: `parsePhoneNumber(value) && parsePhoneNumber(value).country`.

To format `value` back to a human-readable phone number use [`formatPhoneNumber(value)`](#formatphonenumbervalue-string-string) or [`formatPhoneNumberIntl(value)`](#formatphonenumberintlvalue-string-string) functions.

There's also a ["without country select"](#without-country-select) phone number input component available.

<!--
The input is based on [`libphonenumber-js`](https://github.com/catamphetamine/libphonenumber-js) phone number parsing/formatting library. The [`formatPhoneNumber(value, format)`](https://github.com/catamphetamine/libphonenumber-js#formatnumbernumber-format-options) function can be used to output the `value` in `"National"` or `"International"` format.
-->

<!--
The phone number `<input/>` itself is implemented using [`input-format`](https://catamphetamine.github.io/input-format/) (which has an issue with some Samsung Android phones, [see the workaround](#android)).
-->

## CSS

The styles for this component are in the [`style.css`](https://github.com/catamphetamine/react-phone-number-input/blob/master/style.css) file. CSS class names start with `.PhoneInput`, and for `:focus` state there's `.PhoneInput--focus` CSS class name.

The stylesheet uses [native CSS variables](https://medium.freecodecamp.org/learn-css-variables-in-5-minutes-80cf63b4025d) for easier styling. Native CSS variables work in all modern browsers, but older ones like Internet Explorer [wont't support them](https://caniuse.com/#search=var). For compatibility with such older browsers one can use a CSS transformer like [PostCSS](http://postcss.org/) with a "CSS custom properties" plugin like [`postcss-custom-properties`](https://github.com/postcss/postcss-custom-properties).

An example of CSS variables:

* `--PhoneInputCountryFlag-height` — Flag icon height.
* `--PhoneInputCountryFlag-borderColor` — Flag icon outline color.
* `--PhoneInputCountrySelectArrow-color` — Country select arrow color.
* `--PhoneInputCountrySelectArrow-opacity` — Country select arrow opacity (when not `:focus`ed).
* `--PhoneInput-color--focus` — Flag icon `:focus` outline color, and also country select arrow `:focus` color.

#### When using Webpack

When using Webpack, include the stylesheet on a page via `import`:

```js
import 'react-phone-number-input/style.css'
```

It is also recommended to set up something like a [`postcss-loader`](https://github.com/postcss/postcss-loader) with a [CSS autoprefixer](https://github.com/postcss/autoprefixer) or [`postcss-custom-properties` transpiler](https://github.com/postcss/postcss-custom-properties) for supporting old web browsers.

#### When not using Webpack

Get `style.css` file from this package, optionally process it with a [CSS autoprefixer](https://github.com/postcss/autoprefixer) or [`postcss-custom-properties` transpiler](https://github.com/postcss/postcss-custom-properties) for supporting old web browsers, and then include the CSS file on a page.

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

### `isPossiblePhoneNumber(value: string): boolean`

Checks if the phone number is "possible". Only checks the phone number length, doesn't check the number digits against any regular expressions like `isValidPhoneNumber()` does.

```js
import { isPossiblePhoneNumber } from 'react-phone-number-input'
isPossiblePhoneNumber('+12133734253') === true
isPossiblePhoneNumber('+19999999999') === true
```

### `isValidPhoneNumber(value: string): boolean`

Validates a phone number `value`.

```js
import { isValidPhoneNumber } from 'react-phone-number-input'
isValidPhoneNumber('+12133734253') === true
isValidPhoneNumber('+19999999999') === false
```

By default the component uses [`min` "metadata"](#min-vs-max-vs-mobile) which results in less strict validation compared to [`max`](#min-vs-max-vs-mobile) or [`mobile`](#min-vs-max-vs-mobile).

I personally [don't use](https://github.com/catamphetamine/libphonenumber-js#using-phone-number-validation-feature) strict phone number validation in my projects because telephone numbering plans sometimes change and so validation rules can change too which means that `isValidPhoneNumber()` function may become outdated if a website isn't re-deployed regularly. If it was required to validate a phone number being input by a user, then I'd personally use something like `isPossiblePhoneNumber()` that just validates phone number length.

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

By default, all flags are linked from [`country-flag-icons`](https://github.com/catamphetamine/country-flag-icons)'s [GitHub pages](http://catamphetamine.github.io/country-flag-icons/3x2) website as `<img src="..."/>`s. Any other flag icons could be used instead by passing a custom [`flagUrl`](http://catamphetamine.github.io/react-phone-number-input/docs/styleguide/index.html#phoneinputwithcountry) property, which is `"https://catamphetamine.github.io/country-flag-icons/3x2/{XX}.svg"` by default. The aspect ratio of flag icons is controlled by [`--PhoneInputCountryFlag-width`](https://github.com/catamphetamine/react-phone-number-input/blob/master/style.css) CSS variable, which is `calc(var(--PhoneInputCountryFlag-height) * 3 / 2)` by default (meaning "3x2" aspect ratio).

Linking flag icons as external `<img/>`s is only done to reduce the overall bundle size, because including all country flags in the code as inline `<svg/>`s would increase the bundle size by 44 kB (after gzip).

If bundle size is not an issue (for example, for a standalone non-web application, or an "intranet" application), then all country flags can be included directly in the code by passing the [`flags`](http://catamphetamine.github.io/react-phone-number-input/docs/styleguide/index.html#phoneinputwithcountry) property:

```js
import PhoneInput from 'react-phone-number-input'
import flags from 'react-phone-number-input/flags'

<PhoneInput flags={flags} .../>
```

## Without country select

To render just a phone number input component without country `<select/>`:

```js
import PhoneInput from 'react-phone-number-input/input'

function Example() {
  // `value` will be the parsed phone number in E.164 format.
  // Example: "+12133734253".
  const [value, setValue] = useState()
  // If `country` property is not passed
  // then "International" format is used.
  return (
    <PhoneInput
      country="US"
      value={value}
      onChange={setValue} />
  )
}
```

Receives properties:

* `country: string?` — If `country` is specified then the phone number can only be input in "national" (not "international") format, and will be parsed as a phone number belonging to the `country`. Example: `country="US"`.

* `international: boolean?` — If `country` is specified and `international` property is `true` then the phone number can only be input in "international" format for that `country`, but without "country calling code" part. For example, if `country` is `"US"` and `international` property is not passed then the phone number can only be input in the "national" format for `US` (`(213) 373-4253`). But if `country` is `"US"` and `international` property is `true` then the phone number will be input in the "international" format for `US` (`213 373 4253`) without "country calling code" part (`+1`). This could be used for implementing phone number input components that show "country calling code" part before the input field and then the user can fill in the rest of their phone number in the input field.

* `defaultCountry: string?` — If `defaultCountry` is specified then the phone number can be input both in "international" format and "national" format. A phone number that's being input in "national" format will be parsed as a phone number belonging to the `defaultCountry`. Example: `defaultCountry="US"`.

* If neither `country` nor `defaultCountry` are specified then the phone number can only be input in "international" format.

* `value: string?` — Phone number `value`. Examples: `undefined`, `"+12133734253"`.

* `onChange(value: string?)` — Updates the `value`.

* `inputComponent: component?` — A custom `<input/>` component can be passed. In that case, it must be a `React.forwardRef()` to the actual `<input/>`.

* `smartCaret: boolean?` — By default, the `<input/>` uses "smart" caret positioning. To turn that behavior off one can pass `smartCaret={false}` property.

* `useNationalFormatForDefaultCountryValue: boolean?` — When `defaultCountry` is defined and the initial `value` corresponds to `defaultCountry`, then the `value` will be formatted as a national phone number by default. To format the initial `value` of `defaultCountry` as an international number instead set `useNationalFormatForDefaultCountryValue` property to `false`.

See the [demo](http://catamphetamine.github.io/react-phone-number-input/) for the examples.

For those who want to pass custom `metadata` there's `react-phone-number-input/input-core` subpackage.

#### Creating custom country `<select/>`

This library also exports `getCountries()` and `getCountryCallingCode(country)` functions so that a developer could construct their own custom country select. Such custom country `<select/>` could be used in conjunction with "without country select" input described above.

```js
import { getCountries, getCountryCallingCode } from 'react-phone-number-input/input'
import en from 'react-phone-number-input/locale/en.json'

<select
  value={country}
  onChange={event => setCountry(event.target.value || undefined)}>
  <option value="">
    {en['ZZ']}
  </option>
  {getCountries().map((country) => (
    <option key={country} value={country}>
      {en[country]} +{getCountryCallingCode(country)}
    </option>
  ))}
</select>
```

See the [demo](http://catamphetamine.github.io/react-phone-number-input/) for the example.

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

This component uses [`libphonenumber-js`](https://github.com/catamphetamine/libphonenumber-js) which requires choosing a "metadata" set to be used, "metadata" being a list of phone number parsing and formatting rules for all countries. The complete list of rules is huge, so `libphonenumber-js` provides a way to optimize bundle size by choosing between `max`, `min`, `mobile` and custom metadata:

* `max` — The complete metadata set, is about `140 kilobytes` in size (`libphonenumber-js/metadata.full.json`). Choose this when you need a strict version of `isValidPhoneNumber(value)` function, or if you need to get phone number type (fixed line, mobile, etc).

* `min` — (default) The smallest metadata set, is about `75 kilobytes` in size (`libphonenumber-js/metadata.min.json`). Doesn't contain regular expressions for advanced phone number validation ([`.isValid()`](https://github.com/catamphetamine/libphonenumber-js#isvalid)) and determining phone number type ([`.getType()`](https://github.com/catamphetamine/libphonenumber-js#gettype)) for most countries. Some simple phone number validation via `.isValid()` still works (basic length check, etc), it's just that it's loose compared to the "advanced" validation (not so strict). Choose this by default: when you don't need to get phone number type (fixed line, mobile, etc), or when a non-strict version of `isValidPhoneNumber(value)` function is enough.

* `mobile` — The complete metadata set for dealing with mobile numbers _only_, is about `105 kilobytes` in size (`libphonenumber-js/metadata.mobile.json`). Choose this when you _only_ work with mobile numbers and a strict version of `isValidPhoneNumber(value)` function is required for validating mobile numbers.

To use a particular metadata set import the component from the relevant sub-package: `react-phone-number-input/max`, `react-phone-number-input/min` or `react-phone-number-input/mobile`.

Importing the component directly from `react-phone-number-input` results in using the `min` metadata which means loose (non-strict) phone number validation.

Sometimes (rarely) not all countries are needed and in those cases the developers may want to [generate](https://github.com/catamphetamine/libphonenumber-js#customizing-metadata) their own "custom" metadata set. For those cases there's `react-phone-number-input/core` sub-package which doesn't come pre-wired with any default metadata and instead accepts the metadata as a property.

## Bug reporting

If you think that the phone number parsing/formatting/validation engine malfunctions for a particular phone number then follow the [bug reporting instructions in `libphonenumber-js` repo](https://github.com/catamphetamine/libphonenumber-js#bug-reporting). Otherwise report issues in this repo.

## Autocomplete

Make sure to put a `<PhoneInput/>` into a `<form/>` otherwise web-browser's ["autocomplete"](https://www.w3schools.com/tags/att_input_autocomplete.asp) feature may not be working: a user will be selecting his phone number from the list but [nothing will be happening](https://github.com/catamphetamine/react-phone-number-input/issues/101).

## Customizing

The `<PhoneInput/>` component accepts some [customization properties](http://catamphetamine.github.io/react-phone-number-input/docs/styleguide/index.html#phoneinputwithcountry):

* `inputComponent` — Custom phone number `<input/>` component.

* `countrySelectComponent` — Custom country `<select/>` component.

* `metadata` — Custom `libphonenumber-js` ["metadata"](#min-vs-max-vs-mobile).

* `labels` — Custom translation (including country names).

* `internationalIcon` — Custom "International" icon.

```js
import PhoneInput from 'react-phone-number-input/min'

import metadata from 'libphonenumber-js/metadata.min.json'
import labels from 'react-phone-number-input/locale/en.json'

<PhoneInput
  inputComponent={...}
  countrySelectComponent={...}
  labels={labels}
  metadata={metadata}/>
```

All these customization properties have their default values. If some of those default values are not used, and the developer wants to reduce the bundle size a bit, then they can use the `/core` export instead of the default export to import a `<PhoneInput/>` component which doesn't include any of the default customization properties: in this case all customization properties must be passed (except for `internationalIcon`).

```js
import PhoneInput from 'react-phone-number-input/core'
```

#### `countrySelectComponent`

React component for the country select. See [CountrySelect.js](https://github.com/catamphetamine/react-phone-number-input/blob/master/source/CountrySelect.js) for an example.

Receives properties:

* `name: string?` — HTML `name` attribute.
* `value: string?` — The currently selected country code.
* `onChange(value: string?)` — Updates the `value`.
* `onFocus()` — Is used to toggle the `--focus` CSS class.
* `onBlur()` — Is used to toggle the `--focus` CSS class.
* `options: object[]` — The list of all selectable countries (including "International") each being an object of shape `{ value: string?, label: string }`.
* `iconComponent: PropTypes.elementType` — React component that renders a country icon: `<Icon country={value}/>`. If `country` is `undefined` then it renders an "International" icon.
* `disabled: boolean?` — HTML `disabled` attribute.
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

[React Responsive UI](https://catamphetamine.github.io/react-responsive-ui/) component library.
-->

## License

[MIT](LICENSE)
