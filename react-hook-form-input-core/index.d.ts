// React TypeScript Cheatsheet doesn't recommend using `React.FunctionalComponent` (`React.FC`).
// https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/function_components

import * as React from 'react';

import { FieldValues } from 'react-hook-form';

import {
  Metadata,
  DefaultInputComponentProps
} from '../index.d.js';

export {
	Country,
	Value
} from '../index.d.js';

import {
	Props as BaseProps
} from '../react-hook-form-input/index.d.js';

import {
	DefaultFormValues
} from '../react-hook-form/index.d.js';

type Props<InputComponentProps, FormValues extends FieldValues> = BaseProps<InputComponentProps, FormValues> & {
  metadata: Metadata;
}

type PhoneInputType = <InputComponentProps = DefaultInputComponentProps, FormValues extends FieldValues = DefaultFormValues>(props: Props<InputComponentProps, FormValues>) => JSX.Element;

// Could also export the component that would accept custom "generics",
// but seems like it would also introduce some inconvenience when using `typeof PhoneInput`
// for defining the type of the `props`.
// https://github.com/catamphetamine/react-phone-number-input/issues/414#issuecomment-1220679025
// type PhoneInputType = <InputComponentProps = DefaultInputComponentProps, FormValues extends FieldValues = DefaultFormValues>(props: Props<InputComponentProps, FormValues>) => JSX.Element;

declare const PhoneInput: PhoneInputType;

export default PhoneInput;