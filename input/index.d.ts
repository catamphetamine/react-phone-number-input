// React TypeScript Cheatsheet doesn't recommend using `React.FunctionalComponent`.
// https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/function_components

import * as React from 'react';

import {
	Country,
	Value
} from '../index.d';

interface InputComponentProps {
	value: string;
	onChange(event: React.ChangeEvent<HTMLInputElement>): void;
	// Any other properties.
	[otherProperty: string]: any;
}

type InputComponent = (props: InputComponentProps) => JSX.Element | React.ComponentClass<InputComponentProps, any>;

// `PropsWithoutSmartCaret` are imported in `/react-native/index.d.ts`.
export interface PropsWithoutSmartCaret<InputComponent> {
	country?: Country;
	international?: boolean;
	withCountryCallingCode?: boolean;
	defaultCountry?: Country;
	value?: Value;
	onChange(value: Value?): void;
	inputComponent?: InputComponent;
	useNationalFormatForDefaultCountryValue?: boolean;
	// All other properties are passed through to the `<input/>` element.
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
	isSupportedCountry
} from '../index.d';