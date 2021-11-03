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

// `Country` type could be used in the application's code.
export type Country = CountryCode;

type Locale = string;

type LocaleProperty = Locale | Locale[];

type CountryOption = 'XX' | '🌐' | '|' | '...' | '…' | Country;

// `Flags` are imported in `flags/index.d.ts`.
export type Flags = Partial<Record<Country, EmbeddedFlag>>;

interface EmbeddedFlagProps {
	title: string;
}

type EmbeddedFlag = (props: EmbeddedFlagProps) => JSX.Element;

interface FlagProps {
	country: Country;
	countryName: string;
	flagUrl?: string;
	flags?: Flags;
}

type Flag = (props: FlagProps) => JSX.Element;

// `Labels` are imported in `/core/index.d.ts`.
export type Labels = Partial<Record<Country | 'ZZ' | 'ext' | 'country' | 'phone', string>>;

// export type Labels = Partial<Record<Country, string>> & {
//   ZZ: string?,
//   ext: string?,
//   country: string?,
//   phone: string?,
// }

// `Props` are imported in `/react-hook-form/index.d.ts`
// and in `/core/index.d.ts`.
export interface Props {
	value?: Value;
	onChange(value?: Value): void;
	onFocus?(event: React.FocusEvent<HTMLElement>): void;
	onBlur?(event: React.FocusEvent<HTMLElement>): void;
	disabled?: boolean;
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
	internationalIcon?: React.ReactType;
	countryOptionsOrder?: CountryOption[];
	style?: object;
	className?: string;
	countrySelectComponent?: React.ReactType;
	countrySelectProps?: object;
	inputComponent?: React.ReactType;
	containerComponent?: React.ReactType;
	numberInputProps?: object;
	smartCaret?: boolean;
	international?: boolean;
	limitMaxLength?: boolean;
	countryCallingCodeEditable?: boolean;
	onCountryChange?(country?: Country): void;
	focusInputOnCountrySelection?: boolean;
	// All other properties are passed through to the `<input/>` element.
	[otherProperty: string]: any;
}

// `State` is imported in `/core/index.d.ts`
// and in `/react-hook-form/index.d.ts`.
export interface State<Props> {
	country?: Country;
	countries?: Country[];
	hasUserSelectedACountry?: boolean;
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
	// new `props` with the "previous" ones in `state.props`.
	props: Props;
}

type PhoneInputWithCountrySelectType = React.ComponentClass<Props, State<Props>>

declare const PhoneInputWithCountrySelect: PhoneInputWithCountrySelectType;

export default PhoneInputWithCountrySelect;

export function formatPhoneNumber(value: Value): string;
export function formatPhoneNumberIntl(value: Value): string;

export {
	default as parsePhoneNumber,
	isValidPhoneNumber,
	isPossiblePhoneNumber,
	getCountryCallingCode,
	getCountries,
	isSupportedCountry
} from 'libphonenumber-js/min';