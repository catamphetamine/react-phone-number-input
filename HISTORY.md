0.11.3 / 16.05.2017
===================

  * Now alphabetically sorting the supplied custom country names

0.11.2 / 12.05.2017
===================

  * Fixed a bug when `value` was not set to `undefined` when the `<input/>` value was empty
  * Added `selectMaxItems` property for customizing the country select height

0.11.0 / 03.05.2017
===================

  * (CSS breaking change) Removed vertical padding from the first and the last `<Select/>` `<li/>` options and moved it to `.rrui__select__options` `<ul/>` itself. So if someone customized `.rrui__select__options-list-item:first-child` and `.rrui__select__options-list-item:last-child` vertical padding then those padding customizations should be moved to `.rrui__select__options` itself.
  * (CSS breaking change) Added `.rrui__select__option:hover` and `.rrui__select__option--focused:hover` background color for better UX.

0.10.0 / 18.04.2017
===================

  * (might be a breaking change) Slightly refactored the component CSS improving it in a couple of places along with adding comments to it (see `style.css`).
  * Added country code validation.

0.9.1 / 16.04.2017
==================

  * (breaking change) Moved the `.css` file to the root folder of the package and **split it into two files** (the `rrui` one is not required when already using `react-responsive-ui`). `import`ing the CSS file via Webpack is the recommended way to go now.
  * (breaking change) Vendor prefixes dropped in favour of manually using autoprefixers.

0.8.10 / 15.04.2017
===================

  * Added support for externally changing `value` property

0.8.5 / 06.04.2017
==================

  * Added `inputTabIndex` and `selectTabIndex` settings

0.8.5 / 05.04.2017
==================

  * Added `nativeExpanded` setting for native country `<select/>`

0.8.1 / 27.03.2017
==================

  * The `.valid` property has been removed from "as you type" formatter, therefore dropping the `.react-phone-number-input__phone--valid` CSS class. This doesn't affect functionality in any way nor does it break existing code therefore it's a "patch" version upgrade.

0.8.0 / 17.03.2017
==================

  * (could be a breaking change) Moving CSS positioning properties from inline styles to the CSS file therefore if using an edited CSS file from older versions (when not doing it via Webpack `require(...)`) update styles for `.rrui__select` and `.rrui__select__options`. As well as `.rrui__expandable` and `.rrui__shadow` have been added. Maybe (and most likely) something else, so better re-copy the entire CSS file.

0.7.11 / 16.03.2017
===================

  * Fixed a small bug when an initially passed phone number `value` wasn't checked for country autodetection
  * A small enhancement: when an international phone number is erased to a single `+` then the currently selected country is reset. And, analogous, when a country is selected, and the input is empty, and then the user enters a single `+` sign — the country is reset too.

0.7.9 / 12.03.2017
==================

  * Fixed a small bug when the `country` property was set after page load programmatically and that caused the input taking focus (which displayed a keyboard on mobile devices)

0.7.5 / 22.02.2017
==================

  * `@JeandeCampredon` fixed `Const declarations are not supported in strict mode` in module exports

0.7.1 / 28.01.2017
==================

  * Added custom metadata feature (now developers have a way to reduce the resulting bundle size in case they decide they need that)
  * `lockCountry` property removed (use `countries={[country]}` instead)
  * Added `international` boolean property to explicitly indicate whether to show the "International" option in the list of countries
  * Not showing country `<Select/>` when `countries.length === 1` or `countries.length === 0`
  * `countries` property can now only be an array of country codes

0.6.13 / 28.01.2017
===================

  * Fixed the flags bug introduced by adding `flags={ false }` option

0.6.12 / 27.01.2017
===================

  * Added `flags={ false }` option

0.6.11 / 26.01.2017
===================

  * Added `lockCountry` option
  * Added a possibility to specify `countries` as an array of country codes
  * Fixed country selection on `country` property update

0.6.8 / 03.01.2017
===================

  * Optimized performance on mobile devices

0.6.6 / 30.12.2016
===================

  * Added a bunch of CSS classes: `react-phone-number-input`, `react-phone-number-input--valid`, `react-phone-number-input__country`, `react-phone-number-input__phone`, `react-phone-number-input__phone--valid`

0.6.5 / 28.12.2016
===================

  * Now hiding the phone input while the country select is open

0.6.1 / 24.12.2016
===================

  * Fixed collapsed select options being interactive in iOS 8 Safari

0.6.0 / 23.12.2016
===================

  * A complete rewrite. Now supports all countries, all formats are hard-coded from Google Android's `libphonenumber` library.

0.5.4 / 11.12.2016
===================

  * Hong Kong phone numbers fix by @nchan0154

0.5.3 / 15.11.2016
===================

  * Added some popular country formats (and stubs for other countries)
  * Small bug fix for trunk prefixed phone numbers

0.5.0 / 14.11.2016
===================

  * `format` prop is now not required for the React component. If `format` is not specified then the input switches itself into "auto" (iPhone style) mode.
  * input code rewrite

0.4.0 / 15.09.2016
===================

  * (breaking change) `digits` passed to the `template()` function don't include trunk prefix anymore
  * Introduced custom `valid(digits)` phone number validation function for phone number format

0.3.0 / 07.09.2016
===================

  * `format_phone_number` (aka `formatPhoneNumber`) function now formats phone number internationally (with country code) if no `format` argument was supplied (it tries to autodetect the correct phone number format from the phone number itself)

  * Added `country(phone)` function

  * Added `country_from_locale(locale)` (aka `countryFromLocale(locale)`) function

0.2.11 / 06.09.2016
===================

  * Added `parse_phone_number` (aka `parsePhoneNumber`) function

0.2.10 / 04.09.2016
===================

  * Added `plaintext_local` (aka `plaintextLocal`) and `plaintext_international` (aka `plaintextInternational`) methods

0.2.0 / 03.09.2016
==================

  * Added custom phone formats
  * Refactoring
  * Removed `format_phone_number_international` (aka `formatPhoneNumberInternational`)

0.1.20 / 19.08.2016
===================

  * Added `disabled` property

0.1.18 / 11.08.2016
===================

  * Added `name` property (for javascriptless websites)

0.1.0 / 15.07.2016
===================

  * Initial release