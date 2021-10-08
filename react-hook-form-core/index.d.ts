// React TypeScript Cheatsheet doesn't recommend using `React.FunctionalComponent` (`React.FC`).
// https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/function_components

import * as React from 'react';

import {
  Metadata,
  Labels
} from '../index.d';

import {
	Props as BaseProps
} from '../react-hook-form/index.d';

interface Props extends BaseProps {
  metadata: Metadata;
  labels: Labels;
}

type PhoneInputWithCountrySelectComponentType = (props: Props) => JSX.Element;

declare const PhoneInputWithCountrySelect: PhoneInputWithCountrySelectComponentType;

export default PhoneInputWithCountrySelect;