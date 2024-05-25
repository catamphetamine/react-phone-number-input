// React TypeScript Cheatsheet doesn't recommend using `React.FunctionalComponent`.
// https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/function_components

import * as React from 'react';

import {
	Country,
	Value,
	ExternalValue,
	DefaultInputComponentProps
} from '../index.d.js';

type InputComponent<InputComponentProps> =
  | ((props: InputComponentProps) => JSX.Element | React.ComponentClass<InputComponentProps, any>)
  | React.ForwardRefExoticComponent<InputComponentProps & React.RefAttributes<HTMLInputElement>>;

type FeaturePropsWithoutSmartCaret<InputComponentProps> = Omit<InputComponentProps, 'value' | 'onChange'> & {
	country?: Country;
	international?: boolean;
	withCountryCallingCode?: boolean;
	defaultCountry?: Country;
	inputComponent?: InputComponent<InputComponentProps>;
	useNationalFormatForDefaultCountryValue?: boolean;
}

// `PropsWithoutSmartCaret` are imported in:
// * `/react-native/index.d.ts`.
export type PropsWithoutSmartCaret<InputComponentProps> = FeaturePropsWithoutSmartCaret<InputComponentProps> & {
	value?: Value | ExternalValue;
	onChange(value?: Value): void;
}

// `FeatureProps` are imported in:
// * `/react-hook-form-input/index.d.ts`.
export type FeatureProps<InputComponentProps> = FeaturePropsWithoutSmartCaret<InputComponentProps> & {
	smartCaret?: boolean;
}

// `Props` are imported in:
// * `/input-core/index.d.ts`
export type Props<InputComponentProps> = PropsWithoutSmartCaret<InputComponentProps> & {
	smartCaret?: boolean;
}

type PhoneInputComponentType<InputComponentProps = DefaultInputComponentProps> = React.ForwardRefExoticComponent<Props<InputComponentProps> & React.RefAttributes<unknown>>

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
	Value,
	PhoneNumber
} from '../index.d.js';
