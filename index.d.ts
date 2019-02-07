export type NumberFormat = 'NATIONAL' | 'National' | 'INTERNATIONAL' | 'International';

export function formatPhoneNumber(value?: string): string;
export function formatPhoneNumber(value: string, format?: NumberFormat): string;
export function formatPhoneNumberIntl(value?: string): string;
export function isValidPhoneNumber(value?: string): boolean;

// See:
// https://github.com/catamphetamine/react-phone-number-input/issues/195