import formats from '../../source/formats'
import { edit_and_format, edit_and_parse, parse_value, format_value } from '../../source/input/editable'

describe(`Editable`, function()
{
	it(`should parse value`, function()
	{
		(typeof parse_value('')).should.equal('undefined');
		(typeof parse_value('', formats.RU)).should.equal('undefined');
		parse_value(' (999)  111 -22- 33  123 ', formats.RU).should.equal('+79991112233')
		parse_value('7000111111', formats.GB).should.equal('+447000111111')
		parse_value(' (7) (999)  111 -22- 33  123 ').should.equal('+79991112233123')
	})

	it(`should format value`, function()
	{
		format_value('+79991112233', formats.RU).should.equal('(999) 111-22-33')
		format_value('+79991112233').should.equal('7 999 111 22 33')
		format_value('+7999111223').should.equal('7 999 111 22 3')
		format_value('+799911122334').should.equal('799911122334')

		format_value('+447000111111', formats.GB).should.equal('7000 111111')
	})

	it(`should behave like an iPhone`, function()
	{
		// edit_and_format(operation, input_text, format, caret, selection, options)

		const _edit = (input_text, caret_position) =>
		{
			return edit_and_format(undefined, input_text, undefined, caret_position, undefined)
		}

		// Bahamas
		_edit('', 0).should.deep.equal({ phone: '', caret: 0 })
		_edit('1', 1).should.deep.equal({ phone: '1', caret: 1 })
		_edit('12', 2).should.deep.equal({ phone: '1 2', caret: 3 })
		_edit('124', 3).should.deep.equal({ phone: '1 24', caret: 4 })
		_edit('1242', 4).should.deep.equal({ phone: '1242', caret: 4 })
		_edit('12421', 5).should.deep.equal({ phone: '1242 1', caret: 6 })
		_edit('1242 12', 7).should.deep.equal({ phone: '1242 12', caret: 7 })
		_edit('1242 123', 8).should.deep.equal({ phone: '1242 123', caret: 8 })
		_edit('1242 1234', 9).should.deep.equal({ phone: '1242 123 4', caret: 10 })
		_edit('1242 123 45', 11).should.deep.equal({ phone: '1242 123 45', caret: 11 })
		_edit('1242 123 456', 12).should.deep.equal({ phone: '1242 123 456', caret: 12 })
		_edit('1242 123 4567', 13).should.deep.equal({ phone: '1242 123 4567', caret: 13 })
		_edit('1242 123 45678', 14).should.deep.equal({ phone: '124212345678', caret: 12 })

		// USA
		_edit('1', 1).should.deep.equal({ phone: '1', caret: 1 })
		_edit('12', 2).should.deep.equal({ phone: '1 2', caret: 3 })
		_edit('132', 2).should.deep.equal({ phone: '1 32', caret: 3 })
	})
})