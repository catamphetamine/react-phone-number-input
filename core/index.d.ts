import {
	Metadata,
	Labels,
	Props as BaseProps,
	State,
	Value
} from '../index.d';

interface Props extends BaseProps {
  metadata: Metadata;
  labels: Labels;
}

type PhoneInputWithCountrySelectType = React.ComponentClass<Props, State<Props>>;

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
