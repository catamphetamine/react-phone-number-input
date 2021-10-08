// React TypeScript Cheatsheet doesn't recommend using `React.FunctionalComponent`.
// https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/function_components

import * as React from 'react';

import {
	Country,
	Value,
	Metadata
} from '../index.d';

import {
	PropsWithoutSmartCaret
} from '../input/index.d';

interface InputComponentProps {
	value: Value;
	onChangeText(value: Value): void;
	// Any other properties.
	[otherProperty: string]: any;
}

type InputComponent = (props: InputComponentProps) => JSX.Element | React.ComponentClass<InputComponentProps, any>;

interface Props extends PropsWithoutSmartCaret<InputComponent> {
	metadata?: Metadata;
}

type PhoneInputComponentType = (props: Props) => JSX.Element;

declare const PhoneInput: PhoneInputComponentType;

export default PhoneInput;