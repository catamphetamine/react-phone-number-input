# react-phone-number-input

[![NPM Version][npm-badge]][npm]
[![Build Status][travis-badge]][travis]
[![Test Coverage][coveralls-badge]][coveralls]

International phone number `<input/>` in React

[See Live Demo](http://halt-hammerzeit.github.io/react-phone-number-input/)

[![screenshot of react-phone-number-input](https://raw.githubusercontent.com/halt-hammerzeit/react-phone-number-input/master/docs/images/screenshot.png)](https://www.youtube.com/watch?v=6e1pMrYH5jI)

## Installation

```
npm install react-phone-number-input --save
```

## Usage

```js
import Phone, { phoneNumberFormat, isValidPhoneNumber } from 'react-phone-number-input'

...

state = { phone: '+79991234567' }

...

return (
	<div>
		+7
		<Phone
			placeholder="Enter phone number"
			format={ phoneNumberFormat.RU }
			value={ this.state.phone }
			onChange={ phone => this.setState({ phone }) }
			className={ classnames('phone', {
				'phone--invalid': !isValidPhoneNumber(this.state.phone, phoneNumberFormat.RU)
			}) } />
	</div>
)

// Outputs "(999) 123-45-67" in the <input/> field.
// `this.state.phone` is plaintext: "+79991234567".
```

## API

### default

A React component with the following `props`

```js
{
	format : PropTypes.oneOfType
	([
		PropTypes.shape
		({
			country  : PropTypes.string.isRequired,
			template : PropTypes.string.isRequired
		}),
		PropTypes.shape
		({
			country  : PropTypes.string.isRequired,
			template : PropTypes.func.isRequired
		})
	])
	.isRequired,
	value     : PropTypes.string,
	onChange  : PropTypes.func.isRequired
}
```

All other `props` are passed directly to the underlying `<input/>` component (and so it can be used with things like [`redux-form`](https://github.com/erikras/redux-form)).

### phone_number_format

(aka `phoneNumberFormat`)

A map with predefined phone number formats. The keys are [ISO 3166-1](https://en.wikipedia.org/wiki/Country_code) country codes. Create Pull Requests with phone number formats for your country if it's missing from the list.

```js
{
	// (123) 456-78-90
	RU:
	{
		country  : '7',
		template : '(xxx) xxx-xx-xx'
	},

	// (123) 456-7890
	US:
	{
		country  : '1',
		template : '(xxx) xxx-xxxx'
	},

	// Supports any custom phone number format logic
	[custom phone number format]:
	{
		country : '7',

		// Generates a proper phone number template
		// for the given plaintext local phone number,
		// where each digit is designated with a letter
		// or a number. Numbers are not taken into account
		// when formatting an international phone number,
		// but are taken into account when formatting
		// a local phone number, and therefore can be used
		// for trunk prefix.
		//
		// E.g.: "1234567890"  -> "(AAA) BBB-BBBB" // USA, trunk prefix not used
		//       "07700900756" -> "(0AAAA) BBBBBB" // United Kingdom, trunk prefix "0"
		//
		template(plaintext_local)
		{
			return "(AAA) BBB-BBBB"

			// More complex logic can be implemented here
			// for countries with non-trivial phone number formatting rules.
			// (E.g. German telephone numbers have no fixed length
			//  for area code and subscriber number.
			//  https://en.wikipedia.org/wiki/Telephone_numbers_in_Germany)
		}
	}
}
```

### is_valid_phone_number(plaintext, format)

(aka `isValidPhoneNumber`)

Returns `true` if an international `plaintext` phone number is valid given the `format`. If the `format` is not specified then it tries to autodetect the appropriate one.

### format_phone_number(plaintext, format)

(aka `formatPhoneNumber`)

Formats a `plaintext` phone number (either local or international). If the `format` argument is passed then the resulting phone number is local. Otherwise it will try to autodetect the appropriate phone number format for this phone number, and if autodetection succeeded it will output a formatted international phone number.

 * `(+79991234567, format.RU)` → `(999) 123-45-67`
 * `(+19991234567, format.US)` → `(999) 123-4567`
 * `(+79991234567)` → `+7 999 123 45 67`
 * `(+447700954321)` → `+44 7700 954 321`

### parse_phone_number(whatever, format)

(aka `parsePhoneNumber`)

Parses `whatever` phone number given the `format`. The output number is plaintext international.

 * `(999) 123-45-67`    → `+79991234567`
 * `+7 (999) 123-45-67` → `+79991234567`

### country_from_locale(locale)

(aka `countryFromLocale`)

Extracts [ISO 3166-1](https://en.wikipedia.org/wiki/Country_code) country code from a locale.

 * `ru-RU`      → `"RU"` (Russia)
 * `en`         → `undefined`
 * `zh-Hans-HK` → `"HK"` (Hong Kong)

### country(plaintext_international)

Extracts [ISO 3166-1](https://en.wikipedia.org/wiki/Country_code) country code from an international plaintext phone number.

 * `+79991234567`  → `RU` (Russia)
 * `+19991234567`  → `US` (USA)
 * `+861069445464` → `CN` (China)

### plaintext_local(plaintext, format)

(aka `plaintextLocal`)

Converts `plaintext` (international or local) phone number to a plaintext local one given the `format`.

 * `+79991234567`  → `9991234567`  // Russia
 * `9991234567`    → `9991234567`  // Russia
 * `+447700900756` → `07700900756` // UK

### plaintext_international(plaintext, format)

(aka `plaintextInternational`)

Converts `plaintext` (international or local) phone number to a plaintext international one given the `format`.

 * `+79991234567` → `+79991234567`  // Russia
 * `9991234567`   → `+79991234567`  // Russia
 * `07700900756`  → `+447700900756` // UK

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
