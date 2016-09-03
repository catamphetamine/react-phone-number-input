import
{
	formats,
	validate,
	plaintext_international,
	template,
	populate_template,
	digits,
	count_digits,
	format,
	digits_in_number,
	digit_index,
	index_in_template,
	repeat
}
from '../source/phone'

const custom_format =
{
	template(digits)
	{
		return '+x (xxx) xxx-xx-xx'
	}
}

describe(`phone`, function()
{
	it(`should validate phone number`, function()
	{
		validate('+79991234567', formats.RU).should.equal(true)
		validate('+7999123456', formats.RU).should.equal(false)
	})

	it(`should reduce formatted phone number to plaintext (international)`, function()
	{
		plaintext_international('', formats.RU).should.equal('')
		plaintext_international('(', formats.RU).should.equal('')
		plaintext_international('(9  )', formats.RU).should.equal('+79')
		plaintext_international('(9  )', formats.RU).should.equal('+79')
		plaintext_international('(999) 123-45-67', formats.RU).should.equal('+79991234567')
		plaintext_international('(999) 123-45-6', formats.RU).should.equal('+7999123456')

		plaintext_international('', custom_format).should.equal('')
		plaintext_international('(', custom_format).should.equal('')
		plaintext_international('+7 (9  )', custom_format).should.equal('+79')
		plaintext_international('+7 (9  )', custom_format).should.equal('+79')
		plaintext_international('+7 (999) 123-45-67', custom_format).should.equal('+79991234567')
		plaintext_international('+7 (999) 123-45-6', custom_format).should.equal('+7999123456')
	})

	it(`should generate phone template`, function()
	{
		// Russia
		template(formats.RU).should.equal('(xxx) xxx-xx-xx')

		// Ukraine
		template(formats.UA).should.equal('(xx) xxx-xx-xx')

		// Belarus
		template(formats.BY).should.equal('(xx) xxx-xx-xx')

		// USA
		template(formats.US).should.equal('(xxx) xxx-xxxx')
	})

	it(`should populate phone template`, function()
	{
		populate_template('(xxx) xxx-xx-xx', '1').should.equal('(1  )')
		populate_template('(xxx) xxx-xx-xx', '12').should.equal('(12 )')
		populate_template('(xxx) xxx-xx-xx', '123').should.equal('(123)')
		populate_template('(xxx) xxx-xx-xx', '1234').should.equal('(123) 4')
		populate_template('(xxx) xxx-xx-xx', '12345').should.equal('(123) 45')
		populate_template('(xxx) xxx-xx-xx', '123456').should.equal('(123) 456')
		populate_template('(xxx) xxx-xx-xx', '1234567').should.equal('(123) 456-7')
		populate_template('(xxx) xxx-xx-xx', '12345678').should.equal('(123) 456-78')
		populate_template('(xxx) xxx-xx-xx', '123456789').should.equal('(123) 456-78-9')
		populate_template('(xxx) xxx-xx-xx', '1234567890').should.equal('(123) 456-78-90')
	})

	it(`should parse raw digits`, function()
	{
		digits('', formats.RU).should.equal('')
		digits('(9  ) ', formats.RU).should.equal('9')
		digits(' ( 9 9  9) 1 23 45  ', formats.RU).should.equal('99912345')
		digits('( 999  )  1-2-3-4-5-6  7', formats.RU).should.equal('9991234567')
		digits('( 999  )  1-2-3-4-5-6  7 8 9 - 10 ', formats.RU).should.equal('9991234567')
	})

	it(`should count digits`, function()
	{
		count_digits('').should.equal(0)
		count_digits('(9  ) ').should.equal(1)
		count_digits(' ( 9 9  9) 1 23 45  ').should.equal(8)
		count_digits('( 999  )  1-2-3-4-5-6  7').should.equal(10)
	})

	it(`should format digits`, function()
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
	})

	it(`should format without parens and hyphens`, function()
	{
		const custom_US_format =
		{
			country  : '1',
			template : 'xxx-xxx-xxxx'
		}

		format('9991234567', custom_US_format).should.equal('999-123-4567')
		plaintext_international('999-123-4567', custom_US_format).should.equal('+19991234567')
	})

	it(`should custom format digits`, function()
	{
		format('', custom_format).should.equal('')
		format('+79', custom_format).should.equal('+7 (9  )')
		format('+799', custom_format).should.equal('+7 (99 )')
		format('7999', custom_format).should.equal('+7 (999)')
		format('+79991', custom_format).should.equal('+7 (999) 1')
		format('+799912', custom_format).should.equal('+7 (999) 12')
		format('7999123', custom_format).should.equal('+7 (999) 123')
		format('+79991234', custom_format).should.equal('+7 (999) 123-4')
		format('799912345', custom_format).should.equal('+7 (999) 123-45')
		format('+7999123456', custom_format).should.equal('+7 (999) 123-45-6')
		format('+79991234567', custom_format).should.equal('+7 (999) 123-45-67')
	})

	it(`should count digits in number`, function()
	{
		digits_in_number({ country: '7', template: '(xxx) xxx-xx-xx' }).should.equal(10)
		digits_in_number({ country: '380', template: '(xx) xxx-xx-xx' }).should.equal(9)
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
		index_in_template(0, custom_format).should.equal(1)
		index_in_template(1, custom_format).should.equal(4)
		index_in_template(2, custom_format).should.equal(5)
		index_in_template(3, custom_format).should.equal(6)
		index_in_template(4, custom_format).should.equal(9)
	})

	it(`should repeat string N times`, function()
	{
		repeat('x', 0).should.equal('')
		repeat('x', 1).should.equal('x')
		repeat('x', 2).should.equal('xx')
		repeat('x', 11).should.equal('xxxxxxxxxxx')
	})
})