// React TypeScript Cheatsheet doesn't recommend using `React.FunctionalComponent`.
// https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/function_components

import * as React from 'react';

import {
	Country,
	Value,
	Metadata
} from '../index.d';

export {
	Country,
	Value
} from '../index.d';

import {
	PropsWithoutSmartCaret
} from '../input/index.d';

// The default React.Native input component accepts properties:
// * `value: string`
// * `onChangeText(value: string): void`
// * Any other React.Native-specific input component properties
type UnderlyingInputComponentProps<OriginalUnderlyingInputComponentProps> = Omit<OriginalUnderlyingInputComponentProps, 'value' | 'onChangeText'> & {
	value: Value;
	onChangeText(value: Value): void;
};

type Props<InputComponentProps> = PropsWithoutSmartCaret<UnderlyingInputComponentProps<InputComponentProps>> & {
	metadata?: Metadata;
};

// In an HTML DOM environment, there's
// `React.InputHTMLAttributes<HTMLInputElement>` type available.
// In a React Native environment, there seems to be no such equivalent.
// Hence, using a `[anyProperty: string]: any` workaround
// for supporting any "other" properties that get passed through
// to the input component.
type DefaultInputComponentProps = {
	[anyProperty: string]: any;
}

type PhoneInputComponentType<InputComponentProps = DefaultInputComponentProps> = React.ForwardRefExoticComponent<Props<InputComponentProps> & React.RefAttributes<unknown>>

declare const PhoneInput: PhoneInputComponentType;

export default PhoneInput;