// React TypeScript Cheatsheet doesn't recommend using `React.FunctionalComponent` (`React.FC`).
// https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/function_components

import * as React from 'react';

import {
  Metadata,
  Labels,
  DefaultInputComponentProps
} from '../index.d';

export {
	Country,
	Value
} from '../index.d';

import {
	Props as BaseProps
} from '../react-hook-form/index.d';

type Props<InputComponentProps> = BaseProps<InputComponentProps> & {
  metadata: Metadata;
  labels: Labels;
}

type PhoneInputWithCountrySelectComponentType<InputComponentProps = DefaultInputComponentProps> = (props: Props<InputComponentProps>) => JSX.Element;

declare const PhoneInputWithCountrySelect: PhoneInputWithCountrySelectComponentType;

export default PhoneInputWithCountrySelect;