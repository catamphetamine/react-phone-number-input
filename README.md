# react-phone-number-input

[![npm version](https://img.shields.io/npm/v/react-phone-number-input.svg?style=flat-square)](https://www.npmjs.com/package/react-phone-number-input)
[![npm downloads](https://img.shields.io/npm/dm/react-phone-number-input.svg?style=flat-square)](https://www.npmjs.com/package/react-phone-number-input)

International phone number `<input/>` (and output) (in React) (iPhone style)

[See Demo](http://halt-hammerzeit.github.io/react-phone-number-input/)

[![Screenshot #1](https://raw.githubusercontent.com/halt-hammerzeit/react-phone-number-input/master/docs/images/Screen%20Shot%202016-12-24%20at%2012.37.51.png)](https://www.youtube.com/watch?v=6e1pMrYH5jI)

With custom autocomplete/select:

[![Screenshot #2](https://raw.githubusercontent.com/halt-hammerzeit/react-phone-number-input/master/docs/images/Screen%20Shot%202016-12-24%20at%2012.35.26.png)](https://www.youtube.com/watch?v=vsE5nHBxt2w)

With native `<select/>`:

![Native `<select/>`](https://raw.githubusercontent.com/halt-hammerzeit/react-phone-number-input/master/docs/images/native-select.png)

## Installation

```
npm install react-phone-number-input --save
```

## Usage

```js
import Phone from 'react-phone-number-input'

return (
	<Phone
		placeholder="Enter phone number"
		value={ this.state.phone }
		onChange={ phone => this.setState({ phone }) } />
)
```

The international phone number input utilizes [`libphonenumber-js`](https://github.com/halt-hammerzeit/libphonenumber-js) international phone number parsing and formatting library (used in Google Android phones). The size of the library is about 70 KiloBytes, so it's suitable for public internet usage (for example, the size of `react` package is about 50 KiloBytes).

The countries dropdown with autocomplete is taken from [`react-responsive-ui`](https://halt-hammerzeit.github.io/react-responsive-ui/) library.

I could easily include all country flags in a form of `<svg/>` React elements as part of this library but the overall size of the bundle would then be about 3 MegaBytes (yeah, those SVGs turned out to be really huge) which is too much for a public internet website. Therefore the default behaviour is a compromise: instead of pleloading the flags for all countries in the list only the flag for the currently selected country is shown. This way the user only downloads a single SVG image, and is not forced to download the whole international flag bundle.

## CSS

The CSS files for this React component must be included on a page too.

#### When using Webpack

```js
import rrui from 'react-phone-number-input/rrui.css'
import rpni from 'react-phone-number-input/style.css'
```

And set up a [`postcss-loader`](https://github.com/postcss/postcss-loader) with a [CSS autoprefixer](https://github.com/postcss/autoprefixer) for supporting old web browsers (e.g. `last 2 versions`, `iOS >= 7`, `Android >= 4`).

#### When not using Webpack

Get the `rrui.css` and `style.css` files from this package, process these files with a [CSS autoprefixer](https://github.com/postcss/autoprefixer) for supporting old web browsers (e.g. `last 2 versions`, `iOS >= 7`, `Android >= 4`), and then include them on a page.

```html
<head>
  <link rel="stylesheet" href="/css/react-phone-number-input/rrui.css"/>
  <link rel="stylesheet" href="/css/react-phone-number-input/style.css"/>
</head>
```

## API

### React component

The available props are

 * `value` — the phone number holding variable, will contain the phone number in international plaintext format (e.g. `+12223333333` for USA)

 * `onChange` — the function writing the phone number to the `value` variable

 * `country` — (optional) the default country; if this property changes and the user hasn't entered a phone number yet then this new `country` is selected

 * `countries` — (optional) only these countries will be allowed (e.g. `['RU', 'KZ', 'UA']`)

 * `flagsPath` — (optional) A base URL path for national flag SVG icons. By default it loads flag icons from [`flag-icon-css` github repo](https://github.com/lipis/flag-icon-css). You might want to download those SVG flag icons and host them yourself.

 * `flags` — (optional) Custom national flag icon React elements (a map of country codes, or just `false` for no flags at all)

 * `nativeExpanded` — if set to `true` will render native `<select/>` when country selector is expanded instead of the custom one with autocomplete

For the full list of all possible `props` see the [source code](https://github.com/halt-hammerzeit/react-phone-number-input/blob/master/source/input.js).

### isValidPhoneNumber

[`libphonenumber.isValidNumber`](https://github.com/halt-hammerzeit/libphonenumber-js#isvalidnumbernumber-country_code)

(is exported just for convenience, if anyone needs that for whatever purpose)

### formatPhoneNumber

[`libphonenumber.format`](https://github.com/halt-hammerzeit/libphonenumber-js#formatparsed_number-format)

(is exported just for convenience, if anyone needs that for whatever purpose)

### parsePhoneNumber

[`libphonenumber.parse`](https://github.com/halt-hammerzeit/libphonenumber-js#parsetext-options)

(is exported just for convenience, if anyone needs that for whatever purpose)

## Webpack

If you're using Webpack 1 then make sure that

 * You have `json-loader` set up for `*.json` files in Webpack configuration
 * `json-loader` doesn't `exclude` `/node_modules/`
 * If you override `resolve.extensions` in Webpack configuration then make sure `.json` extension is present in the list

Webpack 2 sets up `json-loader` by default so there's no need for any special configuration.

## Reducing bundle size

By default all countries are included which means that [`libphonenumber-js`](https://github.com/halt-hammerzeit/libphonenumber-js) loads the complete metadata set having the size of 75 KiloBytes. This really isn't much but for those who still want to reduce that to a lesser size there is a special exported `<Input/>` creator which takes custom `metadata` as an argument.

For a "tree-shaking" ES6-capable bundler (e.g. Webpack 2) that would be

```js
import { Input } from 'react-phone-number-input'
import metadata from './metadata.min.json'

export default function Phone(props) {
	return <Input { ...props } metadata={ metadata }/>
}
```

And for [Common.js](https://auth0.com/blog/javascript-module-systems-showdown/) environment that would be

```js
var Input = require('react-phone-number-input/custom')
var metadata = require('./metadata.min.json')

module.exports = function Phone(props) {
	return <Input { ...props } metadata={ metadata }/>
}
```

For generating custom metadata see [the guide in `libphonenumber-js` repo](https://github.com/halt-hammerzeit/libphonenumber-js#customizing-metadata).

## Contributing

After cloning this repo, ensure dependencies are installed by running:

```sh
npm install
```

This module is written in ES6 and uses [Babel](http://babeljs.io/) for ES5
transpilation. Widely consumable JavaScript can be produced by running:

```sh
npm run build
```

Once `npm run build` has run, you may `import` or `require()` directly from
node.

After developing, the full test suite can be evaluated by running:

```sh
npm test
```

When you're ready to test your new functionality on a real project, you can run

```sh
npm pack
```

It will `build`, `test` and then create a `.tgz` archive which you can then install in your project folder

```sh
npm install [module name with version].tar.gz
```

## License

[MIT](LICENSE)