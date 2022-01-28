import {
	Metadata,
	Labels,
	Props as BaseProps,
	State,
	Value,
	DefaultInputComponentProps
} from '../index.d';

type Props<InputComponentProps> = BaseProps<InputComponentProps> & {
  metadata: Metadata;
  labels: Labels;
}

type PhoneInputWithCountrySelectType<InputComponentProps = DefaultInputComponentProps> = React.ComponentClass<Props<InputComponentProps>, State<Props<InputComponentProps>>>;

declare const PhoneInputWithCountrySelect: PhoneInputWithCountrySelectType;

export default PhoneInputWithCountrySelect;

export function formatPhoneNumber(value: Value, metadata: Metadata): string;
export function formatPhoneNumberIntl(value: Value, metadata: Metadata): string;

export {
	default as parsePhoneNumber,
	isValidPhoneNumber,
	isPossiblePhoneNumber,
	getCountryCallingCode,
	getCountries,
	isSupportedCountry,
	Country,
	Value
} from 'libphonenumber-js/core';
