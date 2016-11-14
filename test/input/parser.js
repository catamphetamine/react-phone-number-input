import formats from '../../source/formats'
import parse, { phone_number_digits } from '../../source/input/parser'

describe(`formatter`, function()
{
	it(`should extract phone number digits`, function()
	{
		const _phone_number_digits = (text, format) => phone_number_digits(text, format, { has_trunk_prefix: false })

		_phone_number_digits('(123) 456-78-90', formats.RU).should.equal('1234567890')

		// Should cut off excessive digits when `format` is passed
		_phone_number_digits('(123) 456-78-901', formats.RU).should.equal('1234567890')
		// Shouldn't cut off excessive digits when no `format` is passed
		_phone_number_digits('(123) 456-78-901').should.equal('12345678901')
	})

	it(`should parse value and caret position into digits and digit index`, function()
	{
		const _parse = (text, caret_position, format) => parse(text, caret_position, format, { has_trunk_prefix: false })

		_parse('(123) 456-78-90', 0).should.deep.equal({ digits: '1234567890', digit_index: 0 })

		_parse('(123) 456-78-90', 1).should.deep.equal({ digits: '1234567890', digit_index: 0 })
		_parse('(123) 456-78-90', 2).should.deep.equal({ digits: '1234567890', digit_index: 1 })
		_parse('(123) 456-78-90', 3).should.deep.equal({ digits: '1234567890', digit_index: 2 })

		_parse('(123) 456-78-90', 4).should.deep.equal({ digits: '1234567890', digit_index: 3 })
		_parse('(123) 456-78-90', 5).should.deep.equal({ digits: '1234567890', digit_index: 3 })

		_parse('(123) 456-78-90', 6).should.deep.equal({ digits: '1234567890', digit_index: 3 })
		_parse('(123) 456-78-90', 7).should.deep.equal({ digits: '1234567890', digit_index: 4 })
		_parse('(123) 456-78-90', 8).should.deep.equal({ digits: '1234567890', digit_index: 5 })

		_parse('(123) 456-78-90', 9).should.deep.equal({ digits: '1234567890', digit_index: 6 })

		_parse('(123) 456-78-90', 10).should.deep.equal({ digits: '1234567890', digit_index: 6 })
		_parse('(123) 456-78-90', 11).should.deep.equal({ digits: '1234567890', digit_index: 7 })

		_parse('(123) 456-78-90', 12).should.deep.equal({ digits: '1234567890', digit_index: 8 })

		_parse('(123) 456-78-90', 13).should.deep.equal({ digits: '1234567890', digit_index: 8 })
		_parse('(123) 456-78-90', 14).should.deep.equal({ digits: '1234567890', digit_index: 9 })

		_parse('(123) 456-78-90', 15).should.deep.equal({ digits: '1234567890', digit_index: 10 })

		// With phone number format
		_parse('(123) 456-78-90', 12, formats.RU).should.deep.equal({ digits: '1234567890', digit_index: 8 })
		_parse('(123) 456-78-90-123', 12, formats.RU).should.deep.equal({ digits: '1234567890', digit_index: 8 })
		_parse('7700 900756000', 6, formats.GB).should.deep.equal({ digits: '7700900756', digit_index: 5 })
	})
})