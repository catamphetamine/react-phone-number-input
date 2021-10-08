// React TypeScript Cheatsheet doesn't recommend using `React.FunctionalComponent` (`React.FC`).
// https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/function_components

import * as React from 'react';

import { Control } from 'react-hook-form';

import {
  Value,
  State,
  Props as BaseProps
} from '../index.d';

export interface ReactHookFormComponentProps {
  name: string;
  defaultValue?: Value;
  control: Control;
  rules?: object;
  // A quote from `react-hook-form`:
  // Without `shouldUnregister: true`, an input value would be retained when input is removed.
  // Setting `shouldUnregister: true` makes the form behave more closer to native.
  shouldUnregister?: boolean;
}

interface ReactHookFormComponentPropsOnChangeValue extends ReactHookFormComponentProps {
  onChange?(value?: Value): void;
  onBlur?(event: React.FocusEvent<HTMLElement>): void;
}

export interface Props extends BaseProps, ReactHookFormComponentPropsOnChangeValue {
}

type PhoneInputWithCountrySelectType = React.ComponentClass<Props, State<Props>>

declare const PhoneInputWithCountrySelect: PhoneInputWithCountrySelectType;

export default PhoneInputWithCountrySelect;