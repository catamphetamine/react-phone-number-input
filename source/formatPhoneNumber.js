import { formatIncompletePhoneNumber } from 'libphonenumber-js/custom'

export default function formatPhoneNumber(value, country, metadata)
{
	const result = formatIncompletePhoneNumber(value, country, metadata, { template: true })
	return { text: result.number, template: result.template }
}