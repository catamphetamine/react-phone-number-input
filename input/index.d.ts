// React TypeScript Cheatsheet doesn't recommend using `React.FunctionalComponent`.
// https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/function_components

import * as React from 'react';

import {
	Country,
	Value,
	DefaultInputComponentProps
} from '../index.d';

type InputComponent<InputComponentProps> = (props: InputComponentProps) => JSX.Element | React.ComponentClass<InputComponentProps, any>;

// `PropsWithoutSmartCaret` are imported in:
// * `/react-native/index.d.ts`.
export type PropsWithoutSmartCaret<InputComponentProps> = Omit<InputComponentProps, 'value' | 'onChange'> & {
	country?: Country;
	international?: boolean;
	withCountryCallingCode?: boolean;
	defaultCountry?: Country;
	value?: Value;
	onChange(value?: Value): void;
	inputComponent?: InputComponent<InputComponentProps>;
	useNationalFormatForDefaultCountryValue?: boolean;
}

// `Props` are imported in:
// * `/input-core/index.d.ts`
// * `/react-hook-form-input/index.d.ts`.
export type Props<InputComponentProps> = PropsWithoutSmartCaret<InputComponentProps> & {
	smartCaret?: boolean;
}

type PhoneInputComponentType<InputComponentProps = DefaultInputComponentProps> = (props: Props<InputComponentProps>) => JSX.Element;

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