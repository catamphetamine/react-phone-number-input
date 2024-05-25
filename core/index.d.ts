import {
	Metadata,
	Labels,
	Props as BaseProps,
	State,
	Value,
	ExternalValue,
	DefaultInputComponentProps
} from '../index.d.js';

export {
	Country,
	Value
} from '../index.d.js';

type Props<InputComponentProps> = BaseProps<InputComponentProps> & {
  metadata: Metadata;
  labels: Labels;
}

type PhoneInputWithCountrySelectType<InputComponentProps = DefaultInputComponentProps> = React.ComponentClass<Props<InputComponentProps>, State<Props<InputComponentProps>>>;

declare const PhoneInputWithCountrySelect: PhoneInputWithCountrySelectType;

export default PhoneInputWithCountrySelect;

export function formatPhoneNumber(value: Value | ExternalValue, metadata: Metadata): string;
export function formatPhoneNumberIntl(value: Value | ExternalValue, metadata: Metadata): string;

export {
	default as parsePhoneNumber,
	isValidPhoneNumber,
	isPossiblePhoneNumber,
	getCountryCallingCode,
	getCountries,
	isSupportedCountry,
	PhoneNumber
} from 'libphonenumber-js/core';
