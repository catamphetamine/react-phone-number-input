import getCountries_ from './getCountries'
import metadata from 'libphonenumber-js/metadata.min.json'

export default function getCountries() {
	return getCountries_(metadata)
}