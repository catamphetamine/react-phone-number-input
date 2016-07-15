import edit from '../source/editor'

describe(`editor`, function()
{
	it(`should edit inputted phone (delete)`, function()
	{
		const format = { city: 3, number: [3, 2, 2] }

		edit('  999 ) 123 45 -67 ', 0, format, { delete: true }).should.deep.equal({ phone: '(991) 234-56-7', caret: 1 })
		edit(' (999 ) 123 45 -67 ', 1, format, { delete: true }).should.deep.equal({ phone: '(991) 234-56-7', caret: 1 })
		edit(' (999 ) 123 45 -67 ', 2, format, { delete: true }).should.deep.equal({ phone: '(991) 234-56-7', caret: 1 })
		edit(' (999 ) 123 45 -67 ', 3, format, { delete: true }).should.deep.equal({ phone: '(991) 234-56-7', caret: 2 })
		edit(' (999 ) 123 45 -67 ', 4, format, { delete: true }).should.deep.equal({ phone: '(991) 234-56-7', caret: 3 })
		edit(' (999 ) 123 45 -67 ', 5, format, { delete: true }).should.deep.equal({ phone: '(999) 234-56-7', caret: 6 })
		edit(' (999 ) 123 45 -67 ', 6, format, { delete: true }).should.deep.equal({ phone: '(999) 234-56-7', caret: 6 })
		edit(' (999 ) 123 45 -67 ', 7, format, { delete: true }).should.deep.equal({ phone: '(999) 234-56-7', caret: 6 })
		edit(' (999 ) 123 45 -67 ', 8, format, { delete: true }).should.deep.equal({ phone: '(999) 234-56-7', caret: 6 })
		edit(' (999 ) 123 45 -67 ', 9, format, { delete: true }).should.deep.equal({ phone: '(999) 134-56-7', caret: 7 })
		edit(' (999 ) 123 45 -67 ', 10, format, { delete: true }).should.deep.equal({ phone: '(999) 124-56-7', caret: 8 })
		edit(' (999 ) 123 45 -67 ', 11, format, { delete: true }).should.deep.equal({ phone: '(999) 123-56-7', caret: 10 })
		edit(' (999 ) 123 45 -67 ', 12, format, { delete: true }).should.deep.equal({ phone: '(999) 123-56-7', caret: 10 })
		edit(' (999 ) 123 45 -67 ', 13, format, { delete: true }).should.deep.equal({ phone: '(999) 123-46-7', caret: 11 })
		edit(' (999 ) 123 45 -67 ', 14, format, { delete: true }).should.deep.equal({ phone: '(999) 123-45-7', caret: 13 })
		edit(' (999 ) 123 45 -67 ', 15, format, { delete: true }).should.deep.equal({ phone: '(999) 123-45-7', caret: 13 })
		edit(' (999 ) 123 45 -67 ', 16, format, { delete: true }).should.deep.equal({ phone: '(999) 123-45-7', caret: 13 })
		edit(' (999 ) 123 45 -67 ', 17, format, { delete: true }).should.deep.equal({ phone: '(999) 123-45-6', caret: 14 })
		edit(' (999 ) 123 45 -67 ', 18, format, { delete: true }).should.deep.equal({ phone: '(999) 123-45-67', caret: 15 })
		edit(' (999 ) 123 45 -67 ', 19, format, { delete: true }).should.deep.equal({ phone: '(999) 123-45-67', caret: 15 })
	})

	it(`should edit inputted phone (backspace)`, function()
	{
		const format = { city: 3, number: [3, 2, 2] }

		edit('  999 ) 123 45 -67 ', 0, format, { backspace: true }).should.deep.equal({ phone: '(999) 123-45-67', caret: 1 })
		edit(' (999 ) 123 45 -67 ', 1, format, { backspace: true }).should.deep.equal({ phone: '(999) 123-45-67', caret: 1 })
		edit(' (999 ) 123 45 -67 ', 2, format, { backspace: true }).should.deep.equal({ phone: '(999) 123-45-67', caret: 1 })
		edit(' (999 ) 123 45 -67 ', 3, format, { backspace: true }).should.deep.equal({ phone: '(991) 234-56-7', caret: 1 })
		edit(' (999 ) 123 45 -67 ', 4, format, { backspace: true }).should.deep.equal({ phone: '(991) 234-56-7', caret: 2 })
		edit(' (999 ) 123 45 -67 ', 5, format, { backspace: true }).should.deep.equal({ phone: '(991) 234-56-7', caret: 3 })
		edit(' (999 ) 123 45 -67 ', 6, format, { backspace: true }).should.deep.equal({ phone: '(991) 234-56-7', caret: 3 })
		edit(' (999 ) 123 45 -67 ', 7, format, { backspace: true }).should.deep.equal({ phone: '(991) 234-56-7', caret: 3 })
		edit(' (999 ) 123 45 -67 ', 8, format, { backspace: true }).should.deep.equal({ phone: '(991) 234-56-7', caret: 3 })
		edit(' (999 ) 123 45 -67 ', 9, format, { backspace: true }).should.deep.equal({ phone: '(999) 234-56-7', caret: 6 })
		edit(' (999 ) 123 45 -67 ', 10, format, { backspace: true }).should.deep.equal({ phone: '(999) 134-56-7', caret: 7 })
		edit(' (999 ) 123 45 -67 ', 11, format, { backspace: true }).should.deep.equal({ phone: '(999) 124-56-7', caret: 8 })
		edit(' (999 ) 123 45 -67 ', 12, format, { backspace: true }).should.deep.equal({ phone: '(999) 124-56-7', caret: 8 })
		edit(' (999 ) 123 45 -67 ', 13, format, { backspace: true }).should.deep.equal({ phone: '(999) 123-56-7', caret: 10 })
		edit(' (999 ) 123 45 -67 ', 14, format, { backspace: true }).should.deep.equal({ phone: '(999) 123-46-7', caret: 11 })
		edit(' (999 ) 123 45 -67 ', 15, format, { backspace: true }).should.deep.equal({ phone: '(999) 123-46-7', caret: 11 })
		edit(' (999 ) 123 45 -67 ', 16, format, { backspace: true }).should.deep.equal({ phone: '(999) 123-46-7', caret: 11 })
		edit(' (999 ) 123 45 -67 ', 17, format, { backspace: true }).should.deep.equal({ phone: '(999) 123-45-7', caret: 13 })
		edit(' (999 ) 123 45 -67 ', 18, format, { backspace: true }).should.deep.equal({ phone: '(999) 123-45-6', caret: 14 })
		edit(' (999 ) 123 45 -67 ', 19, format, { backspace: true }).should.deep.equal({ phone: '(999) 123-45-6', caret: 14 })
	})

	it(`should edit inputted phone (selection)`, function()
	{
		const format = { city: 3, number: [3, 2, 2] }

		edit('  999 ) 123 45 -67 ', 0, format, { delete: true, selection: { start: 4, end: 13 } }).should.deep.equal({ phone: '(995) 67', caret: 3 })
		edit('  999 ) 123 45 -67 ', 0, format, { backspace: true, selection: { start: 4, end: 13 } }).should.deep.equal({ phone: '(995) 67', caret: 3 })
	})

	it(`should edit inputted phone (symbol)`, function()
	{
		const format = { city: 3, number: [3, 2, 2] }

		edit(' 999 ) 123 45 -67 ', 2, format).should.deep.equal({ phone: '(999) 123-45-67', caret: 2 })
		edit(' 999 ) 123 45 -67 ', 3, format).should.deep.equal({ phone: '(999) 123-45-67', caret: 3 })
		edit(' 999 ) 123 45 -67 ', 4, format).should.deep.equal({ phone: '(999) 123-45-67', caret: 6 })

		edit(' 999 ) 123 45 -67 ', 8, format).should.deep.equal({ phone: '(999) 123-45-67', caret: 7 })
		edit(' 999 ) 123 45 -67 ', 9, format).should.deep.equal({ phone: '(999) 123-45-67', caret: 8 })
		edit(' 999 ) 123 45 -67 ', 10, format).should.deep.equal({ phone: '(999) 123-45-67', caret: 10 })

		edit(' 999 ) 123 45 -67 ', 12, format).should.deep.equal({ phone: '(999) 123-45-67', caret: 11 })
		edit(' 999 ) 123 45 -67 ', 13, format).should.deep.equal({ phone: '(999) 123-45-67', caret: 13 })

		edit(' 999 ) 123 45 -67 ', 16, format).should.deep.equal({ phone: '(999) 123-45-67', caret: 14 })
		edit(' 999 ) 123 45 -67 ', 17, format).should.deep.equal({ phone: '(999) 123-45-67', caret: 15 })

		edit(' 999 ) 123 45 -67 890', 20, format).should.deep.equal({ phone: '(999) 123-45-67', caret: 15 })
	})
})