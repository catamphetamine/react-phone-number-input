'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.country_codes = undefined;

var _getIterator2 = require('babel-runtime/core-js/get-iterator');

var _getIterator3 = _interopRequireDefault(_getIterator2);

exports.default = country;
exports.country_from_locale = country_from_locale;

var _helpers = require('./helpers');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
var country_codes = exports.country_codes = [['441624', 'IM', 'IMN'], // Isle of Man
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
];

// Derives an ISO 3166-1 country code
// from a plaintext international phone number.
//
// E.g. '+79991234567' -> 'RU'
//      '+19991234567' -> 'US'
//     '+447700900431' -> 'UK'
//
function country(phone) {
	// Sanity check
	if (!phone) {
		return;
	}

	// Must be an international plaintext phone number
	if (phone[0] !== '+') {
		return;
	}

	// Trim the '+' sign
	phone = phone.slice('+'.length);

	// Find the longest matching prefix
	var _iteratorNormalCompletion = true;
	var _didIteratorError = false;
	var _iteratorError = undefined;

	try {
		for (var _iterator = (0, _getIterator3.default)(country_codes), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
			var country_code = _step.value;

			if ((0, _helpers.starts_with)(phone, country_code[0])) {
				return country_code[1];
			}
		}
	} catch (err) {
		_didIteratorError = true;
		_iteratorError = err;
	} finally {
		try {
			if (!_iteratorNormalCompletion && _iterator.return) {
				_iterator.return();
			}
		} finally {
			if (_didIteratorError) {
				throw _iteratorError;
			}
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
function country_from_locale(locale) {
	// Sanity check
	if (!locale) {
		return;
	}

	var last_dash_index = locale.lastIndexOf('-');
	if (last_dash_index <= 0) {
		return;
	}

	return locale.slice(last_dash_index + 1);
}
//# sourceMappingURL=country.js.map