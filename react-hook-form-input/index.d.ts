// React TypeScript Cheatsheet doesn't recommend using `React.FunctionalComponent` (`React.FC`).
// https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/function_components

import * as React from 'react';

import { FieldValues } from 'react-hook-form';

import {
  ReactHookFormComponentProps,
  DefaultFormValues
} from '../react-hook-form/index.d';

import {
  FeatureProps as BaseProps,
  Country,
  Value
} from '../input/index.d';

import {
  DefaultInputComponentProps
} from '../index.d';

// `Props` are used in:
// * `react-hook-form-input-core/index.d.ts`
export type Props<InputComponentProps, FormValues extends FieldValues> = BaseProps<InputComponentProps> & ReactHookFormComponentProps<FormValues> & {
  // onChange?(event: React.ChangeEvent<HTMLInputElement>): void;
  // onBlur?(event: React.FocusEvent<HTMLInputElement>): void;
}

type PhoneInputType = <InputComponentProps = DefaultInputComponentProps, FormValues extends FieldValues = DefaultFormValues>(props: Props<InputComponentProps, FormValues>) => JSX.Element;

// Could also export the component that would accept custom "generics",
// but seems like it would also introduce some inconvenience when using `typeof PhoneInput`
// for defining the type of the `props`.
// https://github.com/catamphetamine/react-phone-number-input/issues/414#issuecomment-1220679025
// type PhoneInputType = <InputComponentProps = DefaultInputComponentProps, FormValues extends FieldValues = DefaultFormValues>(props: Props<InputComponentProps, FormValues>) => JSX.Element;

declare const PhoneInput: PhoneInputType;

export default PhoneInput;