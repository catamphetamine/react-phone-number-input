// React TypeScript Cheatsheet doesn't recommend using `React.FunctionalComponent` (`React.FC`).
// https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/function_components

import * as React from 'react';

import { Control } from 'react-hook-form';

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
export type ReactHookFormComponentProps<FormValues> = {
  name: string;
  defaultValue?: Value;
  control: Control<FormValues>;
  rules?: object;
  // A quote from `react-hook-form`:
  // Without `shouldUnregister: true`, an input value would be retained when input is removed.
  // Setting `shouldUnregister: true` makes the form behave more closer to native.
  shouldUnregister?: boolean;
}

// `Props` are imported in:
// * `react-hook-form-core/index.d.ts`
export type Props<InputComponentProps, FormValues> = BaseProps<InputComponentProps> & ReactHookFormComponentProps<FormValues>;

type PhoneInputWithCountrySelectType<InputComponentProps = DefaultInputComponentProps, FormValues> = React.ComponentClass<Props<InputComponentProps, FormValues>, State<Props<InputComponentProps, FormValues>>>

declare const PhoneInputWithCountrySelect: PhoneInputWithCountrySelectType;

export default PhoneInputWithCountrySelect;
