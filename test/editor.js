import formats from '../source/formats'
import edit from '../source/editor'

describe(`editor`, function()
{
	it(`should edit inputted phone (delete)`, function()
	{
		edit('(9  )', 0, formats.RU, { delete: true }).should.deep.equal({ phone: '', caret: 0 })

		edit('  999 ) 123 45 -67 ', 0, formats.RU, { delete: true }).should.deep.equal({ phone: '(991) 234-56-7', caret: 1 })
		edit(' (999 ) 123 45 -67 ', 1, formats.RU, { delete: true }).should.deep.equal({ phone: '(991) 234-56-7', caret: 1 })
		edit(' (999 ) 123 45 -67 ', 2, formats.RU, { delete: true }).should.deep.equal({ phone: '(991) 234-56-7', caret: 1 })
		edit(' (999 ) 123 45 -67 ', 3, formats.RU, { delete: true }).should.deep.equal({ phone: '(991) 234-56-7', caret: 2 })
		edit(' (999 ) 123 45 -67 ', 4, formats.RU, { delete: true }).should.deep.equal({ phone: '(991) 234-56-7', caret: 3 })
		edit(' (999 ) 123 45 -67 ', 5, formats.RU, { delete: true }).should.deep.equal({ phone: '(999) 234-56-7', caret: 6 })
		edit(' (999 ) 123 45 -67 ', 6, formats.RU, { delete: true }).should.deep.equal({ phone: '(999) 234-56-7', caret: 6 })
		edit(' (999 ) 123 45 -67 ', 7, formats.RU, { delete: true }).should.deep.equal({ phone: '(999) 234-56-7', caret: 6 })
		edit(' (999 ) 123 45 -67 ', 8, formats.RU, { delete: true }).should.deep.equal({ phone: '(999) 234-56-7', caret: 6 })
		edit(' (999 ) 123 45 -67 ', 9, formats.RU, { delete: true }).should.deep.equal({ phone: '(999) 134-56-7', caret: 7 })
		edit(' (999 ) 123 45 -67 ', 10, formats.RU, { delete: true }).should.deep.equal({ phone: '(999) 124-56-7', caret: 8 })
		edit(' (999 ) 123 45 -67 ', 11, formats.RU, { delete: true }).should.deep.equal({ phone: '(999) 123-56-7', caret: 10 })
		edit(' (999 ) 123 45 -67 ', 12, formats.RU, { delete: true }).should.deep.equal({ phone: '(999) 123-56-7', caret: 10 })
		edit(' (999 ) 123 45 -67 ', 13, formats.RU, { delete: true }).should.deep.equal({ phone: '(999) 123-46-7', caret: 11 })
		edit(' (999 ) 123 45 -67 ', 14, formats.RU, { delete: true }).should.deep.equal({ phone: '(999) 123-45-7', caret: 13 })
		edit(' (999 ) 123 45 -67 ', 15, formats.RU, { delete: true }).should.deep.equal({ phone: '(999) 123-45-7', caret: 13 })
		edit(' (999 ) 123 45 -67 ', 16, formats.RU, { delete: true }).should.deep.equal({ phone: '(999) 123-45-7', caret: 13 })
		edit(' (999 ) 123 45 -67 ', 17, formats.RU, { delete: true }).should.deep.equal({ phone: '(999) 123-45-6', caret: 14 })
		edit(' (999 ) 123 45 -67 ', 18, formats.RU, { delete: true }).should.deep.equal({ phone: '(999) 123-45-67', caret: 15 })
		edit(' (999 ) 123 45 -67 ', 19, formats.RU, { delete: true }).should.deep.equal({ phone: '(999) 123-45-67', caret: 15 })
	})

	it(`should edit inputted phone (backspace)`, function()
	{
		edit('(9  )', 2, formats.RU, { backspace: true }).should.deep.equal({ phone: '', caret: 0 })

		edit('  999 ) 123 45 -67 ', 0, formats.RU, { backspace: true }).should.deep.equal({ phone: '(999) 123-45-67', caret: 1 })
		edit(' (999 ) 123 45 -67 ', 1, formats.RU, { backspace: true }).should.deep.equal({ phone: '(999) 123-45-67', caret: 1 })
		edit(' (999 ) 123 45 -67 ', 2, formats.RU, { backspace: true }).should.deep.equal({ phone: '(999) 123-45-67', caret: 1 })
		edit(' (999 ) 123 45 -67 ', 3, formats.RU, { backspace: true }).should.deep.equal({ phone: '(991) 234-56-7', caret: 1 })
		edit(' (999 ) 123 45 -67 ', 4, formats.RU, { backspace: true }).should.deep.equal({ phone: '(991) 234-56-7', caret: 2 })
		edit(' (999 ) 123 45 -67 ', 5, formats.RU, { backspace: true }).should.deep.equal({ phone: '(991) 234-56-7', caret: 3 })
		edit(' (999 ) 123 45 -67 ', 6, formats.RU, { backspace: true }).should.deep.equal({ phone: '(991) 234-56-7', caret: 3 })
		edit(' (999 ) 123 45 -67 ', 7, formats.RU, { backspace: true }).should.deep.equal({ phone: '(991) 234-56-7', caret: 3 })
		edit(' (999 ) 123 45 -67 ', 8, formats.RU, { backspace: true }).should.deep.equal({ phone: '(991) 234-56-7', caret: 3 })
		edit(' (999 ) 123 45 -67 ', 9, formats.RU, { backspace: true }).should.deep.equal({ phone: '(999) 234-56-7', caret: 6 })
		edit(' (999 ) 123 45 -67 ', 10, formats.RU, { backspace: true }).should.deep.equal({ phone: '(999) 134-56-7', caret: 7 })
		edit(' (999 ) 123 45 -67 ', 11, formats.RU, { backspace: true }).should.deep.equal({ phone: '(999) 124-56-7', caret: 8 })
		edit(' (999 ) 123 45 -67 ', 12, formats.RU, { backspace: true }).should.deep.equal({ phone: '(999) 124-56-7', caret: 8 })
		edit(' (999 ) 123 45 -67 ', 13, formats.RU, { backspace: true }).should.deep.equal({ phone: '(999) 123-56-7', caret: 10 })
		edit(' (999 ) 123 45 -67 ', 14, formats.RU, { backspace: true }).should.deep.equal({ phone: '(999) 123-46-7', caret: 11 })
		edit(' (999 ) 123 45 -67 ', 15, formats.RU, { backspace: true }).should.deep.equal({ phone: '(999) 123-46-7', caret: 11 })
		edit(' (999 ) 123 45 -67 ', 16, formats.RU, { backspace: true }).should.deep.equal({ phone: '(999) 123-46-7', caret: 11 })
		edit(' (999 ) 123 45 -67 ', 17, formats.RU, { backspace: true }).should.deep.equal({ phone: '(999) 123-45-7', caret: 13 })
		edit(' (999 ) 123 45 -67 ', 18, formats.RU, { backspace: true }).should.deep.equal({ phone: '(999) 123-45-6', caret: 14 })
		edit(' (999 ) 123 45 -67 ', 19, formats.RU, { backspace: true }).should.deep.equal({ phone: '(999) 123-45-6', caret: 14 })
	})

	it(`should edit inputted phone (selection)`, function()
	{
		edit('  999 ) 123 45 -67 ', 4, formats.RU, { delete: true, selection: { end: 13 } }).should.deep.equal({ phone: '(995) 67', caret: 3 })
		edit('  999 ) 123 45 -67 ', 4, formats.RU, { backspace: true, selection: { end: 13 } }).should.deep.equal({ phone: '(995) 67', caret: 3 })
	})

	it(`should edit inputted phone (symbol)`, function()
	{
		edit(' 999 ) 123 45 -67 ', 2, formats.RU).should.deep.equal({ phone: '(999) 123-45-67', caret: 2 })
		edit(' 999 ) 123 45 -67 ', 3, formats.RU).should.deep.equal({ phone: '(999) 123-45-67', caret: 3 })
		edit(' 999 ) 123 45 -67 ', 4, formats.RU).should.deep.equal({ phone: '(999) 123-45-67', caret: 6 })

		edit(' 999 ) 123 45 -67 ', 8, formats.RU).should.deep.equal({ phone: '(999) 123-45-67', caret: 7 })
		edit(' 999 ) 123 45 -67 ', 9, formats.RU).should.deep.equal({ phone: '(999) 123-45-67', caret: 8 })
		edit(' 999 ) 123 45 -67 ', 10, formats.RU).should.deep.equal({ phone: '(999) 123-45-67', caret: 10 })

		edit(' 999 ) 123 45 -67 ', 12, formats.RU).should.deep.equal({ phone: '(999) 123-45-67', caret: 11 })
		edit(' 999 ) 123 45 -67 ', 13, formats.RU).should.deep.equal({ phone: '(999) 123-45-67', caret: 13 })

		edit(' 999 ) 123 45 -67 ', 16, formats.RU).should.deep.equal({ phone: '(999) 123-45-67', caret: 14 })
		edit(' 999 ) 123 45 -67 ', 17, formats.RU).should.deep.equal({ phone: '(999) 123-45-67', caret: 15 })

		edit(' 999 ) 123 45 -67 890', 20, formats.RU).should.deep.equal({ phone: '(999) 123-45-67', caret: 15 })
	})
})