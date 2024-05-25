// React TypeScript Cheatsheet doesn't recommend using `React.FunctionalComponent` (`React.FC`).
// https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/function_components

import * as React from 'react';

import {
	CountryCode,
	E164Number,
	MetadataJson
} from 'libphonenumber-js/core';

export type Metadata = MetadataJson;

export type Value = E164Number;
export type ExternalValue = string;

// `Country` type could be used in the application's code.
export type Country = CountryCode;

type Locale = string;

type LocaleProperty = Locale | Locale[];

type CountryOption = 'XX' | '🌐' | '|' | '...' | '…' | Country;

// `Flags` are imported in `flags/index.d.ts`.
export type Flags = Partial<Record<Country, EmbeddedFlag>>;

export interface EmbeddedFlagProps {
	title: string;
}

type EmbeddedFlag = (props: EmbeddedFlagProps) => JSX.Element;

export interface FlagProps {
	country: Country;
	countryName: string;
	flagUrl?: string;
	flags?: Flags;
}

type Flag = (props: FlagProps) => JSX.Element;

// `LabelKey` is imported in `/locale/{locale}.json.d.ts`.
export type LabelKey = Country | 'ZZ' | 'ext' | 'country' | 'phone';

// `Labels` are imported in `/core/index.d.ts`.
export type Labels = Partial<Record<LabelKey, string>>;

// export type Labels = Partial<Record<Country, string>> & {
//   ZZ: string?,
//   ext: string?,
//   country: string?,
//   phone: string?,
// }

// `FeatureProps` are imported in:
// * `/react-hook-form/index.d.ts`
//
// `Props` extend `FeatureProps` by adding `value` and `onChange` properties.
//
// The `Props` interface extends `React.InputHTMLAttributes<HTMLInputElement>`
// in order to support "rest" props (any other props not used by this library).
//
// `Omit<..., 'onChange' | 'value'>` is added in order to omit the standard
// `onChange(event: Event)` and `value: string` HTML attributes
// because this component uses its own with different signatures:
// `onChange(value?: Value)` and `value?: Value`.
// Because the signatures are different, those two standard HTML attributes
// wouldn't get replaced with the ones used by this library,
// resulting in the `Props` interface allowing two types of both
// `onChange` and `value` while only one of each would be valid to pass.
//
// This `Props` interface can only be used in an HTML DOM environment
// because it extends `React.InputHTMLAttributes<HTMLInputElement>`.
//
export type FeatureProps<InputComponentProps> = Omit<InputComponentProps, 'value' | 'onChange'> & {
	onFocus?(event: React.FocusEvent<HTMLElement>): void;
	onBlur?(event: React.FocusEvent<HTMLElement>): void;
	disabled?: boolean;
	readOnly?: boolean;
	autoComplete?: string;
	initialValueFormat?: 'national';
	defaultCountry?: Country;
	countries?: Country[];
	labels?: Labels;
	locales?: LocaleProperty;
	flagUrl?: string;
	flags?: Flags;
	flagComponent?: Flag;
	addInternationalOption?: boolean;
	internationalIcon?: React.ElementType;
	countryOptionsOrder?: CountryOption[];
	style?: object;
	className?: string;
	countrySelectComponent?: React.ElementType;
	countrySelectProps?: object;
	inputComponent?: React.ElementType;
	numberInputProps?: object;
	containerComponent?: React.ElementType;
	containerComponentProps?: object;
	smartCaret?: boolean;
	international?: boolean;
	limitMaxLength?: boolean;
	countryCallingCodeEditable?: boolean;
	onCountryChange?(country?: Country): void;
	focusInputOnCountrySelection?: boolean;
}

// `Props` are imported in:
// * `/core/index.d.ts`
export type Props<InputComponentProps> = FeatureProps<InputComponentProps> & {
	// The `value` type could be `Value` or `string`.
	// `string` was specifically added to allow for passing the `value` property
	// that was received from an external source such as a database.
	// https://gitlab.com/catamphetamine/libphonenumber-js/-/issues/144#note_1921382409
	value?: Value | ExternalValue;
	onChange(value?: Value): void;
}

// `State` is imported in:
// * `/core/index.d.ts`
// * `/react-hook-form/index.d.ts`
export interface State<Props> {
	// The currently selected country: either automatically-selected or user-selected.
	country?: Country;
	// This is basically `props.countries` with some additional filtering
	// that removes possibly non-existing country codes.
	// For example, if `props.countries` is `["US", "XX"]` then `state.countries` is `["US"]`.
	countries?: Country[];
	// Tracks the latest country that the user has selected themself.
	// This could be used when deciding which country flag to display
	// when the component can't decide between a set of matching countries.
	// For example, if the user has selected CA and then starts inputting a phone number
	// and at some stage the phone number is determined to belong to US country,
	// but then the user reconsiders and erases some of the digits — it should perhaps
	// show CA flag instead of the US flag in such "both countries are possible" situation.
	latestCountrySelectedByUser?: Country;
	// If the user has already manually selected a country via the country select
	// then don't override that already-selected country if the `defaultCountry` property
	// value changes for some reason. The `hasUserSelectedACountry` flag is used to track that:
	// whether the user has already selected any country or whether they haven't.
	hasUserSelectedACountry?: boolean;
	// The `value` property is duplicated in `state` in order to determine
	// whether the `value` property has changed or not. Specifically, it is used
	// in `getDerivedStateFromProps()` function to ignore a `getDerivedStateFromProps()` call
	// that happens in `this.onChange()` right after `this.setState()`.
	// If that `getDerivedStateFromProps()` call wasn't ignored then the country flag would
	// reset itself on each input value change event.
	value?: Value;
	// `phoneDigits` are the parsed phone number digits,
	// including a leading `+`, if present.
	// Examples of `phoneDigits`:
	// * `undefined`
	// * "+78005553535"
	// * "88005553535"
	phoneDigits?: string;
	// `forceRerender` is a "dummy" object that is set to `{}`
	// in order to force a rerender of the component.
	forceRerender?: object;
	isFocused?: boolean;
	// `props` are stored in state in order to be able to compare
	// new `props` with the "previous" ones in `state.props`
	// in `PhoneInputWithCountry.getDerivedStateFromProps()`.
	props: Props;
}

// export type DefaultInputComponentProps = React.InputHTMLAttributes<HTMLInputElement>
// Precise TypeScript "typings" turned out to be too complex to figure out,
// so it just allows any property that a hypothetical custom `inputComponent` could accept.
export type DefaultInputComponentProps = {
	[anyProperty: string]: any;
}

type PhoneInputWithCountrySelectType<InputComponentProps = DefaultInputComponentProps> = React.ComponentClass<Props<InputComponentProps>, State<Props<InputComponentProps>>>

declare const PhoneInputWithCountrySelect: PhoneInputWithCountrySelectType;

export default PhoneInputWithCountrySelect;

export function formatPhoneNumber(value: Value | ExternalValue): string;
export function formatPhoneNumberIntl(value: Value | ExternalValue): string;

export {
	default as parsePhoneNumber,
	isValidPhoneNumber,
	isPossiblePhoneNumber,
	getCountryCallingCode,
	getCountries,
	isSupportedCountry,
	PhoneNumber
} from 'libphonenumber-js/min';
