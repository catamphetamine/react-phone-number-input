import { starts_with } from './helpers'

// If you notice, country phone codes are inherently unambiguous,
// i.e. for a given sequence of digits only one country phone code
// can match. E.g. there is "1" code for USA and Canada, and therefore
// no other country code starts with "1". Next, there is "7" code for Russia
// and Kazakhstan, therefore no other country code starts with "7".
// The same trick applies to two-digit country codes and three-digit country codes.

// https://countrycode.org/
//
// data.split('\n').map(row =>
// {
// 	const digit_index = row.search(/\d/)
// 	const country_name = row.slice(0, digit_index).trim()
//
// 	row = row.slice(digit_index)
//
// 	const letter_index = row.search(/[A-z]/)
// 	const phone_codes = row.slice(0, letter_index).trim()
// 		.split(', ')
// 		.map(code => code.replace(/[^0-9]/g, ''))
//
// 	row = row.slice(letter_index)
//
// 	const parts = row.split(/\s/)
//
// 	row =
// 	{
// 		country      : parts[0],
// 		country_3    : parts[2],
// 		codes        : phone_codes,
// 		country_name : country_name
// 	}
//
// 	return row
// })
// .reduce((total, row) =>
// {
// 	return total.concat(row.codes.map(code =>
// 	({
// 		code,
// 		country      : row.country,
// 		country_3    : row.country_3,
// 		country_name : row.country_name
// 	})))
// },
// [])
// .sort((a, b) => b.code - a.code)
// .map(row => `\t['${row.code}', '${row.country}', '${row.country_3}'], // ${row.country_name}`)
// .join('\n')
//
const country_phone_prefixes =
[
	['441624', 'IM', 'IMN'], // Isle of Man
	['441534', 'JE', 'JEY'], // Jersey
	['441481', 'GG', 'GGY'], // Guernsey
	['1939', 'PR', 'PRI'], // Puerto Rico
	['1876', 'JM', 'JAM'], // Jamaica
	['1869', 'KN', 'KNA'], // Saint Kitts and Nevis
	['1868', 'TT', 'TTO'], // Trinidad and Tobago
	['1849', 'DO', 'DOM'], // Dominican Republic
	['1829', 'DO', 'DOM'], // Dominican Republic
	['1809', 'DO', 'DOM'], // Dominican Republic
	['1787', 'PR', 'PRI'], // Puerto Rico
	['1784', 'VC', 'VCT'], // Saint Vincent and the Grenadines
	['1767', 'DM', 'DMA'], // Dominica
	['1758', 'LC', 'LCA'], // Saint Lucia
	['1721', 'SX', 'SXM'], // Sint Maarten
	['1684', 'AS', 'ASM'], // American Samoa
	['1671', 'GU', 'GUM'], // Guam
	['1670', 'MP', 'MNP'], // Northern Mariana Islands
	['1664', 'MS', 'MSR'], // Montserrat
	['1649', 'TC', 'TCA'], // Turks and Caicos Islands
	['1473', 'GD', 'GRD'], // Grenada
	['1441', 'BM', 'BMU'], // Bermuda
	['1345', 'KY', 'CYM'], // Cayman Islands
	['1340', 'VI', 'VIR'], // U.S. Virgin Islands
	['1284', 'VG', 'VGB'], // British Virgin Islands
	['1268', 'AG', 'ATG'], // Antigua and Barbuda
	['1264', 'AI', 'AIA'], // Anguilla
	['1246', 'BB', 'BRB'], // Barbados
	['1242', 'BS', 'BHS'], // Bahamas
	['998', 'UZ', 'UZB'], // Uzbekistan
	['996', 'KG', 'KGZ'], // Kyrgyzstan
	['995', 'GE', 'GEO'], // Georgia
	['994', 'AZ', 'AZE'], // Azerbaijan
	['993', 'TM', 'TKM'], // Turkmenistan
	['992', 'TJ', 'TJK'], // Tajikistan
	['977', 'NP', 'NPL'], // Nepal
	['976', 'MN', 'MNG'], // Mongolia
	['975', 'BT', 'BTN'], // Bhutan
	['974', 'QA', 'QAT'], // Qatar
	['973', 'BH', 'BHR'], // Bahrain
	['972', 'IL', 'ISR'], // Israel
	['971', 'AE', 'ARE'], // United Arab Emirates
	['970', 'PS', 'PSE'], // Palestine
	['968', 'OM', 'OMN'], // Oman
	['967', 'YE', 'YEM'], // Yemen
	['966', 'SA', 'SAU'], // Saudi Arabia
	['965', 'KW', 'KWT'], // Kuwait
	['964', 'IQ', 'IRQ'], // Iraq
	['963', 'SY', 'SYR'], // Syria
	['962', 'JO', 'JOR'], // Jordan
	['961', 'LB', 'LBN'], // Lebanon
	['960', 'MV', 'MDV'], // Maldives
	['886', 'TW', 'TWN'], // Taiwan
	['880', 'BD', 'BGD'], // Bangladesh
	['856', 'LA', 'LAO'], // Laos
	['855', 'KH', 'KHM'], // Cambodia
	['853', 'MO', 'MAC'], // Macau
	['852', 'HK', 'HKG'], // Hong Kong
	['850', 'KP', 'PRK'], // North Korea
	['692', 'MH', 'MHL'], // Marshall Islands
	['691', 'FM', 'FSM'], // Micronesia
	['690', 'TK', 'TKL'], // Tokelau
	['689', 'PF', 'PYF'], // French Polynesia
	['688', 'TV', 'TUV'], // Tuvalu
	['687', 'NC', 'NCL'], // New Caledonia
	['686', 'KI', 'KIR'], // Kiribati
	['685', 'WS', 'WSM'], // Samoa
	['683', 'NU', 'NIU'], // Niue
	['682', 'CK', 'COK'], // Cook Islands
	['681', 'WF', 'WLF'], // Wallis and Futuna
	['680', 'PW', 'PLW'], // Palau
	['679', 'FJ', 'FJI'], // Fiji
	['678', 'VU', 'VUT'], // Vanuatu
	['677', 'SB', 'SLB'], // Solomon Islands
	['676', 'TO', 'TON'], // Tonga
	['675', 'PG', 'PNG'], // Papua New Guinea
	['674', 'NR', 'NRU'], // Nauru
	['673', 'BN', 'BRN'], // Brunei
	['672', 'AQ', 'ATA'], // Antarctica
	['670', 'TL', 'TLS'], // East Timor
	['599', 'CW', 'CUW'], // Curacao
	['599', 'AN', 'ANT'], // Netherlands Antilles
	['598', 'UY', 'URY'], // Uruguay
	['597', 'SR', 'SUR'], // Suriname
	['595', 'PY', 'PRY'], // Paraguay
	['593', 'EC', 'ECU'], // Ecuador
	['592', 'GY', 'GUY'], // Guyana
	['591', 'BO', 'BOL'], // Bolivia
	['590', 'MF', 'MAF'], // Saint Martin
	['590', 'BL', 'BLM'], // Saint Barthelemy
	['509', 'HT', 'HTI'], // Haiti
	['508', 'PM', 'SPM'], // Saint Pierre and Miquelon
	['507', 'PA', 'PAN'], // Panama
	['506', 'CR', 'CRI'], // Costa Rica
	['505', 'NI', 'NIC'], // Nicaragua
	['504', 'HN', 'HND'], // Honduras
	['503', 'SV', 'SLV'], // El Salvador
	['502', 'GT', 'GTM'], // Guatemala
	['501', 'BZ', 'BLZ'], // Belize
	['500', 'FK', 'FLK'], // Falkland Islands
	['423', 'LI', 'LIE'], // Liechtenstein
	['421', 'SK', 'SVK'], // Slovakia
	['420', 'CZ', 'CZE'], // Czech Republic
	['389', 'MK', 'MKD'], // Macedonia
	['387', 'BA', 'BIH'], // Bosnia and Herzegovina
	['386', 'SI', 'SVN'], // Slovenia
	['385', 'HR', 'HRV'], // Croatia
	['383', 'XK', 'XKX'], // Kosovo
	['382', 'ME', 'MNE'], // Montenegro
	['381', 'RS', 'SRB'], // Serbia
	['380', 'UA', 'UKR'], // Ukraine
	['379', 'VA', 'VAT'], // Vatican
	['378', 'SM', 'SMR'], // San Marino
	['377', 'MC', 'MCO'], // Monaco
	['376', 'AD', 'AND'], // Andorra
	['375', 'BY', 'BLR'], // Belarus
	['374', 'AM', 'ARM'], // Armenia
	['373', 'MD', 'MDA'], // Moldova
	['372', 'EE', 'EST'], // Estonia
	['371', 'LV', 'LVA'], // Latvia
	['370', 'LT', 'LTU'], // Lithuania
	['359', 'BG', 'BGR'], // Bulgaria
	['358', 'FI', 'FIN'], // Finland
	['357', 'CY', 'CYP'], // Cyprus
	['356', 'MT', 'MLT'], // Malta
	['355', 'AL', 'ALB'], // Albania
	['354', 'IS', 'ISL'], // Iceland
	['353', 'IE', 'IRL'], // Ireland
	['352', 'LU', 'LUX'], // Luxembourg
	['351', 'PT', 'PRT'], // Portugal
	['350', 'GI', 'GIB'], // Gibraltar
	['299', 'GL', 'GRL'], // Greenland
	['298', 'FO', 'FRO'], // Faroe Islands
	['297', 'AW', 'ABW'], // Aruba
	['291', 'ER', 'ERI'], // Eritrea
	['290', 'SH', 'SHN'], // Saint Helena
	['269', 'KM', 'COM'], // Comoros
	['268', 'SZ', 'SWZ'], // Swaziland
	['267', 'BW', 'BWA'], // Botswana
	['266', 'LS', 'LSO'], // Lesotho
	['265', 'MW', 'MWI'], // Malawi
	['264', 'NA', 'NAM'], // Namibia
	['263', 'ZW', 'ZWE'], // Zimbabwe
	['262', 'RE', 'REU'], // Reunion
	['262', 'YT', 'MYT'], // Mayotte
	['261', 'MG', 'MDG'], // Madagascar
	['260', 'ZM', 'ZMB'], // Zambia
	['258', 'MZ', 'MOZ'], // Mozambique
	['257', 'BI', 'BDI'], // Burundi
	['256', 'UG', 'UGA'], // Uganda
	['255', 'TZ', 'TZA'], // Tanzania
	['254', 'KE', 'KEN'], // Kenya
	['253', 'DJ', 'DJI'], // Djibouti
	['252', 'SO', 'SOM'], // Somalia
	['251', 'ET', 'ETH'], // Ethiopia
	['250', 'RW', 'RWA'], // Rwanda
	['249', 'SD', 'SDN'], // Sudan
	['248', 'SC', 'SYC'], // Seychelles
	['246', 'IO', 'IOT'], // British Indian Ocean Territory
	['245', 'GW', 'GNB'], // Guinea-Bissau
	['244', 'AO', 'AGO'], // Angola
	['243', 'CD', 'COD'], // Democratic Republic of the Congo
	['242', 'CG', 'COG'], // Republic of the Congo
	['241', 'GA', 'GAB'], // Gabon
	['240', 'GQ', 'GNQ'], // Equatorial Guinea
	['239', 'ST', 'STP'], // Sao Tome and Principe
	['238', 'CV', 'CPV'], // Cape Verde
	['237', 'CM', 'CMR'], // Cameroon
	['236', 'CF', 'CAF'], // Central African Republic
	['235', 'TD', 'TCD'], // Chad
	['234', 'NG', 'NGA'], // Nigeria
	['233', 'GH', 'GHA'], // Ghana
	['232', 'SL', 'SLE'], // Sierra Leone
	['231', 'LR', 'LBR'], // Liberia
	['230', 'MU', 'MUS'], // Mauritius
	['229', 'BJ', 'BEN'], // Benin
	['228', 'TG', 'TGO'], // Togo
	['227', 'NE', 'NER'], // Niger
	['226', 'BF', 'BFA'], // Burkina Faso
	['225', 'CI', 'CIV'], // Ivory Coast
	['224', 'GN', 'GIN'], // Guinea
	['223', 'ML', 'MLI'], // Mali
	['222', 'MR', 'MRT'], // Mauritania
	['221', 'SN', 'SEN'], // Senegal
	['220', 'GM', 'GMB'], // Gambia
	['218', 'LY', 'LBY'], // Libya
	['216', 'TN', 'TUN'], // Tunisia
	['213', 'DZ', 'DZA'], // Algeria
	['212', 'MA', 'MAR'], // Morocco
	['212', 'EH', 'ESH'], // Western Sahara
	['211', 'SS', 'SSD'], // South Sudan
	['98', 'IR', 'IRN'], // Iran
	['95', 'MM', 'MMR'], // Myanmar
	['94', 'LK', 'LKA'], // Sri Lanka
	['93', 'AF', 'AFG'], // Afghanistan
	['92', 'PK', 'PAK'], // Pakistan
	['91', 'IN', 'IND'], // India
	['90', 'TR', 'TUR'], // Turkey
	['86', 'CN', 'CHN'], // China
	['84', 'VN', 'VNM'], // Vietnam
	['82', 'KR', 'KOR'], // South Korea
	['81', 'JP', 'JPN'], // Japan
	['66', 'TH', 'THA'], // Thailand
	['65', 'SG', 'SGP'], // Singapore
	['64', 'NZ', 'NZL'], // New Zealand
	['64', 'PN', 'PCN'], // Pitcairn
	['63', 'PH', 'PHL'], // Philippines
	['62', 'ID', 'IDN'], // Indonesia
	['61', 'CX', 'CXR'], // Christmas Island
	['61', 'CC', 'CCK'], // Cocos Islands
	['61', 'AU', 'AUS'], // Australia
	['60', 'MY', 'MYS'], // Malaysia
	['58', 'VE', 'VEN'], // Venezuela
	['57', 'CO', 'COL'], // Colombia
	['56', 'CL', 'CHL'], // Chile
	['55', 'BR', 'BRA'], // Brazil
	['54', 'AR', 'ARG'], // Argentina
	['53', 'CU', 'CUB'], // Cuba
	['52', 'MX', 'MEX'], // Mexico
	['51', 'PE', 'PER'], // Peru
	['49', 'DE', 'DEU'], // Germany
	['48', 'PL', 'POL'], // Poland
	['47', 'SJ', 'SJM'], // Svalbard and Jan Mayen
	['47', 'NO', 'NOR'], // Norway
	['46', 'SE', 'SWE'], // Sweden
	['45', 'DK', 'DNK'], // Denmark
	['44', 'GB', 'GBR'], // United Kingdom
	['43', 'AT', 'AUT'], // Austria
	['41', 'CH', 'CHE'], // Switzerland
	['40', 'RO', 'ROU'], // Romania
	['39', 'IT', 'ITA'], // Italy
	['36', 'HU', 'HUN'], // Hungary
	['34', 'ES', 'ESP'], // Spain
	['33', 'FR', 'FRA'], // France
	['32', 'BE', 'BEL'], // Belgium
	['31', 'NL', 'NLD'], // Netherlands
	['30', 'GR', 'GRC'], // Greece
	['27', 'ZA', 'ZAF'], // South Africa
	['20', 'EG', 'EGY'], // Egypt
	['7', 'RU', 'RUS'], // Russia
	['7', 'KZ', 'KAZ'], // Kazakhstan
	['1', 'US', 'USA'], // United States
	['1', 'CA', 'CAN'] // Canada
]

// This data was requested for making an international
// phone number input with country selector.
//
// https://github.com/halt-hammerzeit/react-phone-number-input/pull/1
//
// data.split('\n').map(row =>
// {
// 	const digit_index = row.search(/\d/)
// 	const country_name = row.slice(0, digit_index).trim()
//
// 	row = row.slice(digit_index)
//
// 	const letter_index = row.search(/[A-z]/)
// 	const phone_codes = row.slice(0, letter_index).trim()
// 		.split(', ')
// 		.map(code => code.replace(/[^0-9](.*)/g, ''))
//
// 	row = row.slice(letter_index)
//
// 	const parts = row.split(/\s/)
//
// 	row =
// 	{
// 		country      : parts[0],
// 		country_3    : parts[2],
// 		codes        : phone_codes,
// 		country_name : country_name
// 	}
//
// 	return row
// })
// .reduce((total, row) =>
// {
// 	return total.concat(row.codes.map(code =>
// 	({
// 		code,
// 		country      : row.country,
// 		country_3    : row.country_3,
// 		country_name : row.country_name
// 	})))
// },
// [])
// .sort((a, b) => a.country.localeCompare(b.country))
// .map(row => `\t['${row.country}', '${row.country_3}', '${row.code}'], // ${row.country_name}`)
// .join('\n')
//
export const country_codes =
[
	['AD', 'AND', '376'], // Andorra
	['AE', 'ARE', '971'], // United Arab Emirates
	['AF', 'AFG', '93'], // Afghanistan
	['AG', 'ATG', '1'], // Antigua and Barbuda
	['AI', 'AIA', '1'], // Anguilla
	['AL', 'ALB', '355'], // Albania
	['AM', 'ARM', '374'], // Armenia
	['AN', 'ANT', '599'], // Netherlands Antilles
	['AO', 'AGO', '244'], // Angola
	['AQ', 'ATA', '672'], // Antarctica
	['AR', 'ARG', '54'], // Argentina
	['AS', 'ASM', '1'], // American Samoa
	['AT', 'AUT', '43'], // Austria
	['AU', 'AUS', '61'], // Australia
	['AW', 'ABW', '297'], // Aruba
	['AZ', 'AZE', '994'], // Azerbaijan
	['BA', 'BIH', '387'], // Bosnia and Herzegovina
	['BB', 'BRB', '1'], // Barbados
	['BD', 'BGD', '880'], // Bangladesh
	['BE', 'BEL', '32'], // Belgium
	['BF', 'BFA', '226'], // Burkina Faso
	['BG', 'BGR', '359'], // Bulgaria
	['BH', 'BHR', '973'], // Bahrain
	['BI', 'BDI', '257'], // Burundi
	['BJ', 'BEN', '229'], // Benin
	['BL', 'BLM', '590'], // Saint Barthelemy
	['BM', 'BMU', '1'], // Bermuda
	['BN', 'BRN', '673'], // Brunei
	['BO', 'BOL', '591'], // Bolivia
	['BR', 'BRA', '55'], // Brazil
	['BS', 'BHS', '1'], // Bahamas
	['BT', 'BTN', '975'], // Bhutan
	['BW', 'BWA', '267'], // Botswana
	['BY', 'BLR', '375'], // Belarus
	['BZ', 'BLZ', '501'], // Belize
	['CA', 'CAN', '1'], // Canada
	['CC', 'CCK', '61'], // Cocos Islands
	['CD', 'COD', '243'], // Democratic Republic of the Congo
	['CF', 'CAF', '236'], // Central African Republic
	['CG', 'COG', '242'], // Republic of the Congo
	['CH', 'CHE', '41'], // Switzerland
	['CI', 'CIV', '225'], // Ivory Coast
	['CK', 'COK', '682'], // Cook Islands
	['CL', 'CHL', '56'], // Chile
	['CM', 'CMR', '237'], // Cameroon
	['CN', 'CHN', '86'], // China
	['CO', 'COL', '57'], // Colombia
	['CR', 'CRI', '506'], // Costa Rica
	['CU', 'CUB', '53'], // Cuba
	['CV', 'CPV', '238'], // Cape Verde
	['CW', 'CUW', '599'], // Curacao
	['CX', 'CXR', '61'], // Christmas Island
	['CY', 'CYP', '357'], // Cyprus
	['CZ', 'CZE', '420'], // Czech Republic
	['DE', 'DEU', '49'], // Germany
	['DJ', 'DJI', '253'], // Djibouti
	['DK', 'DNK', '45'], // Denmark
	['DM', 'DMA', '1'], // Dominica
	['DO', 'DOM', '1'], // Dominican Republic
	['DO', 'DOM', '1'], // Dominican Republic
	['DO', 'DOM', '1'], // Dominican Republic
	['DZ', 'DZA', '213'], // Algeria
	['EC', 'ECU', '593'], // Ecuador
	['EE', 'EST', '372'], // Estonia
	['EG', 'EGY', '20'], // Egypt
	['EH', 'ESH', '212'], // Western Sahara
	['ER', 'ERI', '291'], // Eritrea
	['ES', 'ESP', '34'], // Spain
	['ET', 'ETH', '251'], // Ethiopia
	['FI', 'FIN', '358'], // Finland
	['FJ', 'FJI', '679'], // Fiji
	['FK', 'FLK', '500'], // Falkland Islands
	['FM', 'FSM', '691'], // Micronesia
	['FO', 'FRO', '298'], // Faroe Islands
	['FR', 'FRA', '33'], // France
	['GA', 'GAB', '241'], // Gabon
	['GB', 'GBR', '44'], // United Kingdom
	['GD', 'GRD', '1'], // Grenada
	['GE', 'GEO', '995'], // Georgia
	['GG', 'GGY', '44'], // Guernsey
	['GH', 'GHA', '233'], // Ghana
	['GI', 'GIB', '350'], // Gibraltar
	['GL', 'GRL', '299'], // Greenland
	['GM', 'GMB', '220'], // Gambia
	['GN', 'GIN', '224'], // Guinea
	['GQ', 'GNQ', '240'], // Equatorial Guinea
	['GR', 'GRC', '30'], // Greece
	['GT', 'GTM', '502'], // Guatemala
	['GU', 'GUM', '1'], // Guam
	['GW', 'GNB', '245'], // Guinea-Bissau
	['GY', 'GUY', '592'], // Guyana
	['HK', 'HKG', '852'], // Hong Kong
	['HN', 'HND', '504'], // Honduras
	['HR', 'HRV', '385'], // Croatia
	['HT', 'HTI', '509'], // Haiti
	['HU', 'HUN', '36'], // Hungary
	['ID', 'IDN', '62'], // Indonesia
	['IE', 'IRL', '353'], // Ireland
	['IL', 'ISR', '972'], // Israel
	['IM', 'IMN', '44'], // Isle of Man
	['IN', 'IND', '91'], // India
	['IO', 'IOT', '246'], // British Indian Ocean Territory
	['IQ', 'IRQ', '964'], // Iraq
	['IR', 'IRN', '98'], // Iran
	['IS', 'ISL', '354'], // Iceland
	['IT', 'ITA', '39'], // Italy
	['JE', 'JEY', '44'], // Jersey
	['JM', 'JAM', '1'], // Jamaica
	['JO', 'JOR', '962'], // Jordan
	['JP', 'JPN', '81'], // Japan
	['KE', 'KEN', '254'], // Kenya
	['KG', 'KGZ', '996'], // Kyrgyzstan
	['KH', 'KHM', '855'], // Cambodia
	['KI', 'KIR', '686'], // Kiribati
	['KM', 'COM', '269'], // Comoros
	['KN', 'KNA', '1'], // Saint Kitts and Nevis
	['KP', 'PRK', '850'], // North Korea
	['KR', 'KOR', '82'], // South Korea
	['KW', 'KWT', '965'], // Kuwait
	['KY', 'CYM', '1'], // Cayman Islands
	['KZ', 'KAZ', '7'], // Kazakhstan
	['LA', 'LAO', '856'], // Laos
	['LB', 'LBN', '961'], // Lebanon
	['LC', 'LCA', '1'], // Saint Lucia
	['LI', 'LIE', '423'], // Liechtenstein
	['LK', 'LKA', '94'], // Sri Lanka
	['LR', 'LBR', '231'], // Liberia
	['LS', 'LSO', '266'], // Lesotho
	['LT', 'LTU', '370'], // Lithuania
	['LU', 'LUX', '352'], // Luxembourg
	['LV', 'LVA', '371'], // Latvia
	['LY', 'LBY', '218'], // Libya
	['MA', 'MAR', '212'], // Morocco
	['MC', 'MCO', '377'], // Monaco
	['MD', 'MDA', '373'], // Moldova
	['ME', 'MNE', '382'], // Montenegro
	['MF', 'MAF', '590'], // Saint Martin
	['MG', 'MDG', '261'], // Madagascar
	['MH', 'MHL', '692'], // Marshall Islands
	['MK', 'MKD', '389'], // Macedonia
	['ML', 'MLI', '223'], // Mali
	['MM', 'MMR', '95'], // Myanmar
	['MN', 'MNG', '976'], // Mongolia
	['MO', 'MAC', '853'], // Macau
	['MP', 'MNP', '1'], // Northern Mariana Islands
	['MR', 'MRT', '222'], // Mauritania
	['MS', 'MSR', '1'], // Montserrat
	['MT', 'MLT', '356'], // Malta
	['MU', 'MUS', '230'], // Mauritius
	['MV', 'MDV', '960'], // Maldives
	['MW', 'MWI', '265'], // Malawi
	['MX', 'MEX', '52'], // Mexico
	['MY', 'MYS', '60'], // Malaysia
	['MZ', 'MOZ', '258'], // Mozambique
	['NA', 'NAM', '264'], // Namibia
	['NC', 'NCL', '687'], // New Caledonia
	['NE', 'NER', '227'], // Niger
	['NG', 'NGA', '234'], // Nigeria
	['NI', 'NIC', '505'], // Nicaragua
	['NL', 'NLD', '31'], // Netherlands
	['NO', 'NOR', '47'], // Norway
	['NP', 'NPL', '977'], // Nepal
	['NR', 'NRU', '674'], // Nauru
	['NU', 'NIU', '683'], // Niue
	['NZ', 'NZL', '64'], // New Zealand
	['OM', 'OMN', '968'], // Oman
	['PA', 'PAN', '507'], // Panama
	['PE', 'PER', '51'], // Peru
	['PF', 'PYF', '689'], // French Polynesia
	['PG', 'PNG', '675'], // Papua New Guinea
	['PH', 'PHL', '63'], // Philippines
	['PK', 'PAK', '92'], // Pakistan
	['PL', 'POL', '48'], // Poland
	['PM', 'SPM', '508'], // Saint Pierre and Miquelon
	['PN', 'PCN', '64'], // Pitcairn
	['PR', 'PRI', '1'], // Puerto Rico
	['PR', 'PRI', '1'], // Puerto Rico
	['PS', 'PSE', '970'], // Palestine
	['PT', 'PRT', '351'], // Portugal
	['PW', 'PLW', '680'], // Palau
	['PY', 'PRY', '595'], // Paraguay
	['QA', 'QAT', '974'], // Qatar
	['RE', 'REU', '262'], // Reunion
	['RO', 'ROU', '40'], // Romania
	['RS', 'SRB', '381'], // Serbia
	['RU', 'RUS', '7'], // Russia
	['RW', 'RWA', '250'], // Rwanda
	['SA', 'SAU', '966'], // Saudi Arabia
	['SB', 'SLB', '677'], // Solomon Islands
	['SC', 'SYC', '248'], // Seychelles
	['SD', 'SDN', '249'], // Sudan
	['SE', 'SWE', '46'], // Sweden
	['SG', 'SGP', '65'], // Singapore
	['SH', 'SHN', '290'], // Saint Helena
	['SI', 'SVN', '386'], // Slovenia
	['SJ', 'SJM', '47'], // Svalbard and Jan Mayen
	['SK', 'SVK', '421'], // Slovakia
	['SL', 'SLE', '232'], // Sierra Leone
	['SM', 'SMR', '378'], // San Marino
	['SN', 'SEN', '221'], // Senegal
	['SO', 'SOM', '252'], // Somalia
	['SR', 'SUR', '597'], // Suriname
	['SS', 'SSD', '211'], // South Sudan
	['ST', 'STP', '239'], // Sao Tome and Principe
	['SV', 'SLV', '503'], // El Salvador
	['SX', 'SXM', '1'], // Sint Maarten
	['SY', 'SYR', '963'], // Syria
	['SZ', 'SWZ', '268'], // Swaziland
	['TC', 'TCA', '1'], // Turks and Caicos Islands
	['TD', 'TCD', '235'], // Chad
	['TG', 'TGO', '228'], // Togo
	['TH', 'THA', '66'], // Thailand
	['TJ', 'TJK', '992'], // Tajikistan
	['TK', 'TKL', '690'], // Tokelau
	['TL', 'TLS', '670'], // East Timor
	['TM', 'TKM', '993'], // Turkmenistan
	['TN', 'TUN', '216'], // Tunisia
	['TO', 'TON', '676'], // Tonga
	['TR', 'TUR', '90'], // Turkey
	['TT', 'TTO', '1'], // Trinidad and Tobago
	['TV', 'TUV', '688'], // Tuvalu
	['TW', 'TWN', '886'], // Taiwan
	['TZ', 'TZA', '255'], // Tanzania
	['UA', 'UKR', '380'], // Ukraine
	['UG', 'UGA', '256'], // Uganda
	['US', 'USA', '1'], // United States
	['UY', 'URY', '598'], // Uruguay
	['UZ', 'UZB', '998'], // Uzbekistan
	['VA', 'VAT', '379'], // Vatican
	['VC', 'VCT', '1'], // Saint Vincent and the Grenadines
	['VE', 'VEN', '58'], // Venezuela
	['VG', 'VGB', '1'], // British Virgin Islands
	['VI', 'VIR', '1'], // U.S. Virgin Islands
	['VN', 'VNM', '84'], // Vietnam
	['VU', 'VUT', '678'], // Vanuatu
	['WF', 'WLF', '681'], // Wallis and Futuna
	['WS', 'WSM', '685'], // Samoa
	['XK', 'XKX', '383'], // Kosovo
	['YE', 'YEM', '967'], // Yemen
	['YT', 'MYT', '262'], // Mayotte
	['ZA', 'ZAF', '27'], // South Africa
	['ZM', 'ZMB', '260'], // Zambia
	['ZW', 'ZWE', '263'] // Zimbabwe"
]

// Derives an ISO 3166-1 country code
// from a plaintext international phone number.
//
// E.g. '+79991234567' -> 'RU'
//      '+19991234567' -> 'US'
//     '+447700900431' -> 'UK'
//
export default function country(phone)
{
	// Sanity check
	if (!phone)
	{
		return
	}

	// Must be an international plaintext phone number
	if (phone[0] !== '+')
	{
		return
	}

	// Trim the '+' sign
	phone = phone.slice('+'.length)

	// Find the longest matching prefix
	for (let country_phone_prefix of country_phone_prefixes)
	{
		if (starts_with(phone, country_phone_prefix[0]))
		{
			// This country code is most likely (like 99.99999999% likely)
			// the country code intended for this
			// currently possibly incomplete phone number,
			// so don't look for possible future ambiguity,
			// and just return this country code.
			// (see the note in the beginning of this file)
			return country_phone_prefix[1]
		}
	}
}

// Derives an ISO 3166-1 country code from locale.
// Locale format: [language[_territory][.codeset][@modifier]]
//
// E.g. "ru-RU"       -> "RU"
//      "zh-Hans-HK"  -> "HK"
//      "en"          -> `undefined`
//
export function country_from_locale(locale)
{
	// Sanity check
	if (!locale)
	{
		return
	}

	const last_dash_index = locale.lastIndexOf('-')
	if (last_dash_index <= 0)
	{
		return
	}

	return locale.slice(last_dash_index + 1)
}