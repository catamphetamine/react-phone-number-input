# react-phone-number-input

[![NPM Version][npm-badge]][npm]
[![Build Status][travis-badge]][travis]
[![Test Coverage][coveralls-badge]][coveralls]

International phone number `<input/>` (and output) (in React) (iPhone style)

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

## Definitions

### Telephone numbering plan

[Telephone numbering plan](https://en.wikipedia.org/wiki/Telephone_numbering_plan) is basically a scheme of assigning telephone numbers to subscribers. For example, a country has a 20 million population, which means to accomodate `20'000'000`+ subscribers the telephone numbers must have at least 8 digits.

Now, imagine that you're living in the XXth century with all those [rotary dial](https://en.wikipedia.org/wiki/Rotary_dial) phones around: dialing eight digits on a rotary dial can quickly get frustrating, for millions of people, every day. Could you perhaps make their lives a little easier by requiring them to rotary-dial, say, only 5 digits instead of all 8?

### Area codes

Everybody already knows the answer: yes, if they're dialing mostly on local numbers (say, within the same town, or city district). This "locality" unit is gonna be called an "area": e.g. a town is an "area", a city district is an "area". So the country is divided into such areas: some smaller, some larger. All phone numbers within the same area are mandatorily given the same prefix (called an "area code"), so when dialing within the same "area" this fixed prefix (the "area code") is simply omitted and as a result all phone numbers are magically reduced in length.

Larger areas, having, say, about `300'000` of population (a city called Arlington), will have a two-digit "area code" (e.g. `12`) and the local phone number will have the remaining 6 digits (e.g. `345678`), with the resulting phone number will be written, say, as `(12) 34-56-78`. Smaller areas, having, say, about `5'000` of population (a small town called Hawkins), will have a four-digit "area code" (e.g. `1234`) and the local phone number will have the remaining 4 digits (e.g. `5678`), with the resulting phone number will be written, say, as `(1234) 56-78`.

Now, when dialing within Hawkins, people would just dial like `48-75` or `91-11` and therefore would be less frustrated by the rotary-dialing process. And when sharing their phone numbers with each other they won't have to find a pencil and a piece of paper (not always accessible, to say the least), and instead they would just say like: "Hey! Call me: 12-56", and that's it. Much more convenient.

Now what about dialing from within Hawkins, say, to Arlington?

### Trunk prefix

Here's when [trunk prefix](https://en.wikipedia.org/wiki/Trunk_prefix) comes into play. A trunk prefix is a reserved digit which can't be used as the first digit of any phone number. For example, a `0`: no phone number is allowed to start with a zero. This `0` trunk prefix is then prepended to a phone number when dialing outside an "area". In the example above that would be dialing from Hawkins to Arlington: given an Arlington phone number `(12) 34-56-78` a Hawkins resident would dial `012345678`. When confronted with a leading `0` the telephone system would switch the circuit to point outside the local area, to the country-level phone circuit. And that's how inter-area phone calls are made (using trunk prefix).

### Plaintext local

Plaintext local phone number is a phone number consisting of a trunk prefix (if specified), an area code, and the rest part of the phone number. "Local" here means "same country" ("nation-wide"), not "same area".

Should trunk prefix be a part of a written nation-wide phone number? The opinions on this are different in different countries. For example, in the USA trunk prefix `1` is considered [obsolete](https://en.wikipedia.org/wiki/National_conventions_for_writing_telephone_numbers#United_States.2C_Canada.2C_and_other_NANP_countries) and old-fashioned (that's what they told me when I asked), and they don't write trunk prefix when writing a phone number: instead of `1 (999) 123-4567` they simply write `(999) 123-4567` (which I agree with). In the UK, though, the historical convention is to write trunk prefix as part of a written phone number, so they write it like `07700 954321` where `0` is the trunk prefix and `7700` is an area code for mobile phones.

So, talking about "plaintext local" phone number, a USA-based phone number `(999) 123-4567` is written in plaintext local as `9991234567`, and plaintext local for a UK-based phone number `07700 954321` is `07700954321`.

So, basically, "plaintext local" is just a formatted local phone number stripped from everything except digits.

### Plaintext international

Plaintext international phone number is a phone number consisting of a `+` sign, a country code, an area code, and the rest part of the phone number. [Trunk prefix](https://en.wikipedia.org/wiki/Trunk_prefix) is never present in plaintext international because it's for local ("same country", "nation-wide") dialing only.

E.g. a USA-based phone number `(999) 123-4567` is written in plaintext international as `+19991234567`. And a UK-based phone number `07700 954321` is written in plaintext international as `+447700954321` (notice how trunk prefix `0` is dropped).

Basically, plaintext international is a `+` sign, plus a country code, plus a plaintext local phone number without trunk prefix.

## API

### default

The `default` export is a React component with the following `props`

```js
{
	// Phone number format description.
	// Either a basic one (with `template` being a string),
	// or a more complex one (with `template` being a function).
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

	// Phone number value.
	// Is a plaintext international phone number
	// (e.g. "+12223333333" for USA)
	value : PropTypes.string,

	// This handler is called each time
	// the phone number input changes its value.
	onChange : PropTypes.func.isRequired
}
```

All other `props` are passed directly to the underlying `<input/>` component (and so it works with things like [`redux-form`](https://github.com/erikras/redux-form)).

### phoneNumberFormat

(aka `phone_number_format`)

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
		// for the given phone number `digits`.
		//
		// `digits` are plaintext local phone number
		// digits without trunk prefix.
		// https://en.wikipedia.org/wiki/Trunk_prefix
		//
		// E.g. a plaintext international US phone number
		// '(222) 333-3333' will have `digits = 2223333333`,
		// and a UK phone number '07700 900756'
		// will have `digits = 7700900756`.
		//
		// Each significant digit in a template
		// is designated with a letter.
		// Trunk prefix is designated with a digit
		// (or several digits).
		//
		// E.g.: "1234567890" -> "(AAA) BBB-BBBB" // USA, trunk prefix not used
		//       "7700900756" -> "(0AAAA) BBBBBB" // United Kingdom, trunk prefix "0"
		//
		template(digits)
		{
			return "(AAA) BBB-BBBB"

			// More complex logic can be implemented here
			// for countries with non-trivial phone number formatting rules.
			// (E.g. German telephone numbers have no fixed length
			//  for area code and subscriber number.
			//  https://en.wikipedia.org/wiki/Telephone_numbers_in_Germany)
		}

		// (optional)
		//
		// Custom phone number digits validation.
		//
		// `digits` are the same as for the
		// `template(digits)` function described above.
		//
		valid(digits)
		{
			// An example for Puerto Rican phone numbers
			// which must start with either `787` or `939`.
			return digits.length === 10 && 
				(digits.indexOf('787' === 0) || digits.indexOf('939' === 0))
		}
	}
}
```

### isValidPhoneNumber(plaintext, format)

(aka `is_valid_phone_number`)

Returns `true` if an international `plaintext` phone number is valid given the `format`. If the `format` is not specified then it tries to autodetect the appropriate one.

### formatPhoneNumber(plaintext, format)

(aka `format_phone_number`)

Formats a `plaintext` phone number (either local or international). If the `format` argument is passed then the resulting phone number is local. Otherwise it will try to autodetect the appropriate phone number format for this phone number, and if autodetection succeeded it will output a formatted international phone number.

 * `(+79991234567, format.RU)` → `(999) 123-45-67`
 * `(9991234567, format.RU)` → `(999) 123-45-67`
 * `(+19991234567, format.US)` → `(999) 123-4567`
 * `(9991234567, format.US)` → `(999) 123-4567`
 * `(+79991234567)` → `+7 999 123 45 67`
 * `(+447700954321)` → `+44 7700 954 321`

### parsePhoneNumber(whatever, format)

(aka `parse_phone_number`)

Parses `whatever` phone number given the `format`. The output number is plaintext international.

 * `(999) 123-45-67`    → `+79991234567`
 * `+7 (999) 123-45-67` → `+79991234567`

### countryFromLocale(locale)

(aka `country_from_locale`)

Extracts [ISO 3166-1](https://en.wikipedia.org/wiki/Country_code) country code from a locale.

 * `ru-RU`      → `"RU"` (Russia)
 * `en`         → `undefined`
 * `zh-Hans-HK` → `"HK"` (Hong Kong)

### country(plaintext_international)

Extracts [ISO 3166-1](https://en.wikipedia.org/wiki/Country_code) country code from an international plaintext phone number.

 * `+79991234567`  → `RU` (Russia)
 * `+19991234567`  → `US` (USA)
 * `+861069445464` → `CN` (China)

### plaintextLocal(plaintext, format)

(aka `plaintext_local`)

Converts `plaintext` (international or local) phone number to a plaintext local one given the `format`.

 * `+79991234567`  → `9991234567`  // Russia
 * `9991234567`    → `9991234567`  // Russia
 * `+447700900756` → `07700900756` // UK

### plaintextInternational(plaintext, format)

(aka `plaintext_international`)

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
