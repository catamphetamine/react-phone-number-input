import
{
	validate,
	parse_plaintext_international,
	template,
	populate_template,
	local_phone_digits,
	count_digits,
	format,
	derive_phone_number_format,
	digits_in_local_phone_number_template,
	digits_in_international_phone_number_template,
	digit_index,
	index_in_template,
	plaintext_local,
	plaintext_international,
	trim_trunk_prefix,
	add_trunk_prefix,
	trunk_prefix
}
from '../source/phone'

import formats from '../source/formats'

describe(`phone`, function()
{
	it(`should validate phone number`, function()
	{
		validate('+79991234567', formats.RU).should.equal(true)
		validate('+7999123456', formats.RU).should.equal(false)

		validate('+19991234567', formats.US).should.equal(true)
		validate('+1999123456', formats.US).should.equal(false)

		validate('+49011112222221', formats.DE).should.equal(false)
		validate('+4911112222222', formats.DE).should.equal(true)
		validate('+491111122222', formats.DE).should.equal(true)

		validate('+33122222222', formats.FR).should.equal(true)
		validate('+3312222222', formats.FR).should.equal(false)
		validate('+331222222222', formats.FR).should.equal(false)

		validate('+86099912345678', formats.CN).should.equal(false)
		validate('+8699912345678', formats.CN).should.equal(true)
		validate('+869991234567', formats.CN).should.equal(false)
		validate('+8619912345678', formats.CN).should.equal(true)
		validate('+86199123456789', formats.CN).should.equal(false)

		validate('+4402011111111', formats.GB).should.equal(false)
		validate('+442011111111', formats.GB).should.equal(true)
		validate('+44201111111', formats.GB).should.equal(false)
		validate('+4420111111111', formats.GB).should.equal(false)

		validate('+4401011111111', formats.GB).should.equal(false)
		validate('+441011111111', formats.GB).should.equal(true)
		validate('+44101111111', formats.GB).should.equal(false)
		validate('+4410111111111', formats.GB).should.equal(false)

		validate('+4407111111111', formats.GB).should.equal(false)
		validate('+447111111111', formats.GB).should.equal(true)
		validate('+44711111111', formats.GB).should.equal(false)
		validate('+4471111111111', formats.GB).should.equal(false)
	})

	it(`should reduce formatted phone number to plaintext (international)`, function()
	{
		parse_plaintext_international('', formats.RU).should.equal('')
		parse_plaintext_international('(', formats.RU).should.equal('')
		parse_plaintext_international('(9  )', formats.RU).should.equal('+79')
		parse_plaintext_international('(9  )', formats.RU).should.equal('+79')
		parse_plaintext_international('(999) 123-45-67', formats.RU).should.equal('+79991234567')
		parse_plaintext_international('(999) 123-45-6', formats.RU).should.equal('+7999123456')
		parse_plaintext_international('+7 (9  )', formats.RU).should.equal('+79')
		parse_plaintext_international('+7 (999) 123-45-67', formats.RU).should.equal('+79991234567')

		const custom_format = { country: '7', template: () => '8 (xxx) xxx-xx-xx' }

		parse_plaintext_international('', custom_format).should.equal('')
		parse_plaintext_international('(', custom_format).should.equal('')
		parse_plaintext_international('8 (', custom_format).should.equal('')
		parse_plaintext_international('8 (9  )', custom_format).should.equal('+79')
		parse_plaintext_international('+7 (9  )', custom_format).should.equal('+79')
		parse_plaintext_international('+7 (9  )', custom_format).should.equal('+79')
		parse_plaintext_international('+7 (999) 123-45-67', custom_format).should.equal('+79991234567')
		parse_plaintext_international('+7 (999) 123-45-6', custom_format).should.equal('+7999123456')

		// UK
		parse_plaintext_international('(07700) 900756', formats.GB).should.equal('+447700900756')
		parse_plaintext_international('+44 7700 900756', formats.GB).should.equal('+447700900756')
	})

	it(`should return phone template for phone number format`, function()
	{
		template({ template: '8 (xxx) xxx-xx-xx' }).should.equal('8 (xxx) xxx-xx-xx')
		template({ template: () => '8 (xxx) xxx-xx-xx' }).should.equal('8 (xxx) xxx-xx-xx')
		template(formats.US).should.equal('(AAA) BBB-BBBB')
	})

	it(`should populate phone template`, function()
	{
		populate_template('(xxx) xxx-xx-xx', '1').should.equal('(1  )')
		populate_template('(AAA) xxx-xx-xx', '12').should.equal('(12 )')
		populate_template('(xxx) BBB-BB-BB', '123').should.equal('(123)')
		populate_template('(xxx) xAx-xx-Bx', '1234').should.equal('(123) 4')
		populate_template('(xxx) xxx-xx-xx', '12345').should.equal('(123) 45')
		populate_template('(AAA) BBB-BB-BB', '123456').should.equal('(123) 456')
		populate_template('(AAA) xxx-xx-xx', '1234567').should.equal('(123) 456-7')
		populate_template('8 (AAA) xxx-xx-xx', '').should.equal('')
		populate_template('8 (AAA) xxx-xx-xx', '81').should.equal('8 (1  )')
		populate_template('8 (AAA) xxx-xx-xx', '812').should.equal('8 (12 )')
		populate_template('8 (AAA) xxx-xx-xx', '812345678').should.equal('8 (123) 456-78')
		populate_template('(0XXX) xxx-xx-xx', '0123456789').should.equal('(0123) 456-78-9')
		populate_template('(xxx) YYY-YY-YY', '1234567890').should.equal('(123) 456-78-90')
	})

	it(`should parse local phone digits`, function()
	{
		local_phone_digits('', formats.RU).should.equal('')
		local_phone_digits('(9  ) ', formats.RU).should.equal('9')
		local_phone_digits(' ( 9 9  9) 1 23 45  ', formats.RU).should.equal('99912345')
		local_phone_digits('( 999  )  1-2-3-4-5-6  7', formats.RU).should.equal('9991234567')
		local_phone_digits('( 999  )  1-2-3-4-5-6  7 8 9 - 10 ', formats.RU).should.equal('9991234567')

		local_phone_digits('8 (800) 555-35-35', { template: '8 (AAA) BBB-BB-BB' }).should.equal('88005553535')
		local_phone_digits('(07700) 900756', formats.GB).should.equal('07700900756')
	})

	it(`should count digits`, function()
	{
		count_digits('').should.equal(0)
		count_digits('(9  ) ').should.equal(1)
		count_digits(' ( 9 9  9) 1 23 45  ').should.equal(8)
		count_digits('( 999  )  1-2-3-4-5-6  7').should.equal(10)
	})

	it(`should format digits given a format`, function()
	{
		format('', formats.RU).should.equal('')
		format('+79', formats.RU).should.equal('(9  )')
		format('+799', formats.RU).should.equal('(99 )')
		format('999', formats.RU).should.equal('(999)')
		format('+79991', formats.RU).should.equal('(999) 1')
		format('99912', formats.RU).should.equal('(999) 12')
		format('+7999123', formats.RU).should.equal('(999) 123')
		format('+79991234', formats.RU).should.equal('(999) 123-4')
		format('99912345', formats.RU).should.equal('(999) 123-45')
		format('+7999123456', formats.RU).should.equal('(999) 123-45-6')
		format('+79991234567', formats.RU).should.equal('(999) 123-45-67')

		format('9991234567', formats.US).should.equal('(999) 123-4567')
		format('+19991234567', formats.US).should.equal('(999) 123-4567')

		format('+8699912345678', formats.CN).should.equal('(0999) 1234 5678')

      format('07700900756', 'GB').should.equal('07700 900756')
	})

	it(`should format digits given no format`, function()
	{
		format('').should.equal('')
		format('+79').should.equal('+7 9')
		format('+799').should.equal('+7 99')
		format('999').should.equal('999')
		format('+79991').should.equal('+7 999 1')
		format('+799912').should.equal('+7 999 12')
		format('+7999123').should.equal('+7 999 123')
		format('+79991234').should.equal('+7 999 123 4')
		format('+799912345').should.equal('+7 999 123 45')
		format('+7999123456').should.equal('+7 999 123 45 6')
		format('+79991234567').should.equal('+7 999 123 45 67')

		// USA
		format('+19991234567').should.equal('+1 999 123 4567')

		// China
		format('+8699912345678').should.equal('+86 999 1234 5678')

		// UK
		format('+447700900756').should.equal('+44 7700 900756')
	})

	it(`should format without parens`, function()
	{
		const custom_US_format =
		{
			country  : '1',
			template : 'xxx-xxx-xxxx'
		}

		format('9991234567', custom_US_format).should.equal('999-123-4567')
		parse_plaintext_international('999-123-4567', custom_US_format).should.equal('+19991234567')
	})

	it(`should custom format digits`, function()
	{
		const custom_format = { country: '7', template: () => '8 (xxx) xxx-xx-xx' }

		format('', custom_format).should.equal('')
		format('+79', custom_format).should.equal('8 (9  )')
		format('+799', custom_format).should.equal('8 (99 )')
		format('8999', custom_format).should.equal('8 (999)')
		format('+79991', custom_format).should.equal('8 (999) 1')
		format('+799912', custom_format).should.equal('8 (999) 12')
		format('8999123', custom_format).should.equal('8 (999) 123')
		format('+79991234', custom_format).should.equal('8 (999) 123-4')
		format('899912345', custom_format).should.equal('8 (999) 123-45')
		format('+7999123456', custom_format).should.equal('8 (999) 123-45-6')
		format('+79991234567', custom_format).should.equal('8 (999) 123-45-67')
	})

	it(`should count digits in number`, function()
	{
		digits_in_local_phone_number_template({ template: '8 (AAA) xxx-xx-xx' }).should.equal(11)
		digits_in_local_phone_number_template({ template: '(0AA) BBB-BB-BB' }).should.equal(10)

		digits_in_international_phone_number_template({ template: '8 (AAA) xxx-xx-xx' }).should.equal(10)
		digits_in_international_phone_number_template({ template: '(0AA) BBB-BB-BB' }).should.equal(9)
	})

	it(`should calculate digit index`, function()
	{
		digit_index('  0 1 324 (234 ) 435 -11', 0).should.equal(0)
		digit_index('  0 1 324 (234 ) 435 -11', 1).should.equal(0)
		digit_index('  0 1 324 (234 ) 435 -11', 2).should.equal(0)
		digit_index('  0 1 324 (234 ) 435 -11', 3).should.equal(1)
		digit_index('  0 1 324 (234 ) 435 -11', 4).should.equal(1)
		digit_index('  0 1 324 (234 ) 435 -11', 5).should.equal(2)
		digit_index('  0 1 324 (234 ) 435 -11', 6).should.equal(2)
		digit_index('  0 1 324 (234 ) 435 -11', 7).should.equal(3)
		digit_index('  0 1 324 (234 ) 435 -11', 8).should.equal(4)
		digit_index('  0 1 324 (234 ) 435 -11', 9).should.equal(5)
		digit_index('  0 1 324 (234 ) 435 -11', 10).should.equal(5)
		digit_index('  0 1 324 (234 ) 435 -11', 11).should.equal(5)
		digit_index('  0 1 324 (234 ) 435 -11', 12).should.equal(6)
		digit_index('  0 1 324 (234 ) 435 -11', 13).should.equal(7)
		digit_index('  0 1 324 (234 ) 435 -11', 14).should.equal(8)
		digit_index('  0 1 324 (234 ) 435 -11', 15).should.equal(8)
		digit_index('  0 1 324 (234 ) 435 -11', 16).should.equal(8)
		digit_index('  0 1 324 (234 ) 435 -11', 17).should.equal(8)
		digit_index('  0 1 324 (234 ) 435 -11', 18).should.equal(9)
		digit_index('  0 1 324 (234 ) 435 -11', 19).should.equal(10)
		digit_index('  0 1 324 (234 ) 435 -11', 20).should.equal(11)
		digit_index('  0 1 324 (234 ) 435 -11', 21).should.equal(11)
		digit_index('  0 1 324 (234 ) 435 -11', 22).should.equal(11)
		digit_index('  0 1 324 (234 ) 435 -11', 23).should.equal(12)
	})

	it(`should calculate index for digit in template`, function()
	{
		index_in_template(0, formats.RU).should.equal(1)
		index_in_template(1, formats.RU).should.equal(2)
		index_in_template(2, formats.RU).should.equal(3)

		index_in_template(3, formats.RU).should.equal(6)
		index_in_template(4, formats.RU).should.equal(7)
		index_in_template(5, formats.RU).should.equal(8)

		index_in_template(6, formats.RU).should.equal(10)
		index_in_template(7, formats.RU).should.equal(11)

		index_in_template(8, formats.RU).should.equal(13)
		index_in_template(9, formats.RU).should.equal(14)

		// Custom format
		const custom_format = { country: '7', template: () => '8 (xxx) xxx-xx-xx' }

		index_in_template(0, custom_format).should.equal(3)
		index_in_template(1, custom_format).should.equal(4)
		index_in_template(2, custom_format).should.equal(5)
		index_in_template(3, custom_format).should.equal(8)
		index_in_template(4, custom_format).should.equal(9)
	})

	it(`should convert plaintext phone number to plaintext local`, function()
	{
		plaintext_local('', formats.RU).should.equal('')
		plaintext_local('9991234567', formats.RU).should.equal('9991234567')
		plaintext_local('+79991234567', formats.RU).should.equal('9991234567')
		plaintext_local('+447700900756', formats.GB).should.equal('07700900756')
		plaintext_local('07700900756', formats.GB).should.equal('07700900756')
	})

	it(`should convert plaintext phone number to plaintext international`, function()
	{
		plaintext_international('', formats.RU).should.equal('')
		plaintext_international('9991234567', formats.RU).should.equal('+79991234567')
		plaintext_international('+79991234567', formats.RU).should.equal('+79991234567')
		plaintext_international('07700900756', formats.GB).should.equal('+447700900756')
	})

	it(`should derive phone number format from plaintext international`, function()
	{
		derive_phone_number_format('+79991234567').should.equal(formats.RU)
		derive_phone_number_format('+19991234567').should.equal(formats.US)
		derive_phone_number_format('+447700900756').should.equal(formats.GB)
	})

	it(`should trim trunk prefix`, function()
	{
		trim_trunk_prefix('9991234567', formats.US).should.equal('9991234567')
		trim_trunk_prefix('07700900756', formats.GB).should.equal('7700900756')
	})

	it(`should add trunk prefix`, function()
	{
		add_trunk_prefix('9991234567', formats.US).should.equal('9991234567')
		add_trunk_prefix('7700900756', formats.GB).should.equal('07700900756')
	})

	it(`should extract trunk prefix`, function()
	{
		trunk_prefix({ template: '8 (AAA) BBB-BB-BB' }).should.equal('8')
		trunk_prefix({ template: () => '(0AAA) BBBBBBBB' }).should.equal('0')
	})
})

// A telephone number can have a maximum of 15 digits
// The first part of the telephone number is the country code (one to three digits)
// The second part is the national destination code (NDC)
// The last part is the subscriber number (SN)
// The NDC and SN together are collectively called the national (significant) number

// https://www.csoft.co.uk/support/international-phone-number-format
// https://www.cmtelecom.com/newsroom/how-to-format-international-telephone-numbers