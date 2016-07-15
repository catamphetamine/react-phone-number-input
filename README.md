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
			format={ phoneNumberFormat.RU }
			value={ this.state.phone }
			onChange={ phone => this.setState({ phone }) }
			className={ classnames('phone', {
				'phone--invalid': !isValidPhoneNumber(this.state.phone, phoneNumberFormat.RU)
			}) } />
	</div>
)

// Outputs "(999) 123-45-67" in the <input/> field.
// `this.state.phone` is cleartext: "+79991234567".
```

## API

### default

A React component with the following props

```js
{
	format    : PropTypes.shape
	({
		country : PropTypes.number.isRequired,
		city    : PropTypes.number.isRequired,
		number  : PropTypes.arrayOf(PropTypes.number),
	})
	.isRequired,
	value     : PropTypes.string.isRequired,
	onChange  : PropTypes.func.isRequired,
	className : PropTypes.string,
	style     : PropTypes.object
}
```

### phone_number_format

(aka `phoneNumberFormat`)

A map with phone number format examples

```js
{
	RU:
	{
		country : '7',
		city    : 3,
		number  : [3, 2, 2]
	},
	US:
	{
		country : '1',
		city    : 3,
		number  : [3, 4]
	}
}
```

### is_valid_phone_number(cleartext, format)

(aka `isValidPhoneNumber`)

Returns `true` if `cleartext` phone number is valid given the `format`.

### format_phone_number(cleartext, format)

(aka `formatPhoneNumber`)

Formats `cleartext` phone number given the `format`. The output format is local (without country code).

 * `+79991234567` → `(999) 123-45-67`
 * `9991234567` → `(999) 123-45-67`

### format_phone_number_international(cleartext, format)

(aka `formatPhoneNumberInternational`)

Formats `cleartext` phone number given the `format`. The output format is international (with `+` sign and country code prepended).

 * `+79991234567` → `+7 (999) 123-45-67`
 * `9991234567` → `+7 (999) 123-45-67`

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

While actively developing, one can use (personally I don't use it)

```sh
npm run watch
```

in a terminal. This will watch the file system and run tests automatically 
whenever you save a js file.

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
