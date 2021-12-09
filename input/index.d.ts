// React TypeScript Cheatsheet doesn't recommend using `React.FunctionalComponent`.
// https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/function_components

import * as React from 'react';

import {
	Country,
	Value
} from '../index.d';

// These props are only for an HTML DOM environment
// because they extend `React.InputHTMLAttributes<HTMLInputElement>`.
interface InputComponentProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
	value: string;
	onChange(event: React.ChangeEvent<HTMLInputElement>): void;
}

type InputComponent = (props: InputComponentProps) => JSX.Element | React.ComponentClass<InputComponentProps, any>;

// `PropsWithoutSmartCaret` are imported in `/react-native/index.d.ts`.
export interface PropsWithoutSmartCaret<InputComponent> {
	country?: Country;
	international?: boolean;
	withCountryCallingCode?: boolean;
	defaultCountry?: Country;
	value?: Value;
	onChange(value?: Value): void;
	inputComponent?: InputComponent;
	useNationalFormatForDefaultCountryValue?: boolean;
	// Because these props are for use in a non-HTML DOM environment,
	// they can't extend `React.InputHTMLAttributes<HTMLInputElement>`,
	// so `[otherProperty: string]: any` is added as a workaround
	// for supporting any other properties that get passed down
	// to the input component.
	[otherProperty: string]: any;
}

// `Props` are imported in `/input-core/index.d.ts`
// and in `/react-hook-form-input/index.d.ts`.
export interface Props extends PropsWithoutSmartCaret<InputComponent> {
	smartCaret?: boolean;
}

type PhoneInputComponentType = (props: Props) => JSX.Element;

declare const PhoneInput: PhoneInputComponentType;

export default PhoneInput;

export {
	parsePhoneNumber,
	formatPhoneNumber,
	formatPhoneNumberIntl,
	isValidPhoneNumber,
	isPossiblePhoneNumber,
	getCountryCallingCode,
	getCountries,
	isSupportedCountry,
	Country,
	Value
} from '../index.d';