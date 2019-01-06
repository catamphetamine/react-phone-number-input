// Deprecated.
// This is a file used in legacy `/index.js` export entry.
// In some next major version this file will be removed
// and `/index.js` will be redirected to `/min/index.js`.

import { formatNumber } from 'libphonenumber-js/custom'
import metadata from 'libphonenumber-js/metadata.min.json'

export default function formatPhoneNumber(value, format = 'National')
{
	return formatNumber(value, format, metadata)
}

export function formatPhoneNumberIntl(value)
{
	return formatPhoneNumber(value, 'International')
}