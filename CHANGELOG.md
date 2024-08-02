<!-- Maybe change the link to the flags to this repo's `unpkg.com` or something like that.  -->

<!-- Maybe change empty value from `undefined` to `null`. -->

3.4.5 / 02.08.2024
==================

* Added a validation console error message when an incorrect `value` is supplied: when supplied, `value` must be in `E.164` format (no punctuation).

* Fixed the demo page having an old copy of `libphonenumber-js`.

3.4.0 / 22.04.2024
==================

* In response to a recently reported [issue](https://gitlab.com/catamphetamine/react-phone-number-input/-/issues/228), changed the behavior of the "With Country Select" input in cases when the calling code corresponds to multiple possible countries (for example, `+1` calling code corresponds to both `US` and `CA`): now it will prefer showing the country flag that was selected manually by the user, or the default country flag.

3.2.0 / 21.05.2022
==================

* Migrated to "ES Module" exports.

3.1.50 / 11.04.2022
==================

* [Fixed](https://github.com/catamphetamine/react-phone-number-input/issues/405) erasing `react-hook-form` component's value.

3.1.37 / 03.11.2021
==================

* [Fixed](https://gitlab.com/catamphetamine/react-phone-number-input/-/issues/91) TypeScript "typings".

3.1.36 / 02.11.2021
==================

* [Fixed](https://gitlab.com/catamphetamine/react-phone-number-input/-/issues/93) formatting incomplete phone numbers having less than 3 leading digits.

3.1.32 / 07.10.2021
==================

* Added TypeScript "typings".

* The `/core` "with country select" component now doesn't require a `countrySelectComponent` property because it now has a default value.

3.1.31 / 03.10.2021
==================

* Added `inputComponent` property on a React Native "without country select" component.

3.1.28 / 08.09.2021
==================

* Fixed a [small bug](https://gitlab.com/catamphetamine/react-phone-number-input/-/issues/82) in a "without country select" input: when setting a `country` that doesn't correspond to the current `value` property it now changes the `value` property accordingly.

3.1.23 / 27.05.2021
==================

* [Fixed](https://github.com/catamphetamine/react-phone-number-input/issues/296#issuecomment-849248267) React Native `{...rest}` props passthrough.

3.1.20 / 26.04.2021
==================

* [Fixed](https://gitlab.com/catamphetamine/react-phone-number-input/-/issues/38) `addInternationalOption={false}` React warning.

3.1.19 / 13.04.2021
==================

* Added [`react-hook-form@7` support](https://gitlab.com/catamphetamine/react-phone-number-input/-/issues/57).

3.1.18 / 23.03.2021
==================

* Fixed a [minor small bug](https://github.com/catamphetamine/react-phone-number-input/issues/378) when `defaultCountry` is selected as the country even when the initial `value` couldn't possibly belong to that country.

3.1.10 / 18.01.2021
==================

* Added `react-hook-form` components.

3.1.9 / 07.01.2021
==================

* [Fixed](https://github.com/catamphetamine/react-phone-number-input/issues/377) determining the `country` for a very incomplete `value` when `value` is set externally.

3.1.8 / 09.12.2020
==================

* [Fixed](https://gitlab.com/catamphetamine/react-phone-number-input/-/issues/43) entering phone number digits in "force international" mode when the prefix is selected.

3.1.6 / 16.11.2020
==================

* Fixed "International" option not being added.

* Added `"🌐"` ("International") option to `countryOptionsOrder`.

3.1.5 / 08.11.2020
==================

* [Fixed](https://github.com/catamphetamine/react-phone-number-input/issues/367) the ability to erase country calling code when `countryCallingCodeEditable={false}`.

3.1.2 / 26.10.2020
==================

* `displayInitialValueAsLocalNumber={true}` property is deprecated: it has been replaced with `initialValueFormat="national"` property. The old property still works in version `3.x`.

* [Added](https://github.com/catamphetamine/react-phone-number-input/issues/367) `countryCallingCodeEditable={false}` property on a "with country select" component: when `international` is `true`, then, by default, the "country calling code" part of a phone number is editable. Passing `countryCallingCodeEditable={false}` property makes it non-editable.

3.1.1 / 24.10.2020
==================

* [Added](https://gitlab.com/catamphetamine/react-phone-number-input/-/issues/35) `focusInputOnCountrySelection: boolean` property. If set to `false`, will not focus the `<input/>` component when the user selects a country from the list of countries. This can be used to conform to the Web Content Accessibility Guidelines (WCAG). Quote: "On input: Changing the setting of any user interface component does not automatically cause a change of context unless the user has been advised of the behaviour before using the component".

* [Added](https://gitlab.com/catamphetamine/react-phone-number-input/-/issues/36) `international: false` property that doesn't allow international phone number format during input. Some hypothetical people could hypothetically already be passing something like `international={condition ? true : false}` in their apps, meaning that this new version's behavior regarding `international={false}` could potentially come as a surprise for them, but that would be an indefinitely small minority, and it wouldn't strictly speaking break their apps because users would still be able to input their phone number.

3.1.0 / 23.09.2020
==================

* Added `withCountryCallingCode` property on the `/input` component: when `country` is set and `international` is `true` and `withCountryCallingCode` is `true` then the "country calling code" part of the phone number will be included in the `<input/>` field.

* Added an _experimental_ React Native exported component (see the README).

* "With country select" component in "force international mode" now [appends "leading digits"](https://gitlab.com/catamphetamine/react-phone-number-input/-/issues/10) for some countries when pre-populating the initial phone number prefix.

3.0.27 / 22.09.2020
===================

* Fixed a bug when resetting `defaultCountry` property of a "with country select" component produced an error.


3.0.14 / 22.01.2020
===================

* Removed `--PhoneInputCountryFlag-width` CSS variable.

* Added `--PhoneInputCountryFlag-aspectRatio` CSS variable.

3.0.0 / 01.01.2020
===================

Relevant changes:

* The component uses hooks now, so `react >= 16.8` is required.

* `ref` is now forwarded to the `<input/>`.

* [`style.css`](https://gitlab.com/catamphetamine/react-phone-number-input/blob/master/style.css) now uses [native CSS variables](https://medium.freecodecamp.org/learn-css-variables-in-5-minutes-80cf63b4025d). Native CSS variables work in all modern browsers, but older ones like Internet Explorer [won't support them](https://caniuse.com/#search=var). For compatibility with such older browsers one can use a CSS transformer like [PostCSS](http://postcss.org/) with a "CSS custom properties" plugin like [`postcss-custom-properties`](https://github.com/postcss/postcss-custom-properties).

* Renamed CSS classes, and refactored styles.

* Changed the flags: now they're simpler, smaller in disk size, and have `3x2` aspect ratio instead of `4x3`.

* Renamed CDN `bundle` files:

1. `react-phone-number-input-native` -> `react-phone-number-input`.
2. `react-phone-number-input-native-max` -> `react-phone-number-input-max`.
3. `react-phone-number-input-native-mobile` -> `react-phone-number-input-mobile`.
4. `react-phone-number-input-no-country-select` -> `react-phone-number-input-input`.
5. Removed `-react-responsive-ui` and `-smart-input` versions from CDN `bundle`.

* CDN `bundle` exported global variable is now called `window.PhoneInput.default` (used to be called `window['react-phone-number-input']`), and utility functions are accessible via `window.PhoneInput` variable.

* Removed `locale/default.json` (use `en.json` instead) and `locale/br.json` (use `pt.json` instead).

* Flags are now loaded from [`country-flag-icons`](https://gitlab.com/catamphetamine/country-flag-icons) library.

* Removed properties:

1. `error`
2. `disablePhoneInput`
3. `inputClassName` (use `numberInputProps` instead)
4. `countrySelectTabIndex` and `countrySelectAriaLabel` (use `countrySelectProps` instead)
5. `showCountrySelect` (use `/input` subpackage instead to render a component without country select).
6. `ext` (this component now doesn't deal with phone number extensions at all).

* Removed the former `inputComponent` property, and renamed `numberInputComponent` property to `inputComponent`.

* Renamed properties:

1. `international` -> `addInternationalOption`
2. `countryOptions` -> `countryOptionsOrder`
3. `country` -> `defaultCountry`

* Renamed `flagsPath` property to `flagUrl`, and it's now a full URL template having `{XX}` in place of a country code in upper case or `{xx}` in place of a country code in lower case.

Other changes (miscellaneous):

* Replaced `webpack` with `rollup` when generating CDN bundles.

* Removed `/libphonenumber`, `/native`, `/custom`, `/native-custom`, `/react-responsive-ui`,  `/react-responsive-ui/custom`, `/basic-input`, `/basic-input-custom`, `/international-icon` exports.

* Removed `parseRFC3966()` and `formatRFC3966()` exported functions.

* Country select doesn't receive `icon` property as part of `options` now. Instead, it receives `iconComponent` property, where `iconComponent` receives a `country` property (for example, `"US"`).

* Removed `redux-form` `onBlur` workaround. `redux-form` is deprecated.

* `internationalIcon` is now 4x3, like the rest of the flags (used to be square).

* Flags have been copied from `flag-icon-css` repo's github pages to this repo's github pages.

* Added `unicodeFlags` property of country select (the demo page has a showcase).

2.5.2 / 31.12.2019
===================

  * Added `inputStyleReset: boolean` property that can be set to `true` to prevent the library from applying decoration styles to the `<input/>`.

2.5.0 / 09.11.2019
===================

  * Temporarily reverted back to "smart input" instead of the "basic input" (with the `smartCaret` property now being `true` by default). The reason is that I've added a [potential workaround](https://github.com/catamphetamine/input-format/issues/2#issuecomment-552032606) for Android devices to `input-format` library ("smart caret" implementation). We'll see if anyone reports anything. There have been some minor complaints about "basic caret" not being "smart" enough by always jumping to the end of the input field.

  * Added `isPossiblePhoneNumber(string): boolean` exported function: it checks if the phone number is "possible". Only checks the phone number length, doesn't check the number digits against any regular expressions like `isValidPhoneNumber()` does.

  * Added `getCountries(): string[]` exported function (returns an array of all possible country codes).

  * Added `international={true}` property to "without country select" input. If `country` property is passed along with `international={true}` property then the phone input will be input in "international" format for that `country` (without "country calling code"). For example, if `country="US"` property is passed to "without country select" input then the phone number will be input in the "national" format for `US` (`(213) 373-4253`). But if both `country="US"` and `international={true}` properties are passed then the phone number will be input in the "international" format for `US` (`213 373 4253`) (without "country calling code" `+1`). This

  * Added `defaultCountry: string` and `useNationalFormatForDefaultCountryValue: boolean` properties to "without country select" input.

  * Added `smartCaret` property to "without country select" input. It's the same one as the `smartCaret` property of the default ("with country select") phone number input. That also means that "without country select" input now defaults to "smart caret" mode rather than "basic caret" mode.

  * Added `countryCallingCode` property to "without country select" input. When `country` property is passed along with `international={true}` property then by default the phone number will be input in the "international" format for `US` (`+1 213 373 4253`). However, if `countryCallingCode={false}` property is passed then the country calling code part (`+1`) will be omitted, and the phone number will be input in the "international" format for `US` without "country calling code" (`213 373 4253`).

  * Removed `redux-form` onBlur bug workaround from the recently introduced "without country select" component. If there're any `redux-form` bugs then the new versions of this library won't be fixing them. `redux-form` has been deprecated for a long time.

  * Added [`reset: any`](https://github.com/catamphetamine/react-phone-number-input/issues/300) property that resets `value` and `country` whenever it's changed. It's not implemented as some instance `.reset()` method because `ref` will likely be forwarded to `<input/>`.

2.4.0 / 17.10.2019
===================

  * The previous "patch" version bump that added `numberInputComponent` property should actually have been a "feature" version bump, so bumping "feature" version now.

  * The country is now reset in cases when a user erases a phone number that has been input in international format. This fixes the cases when a user tries to input their local phone number when no country has been selected and ends up with an international phone number and a randomly selected country. Then such user erases the `<input/>` contents and tries inputting their local phone number again (now with the random country being selected) — this results in a seemingly-correct phone number but the reality is that the country of the phone number is completely unrelated (random). The change in this release fixes that: when a user erases all digits of an international number the random-selected country is reset.

  * Added `numberInputProps` and `countrySelectProps`. If a custom `inputComponent` property has been specified then this new `numberInputProps` property might result in an `"Unknown prop "inputProps" on <input> tag"` React warning because this new `numberInputProps` property is most likely passed as `{...rest}` to the underlying `<input/>`. But such warning isn't considered a "breaking change", and it's unlikely that anyone actually passed their own `inputComponent` due to the complexity.

  * Added an `/input` subpackage that exports the "Without country select" phone number input component. The previously proposed `/basic-input` subpackage is now deprecated.

  * Added `prevInput` argument to `parseInput()` function of `input-control.js`. It's unlikely that anyone used it directly as `import { parseInput } from 'react-phone-number-input/commonjs/input-control'`. But if anyone did then such code would break because the function's arguments changed.

  * (misc) Removed the unintuitive "magic" phone number digits conversion logic when a phone number in international format has been input and then the user decides to select another country: previously it replaced the "country calling code" of the previous country with the "country calling code" of the new country keeping the international format of the phone number. It has been noticed that selecting a country manually having an international phone number already typed in most likely corresponds to the cases when the user tried typing in a local phone number with no country selected resulting in an international number being input and a random country being selected. Then such user decides to select the correct country manually and expects his input to be corrected back to "local" format. See the [original issue](https://github.com/catamphetamine/react-phone-number-input/issues/273).

2.3.25 / 16.10.2019
===================

  * Added `numberInputComponent` property which is supposed to replace `inputComponent` property for the end users: it turned out that passing custom `inputComponent` required also implementing (copy-pasting) phone number parsing and formatting logic. The new `numberInputComponent` customization property is different in this aspect: it's a customization property of `inputComponent` itself. By default `numberInputComponent` is `"input"` meaning that `inputComponent` renders a standard DOM `<input/>` by default. By passing a custom `numberInputComponent` this standard DOM `<input/>` can be replaced by such custom number input component (for example, when using UI libraries like "Material UI" or "Bootstrap"). The former `inputComponent` property still works, it's just now an undocumented one (too complex for the end users to implement). And it now also receives a new `inputComponent` property that is basically the new `numberInputComponent` property, just with a shorter name — this new property might result in an `"Unknown prop "inputComponent" on <input> tag"` React warning, but that's only in the cases when a custom `inputComponent` was passed earlier which is unlikely (it's unlikely that anyone actually passed their own `inputComponent`).

2.3.24 / 30.09.2019
===================

  * Added `countrySelectAriaLabel: string` property.

  * Added `getCountryCallingCode(country: string): string` exported function.

2.3.19 / 07.07.2019
===================

  * Added an exported `parsePhoneNumber(value)` function because some people [requested](https://github.com/catamphetamine/react-phone-number-input/issues/268) a function to get `country` from `value`.

  * Added `parseRFC3966()` and `formatRFC3966()` exports (phone number extensions).

2.3.18 / 21.06.2019
===================

  * Changed the "International" flag icon.

  * [Fixed](https://github.com/catamphetamine/react-phone-number-input/issues/258) `react-phone-number-input/flags` import.

2.3.8 / 15.03.2019
==================

  * Recently I removed some of the countries from the list of selectable countries because they weren't supported by Google's `libphonenumber`: previously I didn't check if all the selectable countries were supported (for some reason) so the list of countries contained some countries which weren't supported by `libphonenumber` which in turn would result in incorrect phone number parsing/formatting (countries like Abkhazia and South Osetia, for example).

  * I also added Kosovo to the list. It's not a country but a "territory" instead. I imagine people from Kosovo might be looking for "Kosovo" in the list and they'd be confused if it was missing. Google supports `XK` territory code and the flag for `XK` has been recently added to the flags repo. Anyone using custom `flagsPath` should update their flag bundles accordingly.

  * Also added `TA` and `AC` countries to the list but they're using `SH` flag for now, so no need to update flags for them yet. If the author of the flags repo adds the flags for `TA` and `AC` then the flags will have to be updated. See the [issue](https://github.com/lipis/flag-icon-css/issues/537) in the flags repo for more info.

  * Also note that when supplying custom `flagsPath` those custom-hosted flags might go out of sync with the list of countries. For example, there could be people hosting their own copy of flags, and then `XK` flag is added to the flags repo and I add "Kosovo" territory to the list and now `XK` flag is missing from all custom-hosted flag bundles and if those people update this library to the latest version without updating their custom-hosted flag bundled they'd get an "Image not found" error when selecting "Kosovo" territory from the list.

2.3.0 / 02.01.2019
==================

  * Migrated `input-control.js` to the latest `libphonenumber-js` API.

  * Added `/min`, `/max`, `/mobile` and `/custom` subpackages pre-wired with different flavors of metadata. See the relevant readme section for more info.

  <!-- * Removed `*DefaultMetadata.js` files. -->

  * Deprecated importing from `react-phone-number-input/libphonenumber` sub-package (a workaround for ES6/CommonJS double import issue) because the ES6/CommonJS double import issue has been resolved.

2.2.9 / 30.09.2018
==================

  * Added `.react-phone-number-input--focus` CSS class. [Issue](https://github.com/catamphetamine/react-phone-number-input/issues/189).

2.2.0 / 03.08.2018
==================

  * Changed the output of `AsYouType` formatter. E.g. before for `US` and input `21` it was outputting `(21 )` which is not good for phone number input (not intuitive and is confusing). Now it will not add closing braces which haven't been reached yet by the input cursor and it will also strip the corresponding opening braces, so for `US` and input `21` it now is just `21`, and for `213` it is `(213)`.

2.1.8 / 27.07.2018
==================

  * Lowered React requirements back to `0.14` (same as for version 1.x of this library).

2.0.0 / 17.07.2018
==================

  * (breaking change) `/native` is now the default export. `react-responsive-ui` select is now exported as `react-phone-number-input/react-responsive-ui`.

  * (breaking change) Migrated `react-responsive-ui` country select from `0.10` to `0.13`. It no longer has text input functionality (like "autocomplete") — it's just a `<select/>` now, without any text input field. Removed `rrui.css` file (use `react-responsive-ui/style.css` bundle instead, or import styles individually from `react-responsive-ui/styles`). Renamed `maxItems` property to `scrollMaxItems`. Removed `countrySelectToggleClassName` property (unused).

  * (breaking change) `smartCaret` is now `false` by default (previously was `true`). This was done because some Samsung Android phones were having issues with `smartCaret={true}` (which was the default in version `1.x`). `smartCaret` has been removed for now, so that it doesn't include `input-format` library code.

  * (breaking change) `international` property is now `true` by default meaning that by default there will always be the "International" option in the country `<select/>`.

  * (breaking change) CSS changes: renamed `.react-phone-number-input__phone--native` CSS class to `.react-phone-number-input__phone`, added new `.react-phone-number-input__input` CSS class (the phone input).

  * (breaking change) Removed undocumented exports.

  * (breaking change) For `/custom` component `labels` and `internationalIcon` properties are now required (previously were `react-phone-number-input/locales/default.json` and  `react-phone-number-input/commonjs/InternationalIcon` by default).

  * (breaking change) Removed `/resources` directory (due to not being used).

1.1.13 / 12.07.2018
===================

  * Added `react-phone-number-input/basic-input` component.

1.1.3 / 29.05.2018
===================

  * Some CSS tweaks and code refactoring.

1.1.2 / 29.05.2018
===================

  * Added an isolated `react-phone-number-input/native` export (so that it doesn't include `react-responsive-ui` package in the resulting bundle).

  * Some CSS tweaks.

  *  `countrySelectComponent` `onToggle` property renamed to `hidePhoneInputField`.

1.1.0 / 28.05.2018
===================

  * Added `PhoneInputNative` exported component which deprecateds the old `nativeCountrySelect={true/false}` property. `PhoneInputNative` component doesn't require `rrui.css`. It will be the default exported component in version `2.x`.

  * Fixed [a minor bug](https://github.com/catamphetamine/react-phone-number-input/issues/131) appering in React 16.4 which caused the currently selected country flag to be reset while typing.

1.0.10 / 19.04.2018
===================

  * Added an optional `smartCaret={false}` property for [fixing Samsung Android phones](https://github.com/catamphetamine/react-phone-number-input/issues/75).

1.0.8 / 19.04.2018
===================

  * (breaking change) Changed the properties passed to a custom `inputComponent`, see `Input.js` `propTypes` for more info.

  * Added `BasicInput`: an alternative `inputComponent` for working around the Samsung Galaxy caret positioning bug.

1.0.0 / 21.03.2018
===================

  * (breaking change) Rewrote `Input.js` — there is a possibility that something could potentially break for users coming from previous versions.

  * (breaking change) No longer exporting `libphonenumber-js` functions.

  * (breaking change) `dictionary`'s `"International"` key renamed to `"ZZ"`.

  * (breaking change) `dictionary` property renamed to `labels`.

  * (breaking change) `nativeExpanded` property renamed to `nativeCountrySelect`.

  * (breaking change) `selectTabIndex` property renamed to `countrySelectTabIndex`.

  * (breaking change) `selectMaxItems` property renamed to `countrySelectMaxItems`.

  * (breaking change) `selectAriaLabel` property renamed to `countrySelectAriaLabel`.

  * (breaking change) `selectCloseAriaLabel` property renamed to `countrySelectCloseAriaLabel`.

  * (breaking change) `selectComponent` property renamed to `countrySelectComponent`

  * (breaking change) `flagComponent`'s `countryCode` property was renamed to just `country`.

  * (breaking change) Renamed `countries with flags.js` to `flags.js` and put them in the root folder.

  * (breaking change) `flags` property changed: it can no longer be a `boolean` and can only be an object of flag `React.Component`s.

  * (breaking change) `selectStyle` and `inputStyle` properties removed (due to not being used).

  * (breaking change) `inputTabIndex` property removed (use `tabIndex` instead).

  * (breaking change) `onCountryChange` property removed (no one actually used it).

  * (breaking change) `convertToNational` property renamed to `displayInitialValueAsLocalNumber`.

  * (breaking change) `style.css` changed a bit (to accomodate phone number extension field).

  * (breaking change) If someone did override `.rrui__input:not(.rrui__input--multiline)` CSS rule then now it has been split into two CSS rules: `.rrui__input` and `.rrui__input--multiline`.

  * Added `locale`s for the `labels` property (`ru` and `en`).

  * Added `ext` property for phone number extension input.

0.17.0 / 24.02.2018
===================

  * (breaking change) Fixed SVG flag icons for IE. This alters the markup a bit: `<img/>` is now wrapped in a `<div/>` and the CSS class of the image becomes the CSS class of the div and also a new CSS class for the image is added. This could hypothetically be a breaking change in some advanced use cases hence the major version bump.

  * Fixed `<Select/>` scrolling to the top of the page in IE <= 11.

  * Fixed validation error margin left.

0.16.0 / 22.02.2018
===================

  * Updated `libphonenumber-js` to `1.0.x`.
  * `parsePhoneNumber()`, `isValidPhoneNumber()` and `formatPhoneNumber()` no longer accept `undefined` phone number argument: it must be either a `string` or a parsed number `object` having a `string` `phone` property.

0.15.0 / 10.10.2017
===================

  * Added `error` and `indicateInvalid` properties for displaying error label.

  * (CSS breaking change) `react-phone-number-input` `<div/>` is now wrapped by another `<div/>` and its CSS class name changed to `react-phone-number-input__row` and `react-phone-number-input` CSS class name goes to the wrapper.

0.14.0 / 04.10.2017
===================

  * Returning `<input/>` `type` back to `tel`. There used to be reports previously that `input="tel"` `<input/>`s on some non-stock Android devices with non-stock keyboards had issues with proper caret positioning during input. Well, those are non-stock Android bugs and therefore they should fix those there. `type="tel"` is better in terms of the digital input keyboard so it's now a default. Still can be overridden by passing `type="text"` property.

0.13.0 / 20.09.2017
===================

This release contains some minor CSS class names refactoring which most likely won't introduce any issues in almost but all use cases.

(CSS breaking change) Refactored `<Select/>` CSS class names in `react-responsive-ui`:

  * `.rrui__select__selected--autocomplete` -> `.rrui__select__autocomplete`

  * `.rrui__select__selected` -> `.rrui__select__button`

  * `.rrui__select__selected--nothing` -> `.rrui__select__button--empty`

  * `.rrui__select__selected--expanded` -> `.rrui__select__button--expanded`

  * `.rrui__select__selected--disabled` -> `.rrui__select__button--disabled`

(CSS breaking change) Added `.rrui__text-input__input` CSS class to the phone number `<input/>`.

(CSS breaking change) Added global `.rrui__text-input__input` styles to `style.css`

0.12.1 / 27.07.2017
===================

  * Due to the [reports](https://github.com/catamphetamine/react-phone-number-input/issues/59) stating that `type="tel"` caret positioning doesn't work on Samsung devices the component had to revert back to `type="text"` by default (one can pass `type="tel"` property directly though).

0.12.0 / 25.07.2017
===================

  * (breaking change) The default value of `convertToNational` property changed from `true` to `false`. The reason is that the newer generation grows up when there are no stationary phones and therefore everyone inputs phone numbers with a `+` in their smartphones so local phone numbers should now be considered obsolete.

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
