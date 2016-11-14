// If a phone number format for your country
// is absent from this list then
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
export default
{
	// Bahamas
	BS:
	{
		country  : '1242',
		template : 'BBB BBBB'
	},

	// Belarus
	// 8 (12) 345-67-89
	BY:
	{
		country  : '375',
		template : '(AA) BBB-BB-BB'
	},

	// Switzerland
	// 099 123 45 67
	CH:
	{
		country  : '41',
		template : '0AA BBB BB BB'
	},

	// China
	// (0999) 1234 5678
	CN:
	{
		country  : '86',
		template : '(0AAA) BBBB BBBB'
	},

	// Germany
	// (German telephone numbers have no fixed length
	//  for area code and subscriber number)
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

	// France
	// 0A BB BB BB BB
	FR:
	{
		country  : '33',
		template : '0A BB BB BB BB'
	},

	// United Kingdom
	// 07700 954321
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

	// Puerto Rico
	PR:
	{
		country: '1',
		template: '(AAA) BBB-BBBB',
		valid(digits)
		{
			return digits.length === 10 && (digits.indexOf('787') === 0 || digits.indexOf('939') === 0)
		}
	},

	// Russia
	// 8 (123) 456-78-90
	RU:
	{
		country  : '7',
		template : '(AAA) BBB-BB-BB'
	},

	// Ukraine
	// 0 (12) 345-67-89
	UA:
	{
		country  : '380',
		template : '(AA) BBB-BB-BB'
	},

	// United States of America
	// +1 | (123) 456-7890
	US:
	{
		country  : '1',
		template : '(AAA) BBB-BBBB'
		// template : '1-AAA-BBB-BBBB'
	}
}