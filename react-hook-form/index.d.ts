// React TypeScript Cheatsheet doesn't recommend using `React.FunctionalComponent` (`React.FC`).
// https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/function_components

import * as React from 'react';

import { Control, FieldValues } from 'react-hook-form';

import {
  Value,
  State,
  FeatureProps as BaseProps,
  DefaultInputComponentProps
} from '../index.d';

export {
  Country,
  Value
} from '../index.d';

// `ReactHookFormComponentProps` are used in:
// * `react-hook-form-input/index.d.ts`
export type ReactHookFormComponentProps<FormValues extends FieldValues> = {
  name: string;
  defaultValue?: Value;
  // A developer should pass a `control` object that is returned from `useForm()` hook.
  // Not required when using `<FormProvider/>`.
  control?: Control<FormValues>;
  rules?: object;
  // A quote from `react-hook-form`:
  // Without `shouldUnregister: true`, an input value would be retained when input is removed.
  // Setting `shouldUnregister: true` makes the form behave more closer to native.
  shouldUnregister?: boolean;
}

// `Props` are imported in:
// * `react-hook-form-core/index.d.ts`
export type Props<InputComponentProps, FormValues extends FieldValues> = BaseProps<InputComponentProps> & ReactHookFormComponentProps<FormValues>;

// `DefaultFormValues` are imported in:
// * `react-hook-form-core/index.d.ts`
export type DefaultFormValues = FieldValues;

type PhoneInputWithCountrySelectType = <InputComponentProps = DefaultInputComponentProps, FormValues extends FieldValues = DefaultFormValues>(props: Props<InputComponentProps, FormValues>) => JSX.Element;

// Could also export the component that would accept custom "generics", if the component was a function,
// but seems like it would also introduce some inconvenience when using `typeof PhoneInputWithCountrySelect`
// for defining the type of the `props`.
// https://github.com/catamphetamine/react-phone-number-input/issues/414#issuecomment-1220679025
// type PhoneInputWithCountrySelectType = <InputComponentProps = DefaultInputComponentProps, FormValues extends FieldValues = DefaultFormValues>(props: Props<InputComponentProps, FormValues>) => JSX.Element;

declare const PhoneInputWithCountrySelect: PhoneInputWithCountrySelectType;

export default PhoneInputWithCountrySelect;
