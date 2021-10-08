// React TypeScript Cheatsheet doesn't recommend using `React.FunctionalComponent` (`React.FC`).
// https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/function_components

import * as React from 'react';

import {
  ReactHookFormComponentProps
} from '../react-hook-form/index.d';

import {
  Props as BaseProps
} from '../input/index.d';

interface ReactHookFormComponentPropsOnChangeEvent extends ReactHookFormComponentProps {
  onChange?(event: React.ChangeEvent<HTMLInputElement>): void;
  onBlur?(event: React.FocusEvent<HTMLInputElement>): void;
}

export interface Props extends BaseProps, ReactHookFormComponentPropsOnChangeEvent {
}

type PhoneInputType = (props: Props) => JSX.Element;

declare const PhoneInput: PhoneInputType;

export default PhoneInput;