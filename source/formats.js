// If a phone number format for your country
// is absent from this list then
// create a Pull Request and it will be merged.
//
// If you think that phone number template
// for your country isn't correct,
// create a Pull Request and it will be merged.
//
// https://en.wikipedia.org/wiki/National_conventions_for_writing_telephone_numbers
//
// `template` can be a string or a function of `digits` returning a string.
// All alphabetic letters in a `template` are replaced with `digits`.
// `template` is for local (inside country) phone number formatting.
// An international template is derived from the local `template`
// by removing parentheses around area code and also removing trunk prefix.
// https://en.wikipedia.org/wiki/Trunk_prefix
//
// https://countrycode.org/
// text.split('\n').map(line => line.split(/\t/)).sort((a, b) => a[2].localeCompare(b[2])).map(parts => `// ${parts[0]}\n// ${parts[2].split(' / ')[1]}:\n// ${parts[2].split(' / ')[0]}:\n// {\n// \tcountry: '${parts[1]}',\n// \ttemplate: '...'\n// },\n`).join('\n')
//
export default
{
	// Andorra
	// AND:
	// AD:
	// {
	// 	country: '376',
	// 	template: '...'
	// },

	// United Arab Emirates
	// ARE:
	AE:
	{
		country: '971',
		template(digits)
		{
			// Special case: 200xxxx
			if (digits.indexOf('200') === 0)
			{
				return 'AAAxxxx'
			}

			// Special case: 600xxxxxx
			if (digits.indexOf('600') === 0)
			{
				return 'AAAxxxxxx'
			}

			// Cell phones
			if (digits.indexOf('05') === 0)
			{
				return 'AAAxxxxxx'
			}

			// Default
			return 'AAxxxxxx'
		}
	},

	// Afghanistan
	// AFG:
	AF:
	{
		country: '93',
		template: '(0xx) yyy-yyyy'
	},

	// Antigua and Barbuda
	// ATG:
	// AG:
	// {
	// 	country: '1-268',
	// 	template: '...'
	// },

	// Anguilla
	// AIA:
	// AI:
	// {
	// 	country: '1-264',
	// 	template: '...'
	// },

	// Albania
	// ALB:
	// AL:
	// {
	// 	country: '355',
	// 	template: '...'
	// },

	// Armenia
	// ARM:
	// AM:
	// {
	// 	country: '374',
	// 	template: '...'
	// },

	// Netherlands Antilles
	// ANT:
	// AN:
	// {
	// 	country: '599',
	// 	template: '...'
	// },

	// Angola
	// AGO:
	// AO:
	// {
	// 	country: '244',
	// 	template: '...'
	// },

	// Antarctica
	// ATA:
	// AQ:
	// {
	// 	country: '672',
	// 	template: '...'
	// },

	// Argentina
	// ARG:
	// AR:
	// {
	// 	country: '54',
	// 	template: '...'
	//    https://en.wikipedia.org/wiki/Telephone_numbers_in_Argentina
	//    "Local landline phone numbers in Argentina can have 6, 7 or 8 digits, depending on where they are located"
	// },

	// American Samoa
	// ASM:
	// AS:
	// {
	// 	country: '1-684',
	// 	template: '...'
	// },

	// Austria
	// AUT:
	// AT:
	// {
	// 	country: '43',
	// 	template: '...'
	//    https://en.wikipedia.org/wiki/Telephone_numbers_in_Austria
	//    "There are no standard lengths for either area codes or subscribers' numbers in Austria, meaning that some subscribers' numbers may be as short as three digits. "
	// },

	// Australia
	// AUS:
	AU:
	{
		country: '61',
		template: 'A xxxx xxxx'
	},

	// Aruba
	// ABW:
	// AW:
	// {
	// 	country: '297',
	// 	template: '...'
	// },

	// Azerbaijan
	// AZE:
	// AZ:
	// {
	// 	country: '994',
	// 	template: '...'
	// },

	// Bosnia and Herzegovina
	// BIH:
	// BA:
	// {
	// 	country: '387',
	// 	template: '...'
	// },

	// Barbados
	// BRB:
	// BB:
	// {
	// 	country: '1-246',
	// 	template: '...'
	// },

	// Bangladesh
	// BGD:
	// BD:
	// {
	// 	country: '880',
	// 	template: '...'
	// },

	// Belgium
	// BEL:
	BE:
	{
		country: '32',
		template: '0x xxx xx xx'
	},

	// Burkina Faso
	// BFA:
	// BF:
	// {
	// 	country: '226',
	// 	template: '...'
	// },

	// Bulgaria
	// BGR:
	BG:
	{
		country: '359',
		template: 'A xxx xxxx'
	},

	// Bahrain
	// BHR:
	// BH:
	// {
	// 	country: '973',
	// 	template: '...'
	// },

	// Burundi
	// BDI:
	// BI:
	// {
	// 	country: '257',
	// 	template: '...'
	// },

	// Benin
	// BEN:
	// BJ:
	// {
	// 	country: '229',
	// 	template: '...'
	// },

	// Saint Barthelemy
	// BLM:
	// BL:
	// {
	// 	country: '590',
	// 	template: '...'
	// },

	// Bermuda
	// BMU:
	// BM:
	// {
	// 	country: '1-441',
	// 	template: '...'
	// },

	// Brunei
	// BRN:
	// BN:
	// {
	// 	country: '673',
	// 	template: '...'
	// },

	// Bolivia
	// BOL:
	// BO:
	// {
	// 	country: '591',
	// 	template: '...'
	// },

	// Brazil
	// BRA:
	BR:
	{
		country: '55',
		template(digits)
		{
			// Landlines
			if (digits[0] >= '2' && digits[0] <= '5')
			{
				return 'xxxx-xxxx'
			}

			// Mobile phones
			if (digits[0] >= '6' && digits[0] <= '9')
			{
				return 'xxxxx-xxxx'
			}

			// Whatever (too complicated)
			// https://en.wikipedia.org/wiki/Telephone_numbers_in_Brazil
			return 'xxxx-xxxx'
		}
	},

	// Bahamas
	// BHS:
	BS:
	{
		country  : '1242',
		template : 'BBB BBBB'
	},

	// Bhutan
	// BTN:
	// BT:
	// {
	// 	country: '975',
	// 	template: '...'
	// },

	// Botswana
	// BWA:
	// BW:
	// {
	// 	country: '267',
	// 	template: '...'
	// },

	// Belarus
	// 8 (12) 345-67-89
	// BLR:
	BY:
	{
		country  : '375',
		template : '(AA) BBB-BB-BB'
	},

	// Belize
	// BLZ:
	// BZ:
	// {
	// 	country: '501',
	// 	template: '...'
	// },

	// Canada
	// CAN:
	CA:
	{
		country: '1',
		template: '1 AAA BBB BBBB'
	},

	// Cocos Islands
	// CCK:
	// CC:
	// {
	// 	country: '61',
	// 	template: '...'
	// },

	// Democratic Republic of the Congo
	// COD:
	// CD:
	// {
	// 	country: '243',
	// 	template: '...'
	// },

	// Central African Republic
	// CAF:
	// CF:
	// {
	// 	country: '236',
	// 	template: '...'
	// },

	// Republic of the Congo
	// COG:
	// CG:
	// {
	// 	country: '242',
	// 	template: '...'
	// },

	// Switzerland
	// 099 123 45 67
	// CHE:
	CH:
	{
		country  : '41',
		template : '0AA BBB BB BB'
	},

	// Ivory Coast
	// CIV:
	// CI:
	// {
	// 	country: '225',
	// 	template: '...'
	// },

	// Cook Islands
	// COK:
	// CK:
	// {
	// 	country: '682',
	// 	template: '...'
	// },

	// Chile
	// CHL:
	// CL:
	// {
	// 	country: '56',
	// 	template: '...'
	// },

	// Cameroon
	// CMR:
	// CM:
	// {
	// 	country: '237',
	// 	template: '...'
	// },

	// China
	// (0999) 1234 5678
	// CHN:
	CN:
	{
		country  : '86',
		template : '(0AAA) BBBB BBBB'
	},

	// Colombia
	// COL:
	// CO:
	// {
	// 	country: '57',
	// 	template: '...'
	// },

	// Costa Rica
	// CRI:
	// CR:
	// {
	// 	country: '506',
	// 	template: '...'
	// },

	// Cuba
	// CUB:
	// CU:
	// {
	// 	country: '53',
	// 	template: '...'
	// },

	// Cape Verde
	// CPV:
	// CV:
	// {
	// 	country: '238',
	// 	template: '...'
	// },

	// Curacao
	// CUW:
	// CW:
	// {
	// 	country: '599',
	// 	template: '...'
	// },

	// Christmas Island
	// CXR:
	// CX:
	// {
	// 	country: '61',
	// 	template: '...'
	// },

	// Cyprus
	// CYP:
	// CY:
	// {
	// 	country: '357',
	// 	template: '...'
	// },

	// Czech Republic
	// CZE:
	CZ:
	{
		country: '420',
		template: 'Axx xxx xxx'
	},

	// Germany
	// (German telephone numbers have no fixed length
	//  for area code and subscriber number)
	// DEU:
	DE:
	{
		country  : '49',
		template(digits)
		{
			if (digits.length <= 10)
			{
				return '(0AA) BBBB-BBBB'
			}
			
			if (digits.length === 11)
			{
				if (digits[0] === '3')
				{
					return '(0AAAAA) BB-BBBB'
				}
			}

			return '(0AAA) BBBB-BBBB'
			// return '(0AAAA) BBB-BBBB'
		}
	},

	// Djibouti
	// DJI:
	// DJ:
	// {
	// 	country: '253',
	// 	template: '...'
	// },

	// Denmark
	// DNK:
	DK:
	{
		country: '45',
		template: 'Ax xx xx xx'
	},

	// Dominica
	// DMA:
	// DM:
	// {
	// 	country: '1-767',
	// 	template: '...'
	// },

	// Dominican Republic
	// DOM:
	// DO:
	// {
	// 	country: '1-809, 1-829, 1-849',
	// 	template: '...'
	// },

	// Algeria
	// DZA:
	// DZ:
	// {
	// 	country: '213',
	// 	template: '...'
	// },

	// Ecuador
	// ECU:
	// EC:
	// {
	// 	country: '593',
	// 	template: '...'
	// },

	// Estonia
	// EST:
	EE:
	{
		country: '372',
		template: 'AAA BBBB'
	},

	// Egypt
	// EGY:
	EG:
	{
		country: '20',
		template: 'AA xxxx xxxx'
	},

	// Western Sahara
	// ESH:
	// EH:
	// {
	// 	country: '212',
	// 	template: '...'
	// },

	// Eritrea
	// ERI:
	// ER:
	// {
	// 	country: '291',
	// 	template: '...'
	// },

	// Spain
	// ESP:
	ES:
	{
		country: '34',
		template: 'ABx xxx xxx'
	},

	// Ethiopia
	// ETH:
	// ET:
	// {
	// 	country: '251',
	// 	template: '...'
	// },

	// Finland
	// FIN:
	FI:
	{
		country: '358',
		template: 'A xxx xxx'
	},

	// Fiji
	// FJI:
	// FJ:
	// {
	// 	country: '679',
	// 	template: '...'
	// },

	// Falkland Islands
	// FLK:
	// FK:
	// {
	// 	country: '500',
	// 	template: '...'
	// },

	// Micronesia
	// FSM:
	// FM:
	// {
	// 	country: '691',
	// 	template: '...'
	// },

	// Faroe Islands
	// FRO:
	// FO:
	// {
	// 	country: '298',
	// 	template: '...'
	// },

	// France
	// FRA:
	FR:
	{
		country  : '33',
		template : '0A BB BB BB BB'
	},

	// Gabon
	// GAB:
	// GA:
	// {
	// 	country: '241',
	// 	template: '...'
	// },

	// United Kingdom
	// 07700 954321
	// GBR:
	GB:
	{
		country : '44',
		template(digits)
		{
			// Codes with the form 02x are followed
			// by 8-digit local numbers and should be
			// written as (02x) AAAA AAAA
			if (digits[0] === '2')
			{
				return '(0xx) AAAA AAAA'
			}

			// Area codes with the form 011x or 01x1 
			// are used for many of the major
			// population centers in the UK, are always
			// followed by 7-digit local numbers and
			// should be written as (01xx) AAA BBBB
			if (digits[0] === '1'
				&& (digits[1] === '1' || digits[2] === '1'))
			{
				return '(0xxx) AAA BBBB'
			}

			// Other area codes have the form 01xxx
			// with 5 or 6 figure local numbers written as
			// (01xxx) AAAAA or (01xxx) AAAAAA;
			// or have the form 01xxxx with 4 or 5
			// figure local numbers written as
			// (01xx xx) AAAA or (01xx xx) AAAAA
			if (digits[0] === 1)
			{
				if (digits.length === '01xxxAAAAA'.length)
				{
					return '(0xxxx) AAAAA'
				}
				if (digits.length === '01xxxAAAAAA'.length)
				{
					return '(0xxxx) AAAAAA'
				}
			}

			// Numbers for mobile phones and pagers are formatted
			// as 07AAA BBBBBB and most other non-geographic numbers
			// are 10 figures in length (excluding trunk digit '0')
			// and formatted as 0AAA BBB BBBB
			if (digits[0] === '7')
			{
				return '0xAAA BBBBBB'
			}

			return '0AAA BBB BBBB'
		}
	},

	// Grenada
	// GRD:
	// GD:
	// {
	// 	country: '1-473',
	// 	template: '...'
	// },

	// Georgia
	// GEO:
	// GE:
	// {
	// 	country: '995',
	// 	template: '...'
	// },

	// Guernsey
	// GGY:
	// GG:
	// {
	// 	country: '44-1481',
	// 	template: '...'
	// },

	// Ghana
	// GHA:
	// GH:
	// {
	// 	country: '233',
	// 	template: '...'
	// },

	// Gibraltar
	// GIB:
	// GI:
	// {
	// 	country: '350',
	// 	template: '...'
	// },

	// Greenland
	// GRL:
	// GL:
	// {
	// 	country: '299',
	// 	template: '...'
	// },

	// Gambia
	// GMB:
	// GM:
	// {
	// 	country: '220',
	// 	template: '...'
	// },

	// Guinea
	// GIN:
	// GN:
	// {
	// 	country: '224',
	// 	template: '...'
	// },

	// Equatorial Guinea
	// GNQ:
	// GQ:
	// {
	// 	country: '240',
	// 	template: '...'
	// },

	// Greece
	// GRC:
	GR:
	{
		country: '30',
		template: 'A xxx xxxx'
	},

	// Guatemala
	// GTM:
	// GT:
	// {
	// 	country: '502',
	// 	template: '...'
	// },

	// Guam
	// GUM:
	// GU:
	// {
	// 	country: '1-671',
	// 	template: '...'
	// },

	// Guinea-Bissau
	// GNB:
	// GW:
	// {
	// 	country: '245',
	// 	template: '...'
	// },

	// Guyana
	// GUY:
	// GY:
	// {
	// 	country: '592',
	// 	template: '...'
	// },

	// Hong Kong
	// HKG:
	HK:
	{
		country: '852',
		template: 'xxxx-xxxx'
	},

	// Honduras
	// HND:
	// HN:
	// {
	// 	country: '504',
	// 	template: '...'
	// },

	// Croatia
	// HRV:
	// HR:
	// {
	// 	country: '385',
	// 	template: '...'
	// },

	// Haiti
	// HTI:
	// HT:
	// {
	// 	country: '509',
	// 	template: '...'
	// },

	// Hungary
	// HUN:
	HU:
	{
		country: '36',
		template: 'A BBB-BBBB.'
	},

	// Indonesia
	// IDN:
	// ID:
	// {
	// 	country: '62',
	// 	template: '...'
	//    "fixed - 7 to 11 digits, including area code; cell phones - 9 to 11 digits, first digit is 8"
	// },

	// Ireland
	// IRL:
	IE:
	{
		country: '353',
		template: '+353 AA BBxxxxx'
	},

	// Israel
	// ISR:
	IL:
	{
		country: '972',
		template: 'A-XXX-XXXX'
	},

	// Isle of Man
	// IMN:
	// IM:
	// {
	// 	country: '44-1624',
	// 	template: '...'
	// },

	// India
	// IND:
	IN:
	{
		country: '91',
		template: 'XXXX-XXXXXX'
	},

	// British Indian Ocean Territory
	// IOT:
	// IO:
	// {
	// 	country: '246',
	// 	template: '...'
	// },

	// Iraq
	// IRQ:
	// IQ:
	// {
	// 	country: '964',
	// 	template: '...'
	//    "fixed - 8 to 9 digits, including area code; cell phones - 10 digits"
	// },

	// Iran
	// IRN:
	IR:
	{
		country: '98',
		template: 'AAA-BBBBBBBB'
	},

	// Iceland
	// ISL:
	IS:
	{
		country: '354',
		template: 'xxx xxxx'
	},

	// Italy
	// ITA:
	// IT:
	// {
	// 	country: '39',
	// 	template: '...'
	//    "fixed - 6 to 10 digits, including area code; cell phones - 10 digits"
	// },

	// Jersey
	// JEY:
	// JE:
	// {
	// 	country: '44-1534',
	// 	template: '...'
	// },

	// Jamaica
	// JAM:
	// JM:
	// {
	// 	country: '1-876',
	// 	template: '...'
	// },

	// Jordan
	// JOR:
	// JO:
	// {
	// 	country: '962',
	// 	template: '...'
	// },

	// Japan
	// JPN:
	JP:
	{
		country: '81',
		template(digits)
		{
			// Mobile phones
			if (digits.indexOf('70') === 0
				|| digits.indexOf('80') === 0
				|| digits.indexOf('90') === 0)
			{
				return '0AA-XXXX-XXXX'
			}

			// Landlines
			return '0AA-XXX-XXXX'
		} 
	},

	// Kenya
	// KEN:
	// KE:
	// {
	// 	country: '254',
	// 	template: '...'
	// },

	// Kyrgyzstan
	// KGZ:
	// KG:
	// {
	// 	country: '996',
	// 	template: '...'
	// },

	// Cambodia
	// KHM:
	// KH:
	// {
	// 	country: '855',
	// 	template: '...'
	// },

	// Kiribati
	// KIR:
	// KI:
	// {
	// 	country: '686',
	// 	template: '...'
	// },

	// Comoros
	// COM:
	// KM:
	// {
	// 	country: '269',
	// 	template: '...'
	// },

	// Saint Kitts and Nevis
	// KNA:
	// KN:
	// {
	// 	country: '1-869',
	// 	template: '...'
	// },

	// North Korea
	// PRK:
	// KP:
	// {
	// 	country: '850',
	// 	template: '...'
	// },

	// South Korea
	// KOR:
	KR:
	{
		country: '82',
		template: 'XX XXXX YYYY'
	},

	// Kuwait
	// KWT:
	// KW:
	// {
	// 	country: '965',
	// 	template: '...'
	// },

	// Cayman Islands
	// CYM:
	// KY:
	// {
	// 	country: '1-345',
	// 	template: '...'
	// },

	// Kazakhstan
	// KAZ:
	KZ:
	{
		country: '7',
		template: 'AAA BBxxxxx'
	},

	// Laos
	// LAO:
	// LA:
	// {
	// 	country: '856',
	// 	template: '...'
	// },

	// Lebanon
	// LBN:
	// LB:
	// {
	// 	country: '961',
	// 	template: '...'
	// },

	// Saint Lucia
	// LCA:
	// LC:
	// {
	// 	country: '1-758',
	// 	template: '...'
	// },

	// Liechtenstein
	// LIE:
	// LI:
	// {
	// 	country: '423',
	// 	template: '...'
	// },

	// Sri Lanka
	// LKA:
	// LK:
	// {
	// 	country: '94',
	// 	template: '...'
	// },

	// Liberia
	// LBR:
	// LR:
	// {
	// 	country: '231',
	// 	template: '...'
	// },

	// Lesotho
	// LSO:
	// LS:
	// {
	// 	country: '266',
	// 	template: '...'
	// },

	// Lithuania
	// LTU:
	// LT:
	// {
	// 	country: '370',
	// 	template: '...'
	// },

	// Luxembourg
	// LUX:
	// LU:
	// {
	// 	country: '352',
	// 	template: '...'
	// },

	// Latvia
	// LVA:
	// LV:
	// {
	// 	country: '371',
	// 	template: '...'
	// },

	// Libya
	// LBY:
	// LY:
	// {
	// 	country: '218',
	// 	template: '...'
	// },

	// Morocco
	// MAR:
	// MA:
	// {
	// 	country: '212',
	// 	template: '...'
	// },

	// Monaco
	// MCO:
	// MC:
	// {
	// 	country: '377',
	// 	template: '...'
	// },

	// Moldova
	// MDA:
	// MD:
	// {
	// 	country: '373',
	// 	template: '...'
	// },

	// Montenegro
	// MNE:
	// ME:
	// {
	// 	country: '382',
	// 	template: '...'
	// },

	// Saint Martin
	// MAF:
	// MF:
	// {
	// 	country: '590',
	// 	template: '...'
	// },

	// Madagascar
	// MDG:
	// MG:
	// {
	// 	country: '261',
	// 	template: '...'
	// },

	// Marshall Islands
	// MHL:
	// MH:
	// {
	// 	country: '692',
	// 	template: '...'
	// },

	// Macedonia
	// MKD:
	// MK:
	// {
	// 	country: '389',
	// 	template: '...'
	// },

	// Mali
	// MLI:
	// ML:
	// {
	// 	country: '223',
	// 	template: '...'
	// },

	// Myanmar
	// MMR:
	// MM:
	// {
	// 	country: '95',
	// 	template: '...'
	// },

	// Mongolia
	// MNG:
	// MN:
	// {
	// 	country: '976',
	// 	template: '...'
	// },

	// Macau
	// MAC:
	// MO:
	// {
	// 	country: '853',
	// 	template: '...'
	// },

	// Northern Mariana Islands
	// MNP:
	// MP:
	// {
	// 	country: '1-670',
	// 	template: '...'
	// },

	// Mauritania
	// MRT:
	// MR:
	// {
	// 	country: '222',
	// 	template: '...'
	// },

	// Montserrat
	// MSR:
	// MS:
	// {
	// 	country: '1-664',
	// 	template: '...'
	// },

	// Malta
	// MLT:
	// MT:
	// {
	// 	country: '356',
	// 	template: '...'
	// },

	// Mauritius
	// MUS:
	// MU:
	// {
	// 	country: '230',
	// 	template: '...'
	// },

	// Maldives
	// MDV:
	// MV:
	// {
	// 	country: '960',
	// 	template: '...'
	// },

	// Malawi
	// MWI:
	// MW:
	// {
	// 	country: '265',
	// 	template: '...'
	// },

	// Mexico
	// MEX:
	MX:
	{
		country: '52',
		template: 'AA BBBB BBBB'
	},

	// Malaysia
	// MYS:
	// MY:
	// {
	// 	country: '60',
	// 	template: '...'
	//    "fixed - 8 and 9 digits, area code included; cell phones - 9 and 10 digits"
	// },

	// Mozambique
	// MOZ:
	// MZ:
	// {
	// 	country: '258',
	// 	template: '...'
	// },

	// Namibia
	// NAM:
	// NA:
	// {
	// 	country: '264',
	// 	template: '...'
	// },

	// New Caledonia
	// NCL:
	// NC:
	// {
	// 	country: '687',
	// 	template: '...'
	// },

	// Niger
	// NER:
	// NE:
	// {
	// 	country: '227',
	// 	template: '...'
	// },

	// Nigeria
	// NGA:
	// NG:
	// {
	// 	country: '234',
	// 	template: '...'
	// },

	// Nicaragua
	// NIC:
	// NI:
	// {
	// 	country: '505',
	// 	template: '...'
	// },

	// Netherlands
	// NLD:
	NL:
	{
		country: '31',
		template: 'AA BBB BBBB'
	},

	// Norway
	// NOR:
	NO:
	{
		country: '47',
		template: 'xxxx xxxx'
	},

	// Nepal
	// NPL:
	// NP:
	// {
	// 	country: '977',
	// 	template: '...'
	// },

	// Nauru
	// NRU:
	// NR:
	// {
	// 	country: '674',
	// 	template: '...'
	// },

	// Niue
	// NIU:
	// NU:
	// {
	// 	country: '683',
	// 	template: '...'
	// },

	// New Zealand
	// NZL:
	// NZ:
	// {
	// 	country: '64',
	// 	template: '...'
	// },

	// Oman
	// OMN:
	// OM:
	// {
	// 	country: '968',
	// 	template: '...'
	// },

	// Panama
	// PAN:
	// PA:
	// {
	// 	country: '507',
	// 	template: '...'
	// },

	// Peru
	// PER:
	// PE:
	// {
	// 	country: '51',
	// 	template: '...'
	// },

	// French Polynesia
	// PYF:
	// PF:
	// {
	// 	country: '689',
	// 	template: '...'
	// },

	// Papua New Guinea
	// PNG:
	// PG:
	// {
	// 	country: '675',
	// 	template: '...'
	// },

	// Philippines
	// PHL:
	// PH:
	// {
	// 	country: '63',
	// 	template: '...'
	//    "fixed - 8 or 9 digits, area code included; cell phones - 10 digits"
	// },

	// Pakistan
	// PAK:
	// PK:
	// {
	// 	country: '92',
	// 	template: '...'
	// },

	// Poland
	// POL:
	PL:
	{
		country: '48',
		template: 'AA BBB BBBB'
	},

	// Saint Pierre and Miquelon
	// SPM:
	// PM:
	// {
	// 	country: '508',
	// 	template: '...'
	// },

	// Pitcairn
	// PCN:
	// PN:
	// {
	// 	country: '64',
	// 	template: '...'
	// },

	// Puerto Rico
	// PRI:
	// PR:
	PR:
	{
		country: '1',
		template: '(AAA) BBB-BBBB',
		valid(digits)
		{
			return digits.length === 10 && (digits.indexOf('787') === 0 || digits.indexOf('939') === 0)
		}
	},

	// Palestine
	// PSE:
	// PS:
	// {
	// 	country: '970',
	// 	template: '...'
	// },

	// Portugal
	// PRT:
	PT:
	{
		country: '351',
		template: 'A BBBB BBBB'
	},

	// Palau
	// PLW:
	// PW:
	// {
	// 	country: '680',
	// 	template: '...'
	// },

	// Paraguay
	// PRY:
	// PY:
	// {
	// 	country: '595',
	// 	template: '...'
	// },

	// Qatar
	// QAT:
	QA:
	{
		country: '974',
		template: 'xxx xxxxx'
	},

	// Reunion
	// REU:
	// RE:
	// {
	// 	country: '262',
	// 	template: '...'
	// },

	// Romania
	// ROU:
	RO:
	{
		country: '40',
		template: 'AA BBB BBBB'
	},

	// Serbia
	// SRB:
	// RS:
	// {
	// 	country: '381',
	// 	template: '...'
	//    "8 or 9 digits, area code included for fixed lines"
	// },

	// Russia
	// 8 (123) 456-78-90, though the `8` trunk prefix is used less and less nowadays
	// RUS:
	RU:
	{
		country  : '7',
		template : '(AAA) BBB-BB-BB'
	},

	// Rwanda
	// RWA:
	// RW:
	// {
	// 	country: '250',
	// 	template: '...'
	// },

	// Saudi Arabia
	// SAU:
	SA:
	{
		country: '966',
		template(digits)
		{
			// Mobile phones
			if (digits.indexOf('05') === 0)
			{
				return 'AA xxx xxxx'
			}

			// Landlines (8 or 9 digits)
			return 'AA xxx xxxx'
		}
	},

	// Solomon Islands
	// SLB:
	// SB:
	// {
	// 	country: '677',
	// 	template: '...'
	// },

	// Seychelles
	// SYC:
	// SC:
	// {
	// 	country: '248',
	// 	template: '...'
	// },

	// Sudan
	// SDN:
	// SD:
	// {
	// 	country: '249',
	// 	template: '...'
	// },

	// Sweden
	// SWE:
	// SE:
	// {
	// 	country: '46',
	// 	template: '...'
	//    "fixed - 7 to 9 digits, area code included; cell phones - 9 digits"
	// },

	// Singapore
	// SGP:
	SG:
	{
		country: '65',
		template: 'xxxx xxxx'
	},

	// Saint Helena
	// SHN:
	// SH:
	// {
	// 	country: '290',
	// 	template: '...'
	// },

	// Slovenia
	// SVN:
	// SI:
	// {
	// 	country: '386',
	// 	template: '...'
	// },

	// Svalbard and Jan Mayen
	// SJM:
	// SJ:
	// {
	// 	country: '47',
	// 	template: '...'
	// },

	// Slovakia
	// SVK:
	// SK:
	// {
	// 	country: '421',
	// 	template: '...'
	// },

	// Sierra Leone
	// SLE:
	// SL:
	// {
	// 	country: '232',
	// 	template: '...'
	// },

	// San Marino
	// SMR:
	// SM:
	// {
	// 	country: '378',
	// 	template: '...'
	// },

	// Senegal
	// SEN:
	// SN:
	// {
	// 	country: '221',
	// 	template: '...'
	// },

	// Somalia
	// SOM:
	// SO:
	// {
	// 	country: '252',
	// 	template: '...'
	// },

	// Suriname
	// SUR:
	// SR:
	// {
	// 	country: '597',
	// 	template: '...'
	// },

	// South Sudan
	// SSD:
	// SS:
	// {
	// 	country: '211',
	// 	template: '...'
	// },

	// Sao Tome and Principe
	// STP:
	// ST:
	// {
	// 	country: '239',
	// 	template: '...'
	// },

	// El Salvador
	// SLV:
	// SV:
	// {
	// 	country: '503',
	// 	template: '...'
	// },

	// Sint Maarten
	// SXM:
	// SX:
	// {
	// 	country: '1-721',
	// 	template: '...'
	// },

	// Syria
	// SYR:
	// SY:
	// {
	// 	country: '963',
	// 	template: '...'
	// },

	// Swaziland
	// SWZ:
	// SZ:
	// {
	// 	country: '268',
	// 	template: '...'
	// },

	// Turks and Caicos Islands
	// TCA:
	// TC:
	// {
	// 	country: '1-649',
	// 	template: '...'
	// },

	// Chad
	// TCD:
	// TD:
	// {
	// 	country: '235',
	// 	template: '...'
	// },

	// Togo
	// TGO:
	// TG:
	// {
	// 	country: '228',
	// 	template: '...'
	// },

	// Thailand
	// THA:
	TH:
	{
		country: '66',
		template(digits)
		{
			// Mobile phones
			if (digits[0] === '8' || digits[0] === '9')
			{
				return 'x-xxxx-xxxx'
			}

			// Landlines
			return 'xxxx-xxxx'
		}
	},

	// Tajikistan
	// TJK:
	// TJ:
	// {
	// 	country: '992',
	// 	template: '...'
	// },

	// Tokelau
	// TKL:
	// TK:
	// {
	// 	country: '690',
	// 	template: '...'
	// },

	// East Timor
	// TLS:
	// TL:
	// {
	// 	country: '670',
	// 	template: '...'
	// },

	// Turkmenistan
	// TKM:
	// TM:
	// {
	// 	country: '993',
	// 	template: '...'
	// },

	// Tunisia
	// TUN:
	// TN:
	// {
	// 	country: '216',
	// 	template: '...'
	// },

	// Tonga
	// TON:
	// TO:
	// {
	// 	country: '676',
	// 	template: '...'
	// },

	// Turkey
	// TUR:
	// TR:
	// {
	// 	country: '90',
	// 	template: '...'
	// },

	// Trinidad and Tobago
	// TTO:
	// TT:
	// {
	// 	country: '1-868',
	// 	template: '...'
	// },

	// Tuvalu
	// TUV:
	// TV:
	// {
	// 	country: '688',
	// 	template: '...'
	// },

	// Taiwan
	// TWN:
	TW:
	{
		country: '886',
		template(digits)
		{
			// Mobile phones
			if (digits[0] === '9')
			{
				return 'Axx xxx xxx'
			}

			// Landlines
			return 'A xxxx xxxx'
		}
	},

	// Tanzania
	// TZA:
	// TZ:
	// {
	// 	country: '255',
	// 	template: '...'
	// },

	// Ukraine
	// 0 (12) 345-67-89
	// UKR:
	UA:
	{
		country  : '380',
		template : '(AA) BBB-BB-BB'
	},

	// Uganda
	// UGA:
	// UG:
	// {
	// 	country: '256',
	// 	template: '...'
	// },

	// United States
	// +1 | (123) 456-7890
	// USA:
	US:
	{
		country  : '1',
		template : '(AAA) BBB-BBBB'
		// template : '1-AAA-BBB-BBBB'
	},

	// Uruguay
	// URY:
	// UY:
	// {
	// 	country: '598',
	// 	template: '...'
	// },

	// Uzbekistan
	// UZB:
	// UZ:
	// {
	// 	country: '998',
	// 	template: '...'
	// },

	// Vatican
	// VAT:
	// VA:
	// {
	// 	country: '379',
	// 	template: '...'
	// },

	// Saint Vincent and the Grenadines
	// VCT:
	// VC:
	// {
	// 	country: '1-784',
	// 	template: '...'
	// },

	// Venezuela
	// VEN:
	// VE:
	// {
	// 	country: '58',
	// 	template: '...'
	// },

	// British Virgin Islands
	// VGB:
	// VG:
	// {
	// 	country: '1-284',
	// 	template: '...'
	// },

	// U.S. Virgin Islands
	// VIR:
	// VI:
	// {
	// 	country: '1-340',
	// 	template: '...'
	// },

	// Vietnam
	// VNM:
	// VN:
	// {
	// 	country: '84',
	// 	template: '...'
	//    "9 to 10 digits, area code included for fixed lines"
	// },

	// Vanuatu
	// VUT:
	// VU:
	// {
	// 	country: '678',
	// 	template: '...'
	// },

	// Wallis and Futuna
	// WLF:
	// WF:
	// {
	// 	country: '681',
	// 	template: '...'
	// },

	// Samoa
	// WSM:
	// WS:
	// {
	// 	country: '685',
	// 	template: '...'
	// },

	// Kosovo
	// XKX:
	// XK:
	// {
	// 	country: '383',
	// 	template: '...'
	// },

	// Yemen
	// YEM:
	// YE:
	// {
	// 	country: '967',
	// 	template: '...'
	// },

	// Mayotte
	// MYT:
	// YT:
	// {
	// 	country: '262',
	// 	template: '...'
	// },

	// South Africa
	// ZAF:
	// ZA:
	// {
	// 	country: '27',
	// 	template: '...'
	// },

	// Zambia
	// ZMB:
	// ZM:
	// {
	// 	country: '260',
	// 	template: '...'
	// },

	// Zimbabwe
	// ZWE:
	// ZW:
	// {
	// 	country: '263',
	// 	template: '...'
	// }
}