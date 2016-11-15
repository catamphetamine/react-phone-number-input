import formats from '../../source/formats'
import format, { get_caret_position_for_digit } from '../../source/input/formatter'

describe(`formatter`, function()
{
	it(`should get caret position for digit`, function()
	{
		const caret_position_for_digit = (digit_index) =>
		{
			return get_caret_position_for_digit
			(
				digit_index,
				formats.RU,
				'1234567890',
				{ has_trunk_prefix: false, international: false }
			)
		}

		caret_position_for_digit(0).should.equal(1)
		caret_position_for_digit(1).should.equal(2)
		caret_position_for_digit(2).should.equal(3)

		caret_position_for_digit(3).should.equal(6)
		caret_position_for_digit(4).should.equal(7)
		caret_position_for_digit(5).should.equal(8)

		caret_position_for_digit(6).should.equal(10)
		caret_position_for_digit(7).should.equal(11)

		caret_position_for_digit(8).should.equal(13)
		caret_position_for_digit(9).should.equal(14)

		// Digit out of the phone number format range:
		// should position the caret after the last existent digit.
		caret_position_for_digit(12, '1234567890123', formats.RU).should.equal(15)
	})

	it(`should format the value according to phone number format (and adjust the caret)`, function()
	{
		const _format = (digits, digit_index, phone_number_format) => format(digits, digit_index, phone_number_format, { has_trunk_prefix: false })

		_format('123456', 4, formats.RU).should.deep.equal({ phone: '(123) 456', caret: 7 })
		_format('123456', 6, formats.RU).should.deep.equal({ phone: '(123) 456', caret: 9 })

		_format('123456', 4).should.deep.equal({ phone: '123456', caret: 4 })
		_format('123456', 6).should.deep.equal({ phone: '123456', caret: 6 })

		_format('770095432', 9, formats.GB).should.deep.equal({ phone: '7700 95432', caret: 10 })
	})

	it(`should format the value according to phone number format (and adjust the caret) (international)`, function()
	{
		const _format = (digits, digit_index) => format(digits, digit_index, formats.RU, { has_trunk_prefix: false, international: true })

		_format('123456', 0).should.deep.equal({ phone: '7 123 456', caret: 2 })
		_format('123456', 4).should.deep.equal({ phone: '7 123 456', caret: 7 })
		_format('123456', 6).should.deep.equal({ phone: '7 123 456', caret: 9 })
	})
})