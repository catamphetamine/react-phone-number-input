# react-phone-number-input

[![npm version](https://img.shields.io/npm/v/react-phone-number-input.svg?style=flat-square)](https://www.npmjs.com/package/react-phone-number-input)
[![npm downloads](https://img.shields.io/npm/dm/react-phone-number-input.svg?style=flat-square)](https://www.npmjs.com/package/react-phone-number-input)

International phone number `<input/>` for React (iPhone style).

[See Demo](http://catamphetamine.github.io/react-phone-number-input/)

## Screenshots

<img src="https://raw.githubusercontent.com/catamphetamine/react-phone-number-input/master/docs/images/first-glance-local.png" width="270" height="113"/>

<img src="https://raw.githubusercontent.com/catamphetamine/react-phone-number-input/master/docs/images/first-glance.png" width="270" height="113"/>

## Native `<select/>`

### Desktop

<img src="https://raw.githubusercontent.com/catamphetamine/react-phone-number-input/master/docs/images/desktop-native-select.png" width="475" height="223"/>

### Mobile

<img src="https://raw.githubusercontent.com/catamphetamine/react-phone-number-input/master/docs/images/iphone-native-select.png" width="380" height="443"/>

## Usage

```js
import 'react-phone-number-input/style.css'
import PhoneInput from 'react-phone-number-input'

return (
  <PhoneInput
    placeholder="Enter phone number"
    value={ this.state.phone }
    onChange={ phone => this.setState({ phone }) } />
)
```

The input is based on [`libphonenumber-js`](https://github.com/catamphetamine/libphonenumber-js) international phone number parsing and formatting library.

<!--
The phone number `<input/>` itself is implemented using [`input-format`](https://catamphetamine.github.io/input-format/) (which has an issue with some Samsung Android phones, [see the workaround](#android)).
-->

## CSS

The styles for this React component must be included on a page too.

#### When using Webpack

```js
import 'react-phone-number-input/style.css'
```

It is also recommended to set up something like a [`postcss-loader`](https://github.com/postcss/postcss-loader) with a [CSS autoprefixer](https://github.com/postcss/autoprefixer) for supporting old web browsers (e.g. `> 1%`).

#### When not using Webpack

Get the `style.css` file from this package, optionally process it with a [CSS autoprefixer](https://github.com/postcss/autoprefixer) for supporting old web browsers (e.g. `> 1%`), and then include the CSS file on a page.

```html
<head>
  <link rel="stylesheet" href="/css/react-phone-number-input/style.css"/>
</head>
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

## Validation

For phone number validation use [`libphonenumber-js`](https://github.com/catamphetamine/libphonenumber-js)'s [`isValidNumber(value)`](https://github.com/catamphetamine/libphonenumber-js#isvalidnumbernumber-defaultcountry) function.

## Autocomplete

Make sure to wrap a `<PhoneInput/>` into a `<form/>` otherwise web-browser's ["autocomplete"](https://www.w3schools.com/tags/att_input_autocomplete.asp) feature may not be working: a user will be selecting his phone number from the list but [nothing will be happening](https://github.com/catamphetamine/react-phone-number-input/issues/101).

## Custom country `<select/>`

One can supply their own country `<select/>` component in case the native one doesn't fit the app. Here's an example of using [`react-responsive-ui`](https://catamphetamine.github.io/react-responsive-ui/) `<Select/>` component.

<!--
// Or import styles individually to reduce bundle size for a little bit:
// import 'react-responsive-ui/variables.css'
// import 'react-responsive-ui/styles/Expandable.css'
// ...
// import 'react-responsive-ui/styles/Select.css'
-->

```js
import 'react-phone-number-input/style.css'
import 'react-responsive-ui/style.css'

// Supplies custom `countrySelectComponent` property.
import PhoneInput from 'react-phone-number-input/react-responsive-ui'

return (
  <PhoneInput
    placeholder="Enter phone number"
    value={ this.state.phone }
    onChange={ phone => this.setState({ phone }) } />
)
```

## Without country select

Some people requested an exported minimal phone number input component without country `<select/>`.

```js
import PhoneInput from `react-phone-number-input/basic-input`

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

## Bug reporting

If you think that the phone number parsing/formatting/validation engine malfunctions for a particular phone number then follow the [bug reporting instructions in `libphonenumber-js` repo](https://github.com/catamphetamine/libphonenumber-js#bug-reporting).

## API

### React component

The available props are

 * `value` — Phone number in [E.164](https://en.wikipedia.org/wiki/E.164) format. E.g. `+12223333333` for USA.

 * `onChange` — Updates the `value`.

 * `country` — (optional) The country which is selected by default (can be set after a GeoIP lookup). E.g. `US`.

 * `countries` — (optional) Only the specified countries will be selectable. E.g. `['RU', 'KZ', 'UA']`.

 * `countryOptions` - (optional) Can move some countries to the top of the list. E.g. `['US', 'CA', 'AU', '|', '...']`.

 * `flagsPath` — (optional) A base URL path for national flag SVG icons. By default it loads flag icons from [`flag-icon-css` github repo](https://github.com/lipis/flag-icon-css). I imagine someone might want to download those SVG flag icons and host them on their own servers instead.

 * `flags` — (optional) Supplies `<svg/>` elements for flags instead of the default `<img src="..."/>` ones. This might be suitable if someone's making an application which is supposed to be able to work offline (a downloadable app, or an "internal" website): `import flags from 'react-phone-number-input/flags'`.

 * `flagComponent` — (optional) A React component for displaying a country flag (replaces the default flag icons).

 * `displayInitialValueAsLocalNumber` — (optional) (see the example on the demo page) If set to `true` will display `value` phone number in local format when the component mounts or when `value` property is set after it has already been mounted. The default behaviour is `false` meaning that if initial `value` is set then it will be displayed in international format (e.g. `+7 800 555 35 35`). The reason for such default behaviour is that the newer generation grows up when there are no stationary phones and therefore everyone inputs phone numbers as international ones in their smartphones so people gradually get more accustomed to writing phone numbers in international form rather than in local form.

 * `error` — (optional) a `String` error message.

For the full list of all possible `props` see the [source code](https://github.com/catamphetamine/react-phone-number-input/blob/master/source/PhoneInput.js). All other properties are passed through to the `<input/>` component.

## Localization

Country names can be passed via the `labels` property. E.g. `labels={{ RU: 'Россия', US: 'США', ... }}`. This component comes pre-packaged with a couple of ready-made [translations](https://github.com/catamphetamine/react-phone-number-input/tree/master/locale). Submit pull requests for adding new translations.

```js
import ru from 'react-phone-number-input/locale/ru'

<PhoneInput ... labels={ru}/>
```

## Extensions

Some users asked for phone extension input feature. It can be activated by passing `ext` property (a `React.Element`).

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

In a real-world application the `ext` property is most likely gonna be a [`basic-react-form`](https://github.com/catamphetamine/basic-react-form) `<Field/>`, or a `redux-form` `<Field/>`, or a `react-final-form` `<Field/>`.

The code above hasn't been tested, but it most likely works. Phone extension input will appear to the right of the phone number input. One can always skip using `ext` property and add a completely separate form field for phone number extension input instead.

`{ number, ext }` object can be converted to [RFC3966](https://www.ietf.org/rfc/rfc3966.txt) string for storing it in a database.

```js
import { formatRFC3966 } from 'libphonenumber-js'

formatRFC3966({ number: '+12133734253', ext: '123' })
// 'tel:+12133734253;ext=123'
```

Use the accompanying `parseRFC3966()` function to convert an RFC3966 string into an object having shape `{ number, ext }`.

```js
import { parseRFC3966 } from 'libphonenumber-js'

parseRFC3966('tel:+12133734253;ext=123')
// { number: '+12133734253', ext: '123' }
```

## Customizing

One can use the `/custom` export to import a bare `<PhoneInput/>` component and supply it with custom properties such as country select component and phone number input field component.

```js
import PhoneInput from 'react-phone-number-input/custom'
import InternationalIcon from 'react-phone-number-input/international-icon'
import labels from 'react-phone-number-input/locale/ru'

<PhoneInput
  countrySelectComponent={...}
  inputComponent={...}
  internationalIcon={InternationalIcon}
  labels={labels}/>
```

#### `countrySelectComponent`

React component for the country select. See [CountrySelectNative](https://github.com/catamphetamine/react-phone-number-input/blob/master/source/CountrySelectNative.js) and [CountrySelectReactResponsiveUI](https://github.com/catamphetamine/react-phone-number-input/blob/master/source/CountrySelectReactResponsiveUI.js) for an example.

Receives properties:

* `name : string?` — HTML `name` attribute.
* `value : string?` — The currently selected country code.
* `onChange(value : string?)` — Updates the `value`.
* `options : object[]` — The list of all selectable countries (including "International") each being an object of shape `{ value : string?, label : string, icon : React.Component }`.
* `disabled : boolean?` — HTML `disabled` attribute.
* `tabIndex : (number|string)?` — HTML `tabIndex` attribute.
* `className : string` — CSS class name.

#### `inputComponent`

React component for the phone number input field. See [InputSmart](https://github.com/catamphetamine/react-phone-number-input/blob/master/source/InputSmart.js) and [InputBasic](https://github.com/catamphetamine/react-phone-number-input/blob/master/source/InputBasic.js) for an example.

Receives properties:

* `value : string` — The parsed phone number. E.g.: `""`, `"+"`, `"+123"`, `"123"`.
* `onChange(value : string)` — Updates the `value`.
* `country : string?` — The currently selected country. `undefined` means "International" (no country selected).
* `metadata : object` — `libphonenumber-js` metadata.
* All other properties should be passed through to the underlying `<input/>`.

Must also implement `.focus()` method.

## Flags

Since this is a React component I thought that finding all country flags in SVG and including them as native React components as part of this library would be the best way to go. But then it truned out that when bundled all those country flags would take the extra 3 megabytes which is obviously not an option for a website (though it might be an option for an "internal" web application, or a desktop application built with Electron, or a mobile app).

So, including all country flags in the javascript bundle wouldn't be an option, and so all country flags are included as `<img src="..."/>` flags (by default the `src` points to [`flag-icon-css`](http://flag-icon-css.lip.is/) GitHub repo). And when using the (default) native country `<select/>` only the selected country flag icon is displayed therefore reducing footprint to the minimum.

For the same reasons the custom `react-responsive-ui` country `<select/>` doesn't show all country flag icons when expanded: otherwise the user would have to download all those flag icons when the country `<select/>` is expanded.

## Reducing bundle size

By default all countries are included which means that [`libphonenumber-js`](https://github.com/catamphetamine/libphonenumber-js) loads the default metadata having the size of 75 kilobytes. This really isn't much but for those who still want to reduce that to a lesser size by generating their own reduced metadata set there is a possibility to pass custom `metadata` property to the `react-phone-number-input/custom` export.

For generating custom metadata see [the guide in `libphonenumber-js` repo](https://github.com/catamphetamine/libphonenumber-js#customizing-metadata).

## Module not found: Error: Can't resolve 'libphonenumber-js/metadata.min'

This error means that your Webpack is misconfigured to exclude `.json` file extension from [the list of the resolved ones](https://webpack.js.org/configuration/resolve/#resolve-extensions). To fix that add it back to `resolve.extensions`.

```js
{
  resolve: {
    extensions: [".js", ".json", ...]
  }
}
```

If you're using Webpack 1 then upgrade to a newer version.

## CDN

One can use any npm CDN service, e.g. [unpkg.com](https://unpkg.com) or [jsdelivr.net](https://jsdelivr.net)

```html
<!-- `libphonenumber-js` (is used internally by `react-phone-number-input`). -->
<script src="https://unpkg.com/libphonenumber-js@1.2.15/bundle/libphonenumber-js.min.js"></script>

<!-- Either `react-phone-number-input` with "native" country `<select/>`. -->
<script src="https://unpkg.com/react-phone-number-input@2.0.0/bundle/react-phone-number-input-native.js"></script>

<!-- Or `react-phone-number-input` with `react-responsive-ui` `<Select/>`. -->
<script src="https://unpkg.com/react-phone-number-input@2.0.0/bundle/react-phone-number-input-react-responsive-ui.js"></script>

<!-- Styles for the component. -->
<link rel="stylesheet" href="https://unpkg.com/react-phone-number-input@2.0.0/bundle/style.css"/>

<!-- Styles for `react-responsive-ui` `<Select/> -->
<!-- (only if `react-responsive-ui` `<Select/>` is used). -->
<link rel="stylesheet" href="https://unpkg.com/react-responsive-ui@0.13.8/bundle/style.css"/>

<script>
  var PhoneInput = window['react-phone-number-input']
</script>
```

## Advertisement

[React Responsive UI](https://catamphetamine.github.io/react-responsive-ui/) component library.

## License

[MIT](LICENSE)
