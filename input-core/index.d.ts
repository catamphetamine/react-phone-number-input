// React TypeScript Cheatsheet doesn't recommend using `React.FunctionalComponent`.
// https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/function_components

import * as React from 'react';

import {
	Metadata
} from '../index.d';

import {
	Props as BaseProps
} from '../input/index.d';

interface Props extends BaseProps {
	metadata: Metadata;
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
} from '../core/index.d';
