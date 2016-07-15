import { formats, template, digits, count_digits, format, parse_digits, digits_in_number, digit_index, index_in_template, repeat } from '../source/phone'

describe(`phone`, function()
{
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

	it(`should parse phone digits`, function()
	{
		parse_digits('', formats.RU).should.deep.equal({ city: '', number: '' })
		parse_digits('9', formats.RU).should.deep.equal({ city: '9', number: '' })
		parse_digits('99', formats.RU).should.deep.equal({ city: '99', number: '' })
		parse_digits('999', formats.RU).should.deep.equal({ city: '999', number: '' })
		parse_digits('9991', formats.RU).should.deep.equal({ city: '999', number: '1' })
		parse_digits('99912', formats.RU).should.deep.equal({ city: '999', number: '12' })
		parse_digits('999123', formats.RU).should.deep.equal({ city: '999', number: '123' })
		parse_digits('9991234', formats.RU).should.deep.equal({ city: '999', number: '1234' })
		parse_digits('99912345', formats.RU).should.deep.equal({ city: '999', number: '12345' })
		parse_digits('999123456', formats.RU).should.deep.equal({ city: '999', number: '123456' })
		parse_digits('9991234567', formats.RU).should.deep.equal({ city: '999', number: '1234567' })
	})

	it(`should format digits`, function()
	{
		format('', formats.RU).should.equal('')
		format('9', formats.RU).should.equal('(9  ) ')
		format('99', formats.RU).should.equal('(99 ) ')
		format('999', formats.RU).should.equal('(999) ')
		format('9991', formats.RU).should.equal('(999) 1')
		format('99912', formats.RU).should.equal('(999) 12')
		format('999123', formats.RU).should.equal('(999) 123')
		format('9991234', formats.RU).should.equal('(999) 123-4')
		format('99912345', formats.RU).should.equal('(999) 123-45')
		format('999123456', formats.RU).should.equal('(999) 123-45-6')
		format('9991234567', formats.RU).should.equal('(999) 123-45-67')

		format('9991234567', formats.US).should.equal('(999) 123-4567')
	})

	it(`should count digits in number`, function()
	{
		digits_in_number({ city: 3, number: [3, 2, 2] }).should.equal(10)
		digits_in_number({ city: 2, number: [3, 2, 2] }).should.equal(9)
		digits_in_number({ city: 1, number: [2, 4] }).should.equal(7)
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
	})

	it(`should repeat string N times`, function()
	{
		repeat('x', 0).should.equal('')
		repeat('x', 1).should.equal('x')
		repeat('x', 2).should.equal('xx')
		repeat('x', 11).should.equal('xxxxxxxxxxx')
	})
})