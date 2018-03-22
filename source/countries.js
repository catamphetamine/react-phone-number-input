// A list of all country names
// sorted by country code.
import country_names from './countries.json'

// A list of all country codes.
export const countries = []

// Country code to country name map.
const default_country_names =
{
	// From ISO 3166-1:2006(E/F):
	//
	// 8.1.3   User-assigned code elements
	//
	// If users need code elements to represent country names not included
	// in this part of ISO 3166, the series of letters AA, QM to QZ, XA
	// to XZ, and ZZ, and the series AAA to AAZ, QMA to QZZ, XAA to XZZ,
	// and ZZA to ZZZ respectively, and the series of numbers 900 to 999
	// are available. These users should inform the ISO 3166/MA of such use.
	//
	ZZ: 'International'
}

// Populate country codes and country names.
for (const country of country_names)
{
	const [code, name] = country

	countries.push(code)
	default_country_names[code] = name
}

export default default_country_names