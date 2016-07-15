# react-phone-number-input

[![NPM Version][npm-badge]][npm]
[![Build Status][travis-badge]][travis]
[![Test Coverage][coveralls-badge]][coveralls]

International phone number `<input/>` in React

## Installation

```
npm install react-phone-number-input --save
```

## Usage

```js
import Phone, { format, isValid } from 'react-phone-number-input'

...

state = { phone: '+79991234567' }

...

return (
	<div>
		+7
		<Phone
			format={ format.RU }
			value={ this.state.phone }
			onChange={ phone => this.setState({ phone }) }
			className={ classnames('phone', {
				'phone--invalid': !isValid(this.state.phone, format.RU)
			}) } />
	</div>
)

// Outputs "(999) 123-45-67" in the <input/> field.
// `this.state.phone` is cleartext: "+79991234567".
```

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
