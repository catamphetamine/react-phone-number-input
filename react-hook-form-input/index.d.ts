// React TypeScript Cheatsheet doesn't recommend using `React.FunctionalComponent` (`React.FC`).
// https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/function_components

import * as React from 'react';

import {
  ReactHookFormComponentProps
} from '../react-hook-form/index.d';

import {
  Props as BaseProps,
  Country,
  Value
} from '../input/index.d';

export {
  DefaultInputComponentProps
} from '../index.d';

// `Props` are used in:
// * `react-hook-form-input-core/index.d.ts`
export type Props<InputComponentProps> = BaseProps<InputComponentProps> & ReactHookFormComponentProps & {
  // onChange?(event: React.ChangeEvent<HTMLInputElement>): void;
  // onBlur?(event: React.FocusEvent<HTMLInputElement>): void;
}

type PhoneInputType<InputComponentProps = DefaultInputComponentProps> = (props: Props<InputComponentProps>) => JSX.Element;

declare const PhoneInput: PhoneInputType;

export default PhoneInput;