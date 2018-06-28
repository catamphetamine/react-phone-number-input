export function getCountryCodes(labels)
{
	// Includes all country codes (excluding "ZZ" for "International").
	//
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
	return Object.keys(labels).filter(key => key.length === 2 && key.toUpperCase() === key && key !== 'ZZ')
}