// React TypeScript Cheatsheet doesn't recommend using `React.FunctionalComponent` (`React.FC`).
// https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/function_components

import * as React from 'react';

import { Control } from 'react-hook-form';

import {
  Value,
  State,
  Props as BaseProps,
  DefaultInputComponentProps
} from '../index.d';

export {
  Country,
  Value
} from '../index.d';

// `ReactHookFormComponentProps` are used in:
// * `react-hook-form-input/index.d.ts`
export type ReactHookFormComponentProps = {
  name: string;
  defaultValue?: Value;
  control: Control;
  rules?: object;
  // A quote from `react-hook-form`:
  // Without `shouldUnregister: true`, an input value would be retained when input is removed.
  // Setting `shouldUnregister: true` makes the form behave more closer to native.
  shouldUnregister?: boolean;
}

// `Props` are imported in:
// * `react-hook-form-core/index.d.ts`
export type Props<InputComponentProps> = BaseProps<InputComponentProps> & ReactHookFormComponentProps;

type PhoneInputWithCountrySelectType<InputComponentProps = DefaultInputComponentProps> = React.ComponentClass<Props<InputComponentProps>, State<Props<InputComponentProps>>>

declare const PhoneInputWithCountrySelect: PhoneInputWithCountrySelectType;

export default PhoneInputWithCountrySelect;
