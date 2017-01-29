# react-phone-number-input

[![NPM Version][npm-badge]][npm]
[![Build Status][travis-badge]][travis]
<!-- [![Test Coverage][coveralls-badge]][coveralls] -->

International phone number `<input/>` (and output) (in React) (iPhone style)

[See Demo](http://halt-hammerzeit.github.io/react-phone-number-input/)

[![Screenshot #1](https://raw.githubusercontent.com/halt-hammerzeit/react-phone-number-input/master/docs/images/Screen Shot 2016-12-24 at 12.37.51.png)](https://www.youtube.com/watch?v=6e1pMrYH5jI)

[![Screenshot #2](https://raw.githubusercontent.com/halt-hammerzeit/react-phone-number-input/master/docs/images/Screen Shot 2016-12-24 at 12.35.26.png)](https://www.youtube.com/watch?v=vsE5nHBxt2w)

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

This component is styled using CSS. Copy [`styles/style.css`](https://github.com/halt-hammerzeit/react-phone-number-input/blob/master/styles/style.css) to your project folder and include it on a page:

```html
<head>
  <link rel="stylesheet" href="/css/react-phone-number-input.css"/>
</head>
```

This CSS file is meant as a base one and a developer should override the CSS rules defined in it (this can be done in a separate file) to better suit the project's needs.

An alternative way of including the base CSS file when using Webpack would be:

```js
require('react-phone-number-input/styles/style.css')
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
[npm]: https://www.npmjs.org/package/react-phone-number-input
[npm-badge]: https://img.shields.io/npm/v/react-phone-number-input.svg?style=flat-square
[travis]: https://travis-ci.org/halt-hammerzeit/react-phone-number-input
[travis-badge]: https://img.shields.io/travis/halt-hammerzeit/react-phone-number-input/master.svg?style=flat-square
[coveralls]: https://coveralls.io/r/halt-hammerzeit/react-phone-number-input?branch=master
[coveralls-badge]: https://img.shields.io/coveralls/halt-hammerzeit/react-phone-number-input/master.svg?style=flat-square
