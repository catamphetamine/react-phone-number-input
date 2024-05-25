// React TypeScript Cheatsheet doesn't recommend using `React.FunctionalComponent`.
// https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/function_components

import * as React from 'react';

import {
	Metadata,
	DefaultInputComponentProps
} from '../index.d.js';

import {
	Props as BaseProps
} from '../input/index.d.js';

type Props<InputComponentProps> = BaseProps<InputComponentProps> & {
	metadata: Metadata;
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
} from '../core/index.d.js';
