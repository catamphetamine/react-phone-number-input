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

interface InputComponentProps {
	value: Value;
	onChangeText(value: Value): void;
	// Because these props are for use in a non-HTML DOM environment,
	// they can't extend `React.InputHTMLAttributes<HTMLInputElement>`,
	// so `[otherProperty: string]: any` is added as a workaround
	// for supporting any other properties that get passed down
	// to the input component.
	[otherProperty: string]: any;
}

type InputComponent = (props: InputComponentProps) => JSX.Element | React.ComponentClass<InputComponentProps, any>;

interface Props extends PropsWithoutSmartCaret<InputComponent> {
	metadata?: Metadata;
}

type PhoneInputComponentType = (props: Props) => JSX.Element;

declare const PhoneInput: PhoneInputComponentType;

export default PhoneInput;