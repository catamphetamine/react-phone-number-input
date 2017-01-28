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