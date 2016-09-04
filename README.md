# react-phone-number-input

[![NPM Version][npm-badge]][npm]
[![Build Status][travis-badge]][travis]
[![Test Coverage][coveralls-badge]][coveralls]

International phone number `<input/>` in React

![screenshot of react-phone-number-input](https://raw.githubusercontent.com/halt-hammerzeit/react-phone-number-input/master/docs/images/screenshot.png)

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
			template : PropTypes.func.isRequired
		})
	])
	.isRequired,
	value     : PropTypes.string.isRequired,
	onChange  : PropTypes.func.isRequired
}
```

All other `props` are passed directly to the underlying `<input/>` component (and so it can be used with things like [`redux-form`](https://github.com/erikras/redux-form)).

### phone_number_format

(aka `phoneNumberFormat`)

A map with phone number format examples

```js
{
	// +7 | (123) 456-78-90
	RU:
	{
		country  : '7',
		template : '(xxx) xxx-xx-xx'
	},

	// +1 | (123) 456-7890
	US:
	{
		country  : '1',
		template : '(xxx) xxx-xxxx'
	},

	// Supports any custom phone number format logic
	custom:
	{
		// Generates a proper phone number template for the given input digits,
		// where each digit is designated with an "x" symbol.
		//
		// E.g.: "71234567890" -> "+x (xxx) xxx-xx-xx"
		//
		template(digits)
		{
			// Template for "+7 (123) 456-78-90" is:
			return "+x (xxx) xxx-xx-xx"

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

Returns `true` if `plaintext` phone number is valid given the `format`.

### format_phone_number(plaintext, format)

(aka `formatPhoneNumber`)

Formats `plaintext` phone number given the `format`. The output format is local (without country code).

 * `+79991234567` → `(999) 123-45-67`
 * `9991234567` → `(999) 123-45-67`

### plaintext_local(plaintext, format)

(aka `plaintextLocal`)

Trims a `plaintext` phone number given the `format`. The output format is local (without country code).

 * `+79991234567` → `9991234567`
 * `9991234567` → `9991234567`

### plaintext_international(plaintext, format)

(aka plaintextInternational`)

Trims a `plaintext` phone number given the `format`. The output format is international (with country code).

 * `+79991234567` → `+79991234567`
 * `9991234567` → `+79991234567`

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
