import formats from '../../source/formats'
import edit from '../../source/input/editor'
import { derive_phone_number_format } from '../../source/phone'

describe(`editor`, function()
{
	it(`should edit inputted phone (delete)`, function()
	{
		edit('(9  )', 0, formats.RU, 'Delete').should.deep.equal({ digits: '', digit_index: 0 })

		edit('  999 ) 123 45 -67 ', 0, formats.RU, 'Delete').should.deep.equal({ digits: '991234567', digit_index: 0 })
		edit(' (999 ) 123 45 -67 ', 1, formats.RU, 'Delete').should.deep.equal({ digits: '991234567', digit_index: 0 })
		edit(' (999 ) 123 45 -67 ', 2, formats.RU, 'Delete').should.deep.equal({ digits: '991234567', digit_index: 0 })
		edit(' (999 ) 123 45 -67 ', 3, formats.RU, 'Delete').should.deep.equal({ digits: '991234567', digit_index: 1 })
		edit(' (999 ) 123 45 -67 ', 4, formats.RU, 'Delete').should.deep.equal({ digits: '991234567', digit_index: 2 })
		edit(' (999 ) 123 45 -67 ', 5, formats.RU, 'Delete').should.deep.equal({ digits: '999234567', digit_index: 3 })
		edit(' (999 ) 123 45 -67 ', 6, formats.RU, 'Delete').should.deep.equal({ digits: '999234567', digit_index: 3 })
		edit(' (999 ) 123 45 -67 ', 7, formats.RU, 'Delete').should.deep.equal({ digits: '999234567', digit_index: 3 })
		edit(' (999 ) 123 45 -67 ', 8, formats.RU, 'Delete').should.deep.equal({ digits: '999234567', digit_index: 3 })
		edit(' (999 ) 123 45 -67 ', 9, formats.RU, 'Delete').should.deep.equal({ digits: '999134567', digit_index: 4 })
		edit(' (999 ) 123 45 -67 ', 10, formats.RU, 'Delete').should.deep.equal({ digits: '999124567', digit_index: 5 })
		edit(' (999 ) 123 45 -67 ', 11, formats.RU, 'Delete').should.deep.equal({ digits: '999123567', digit_index: 6 })
		edit(' (999 ) 123 45 -67 ', 12, formats.RU, 'Delete').should.deep.equal({ digits: '999123567', digit_index: 6 })
		edit(' (999 ) 123 45 -67 ', 13, formats.RU, 'Delete').should.deep.equal({ digits: '999123467', digit_index: 7 })
		edit(' (999 ) 123 45 -67 ', 14, formats.RU, 'Delete').should.deep.equal({ digits: '999123457', digit_index: 8 })
		edit(' (999 ) 123 45 -67 ', 15, formats.RU, 'Delete').should.deep.equal({ digits: '999123457', digit_index: 8 })
		edit(' (999 ) 123 45 -67 ', 16, formats.RU, 'Delete').should.deep.equal({ digits: '999123457', digit_index: 8 })
		edit(' (999 ) 123 45 -67 ', 17, formats.RU, 'Delete').should.deep.equal({ digits: '999123456', digit_index: 9 })
		edit(' (999 ) 123 45 -67 ', 18, formats.RU, 'Delete').should.deep.equal({ digits: '9991234567', digit_index: 10 })
		edit(' (999 ) 123 45 -67 ', 19, formats.RU, 'Delete').should.deep.equal({ digits: '9991234567', digit_index: 10 })

		// Trunk-prefixed phone number test
		edit('1  ', 0, formats.GB, 'Delete', undefined, { has_trunk_prefix: false }).should.deep.equal({ digits: '', digit_index: 0 })
		edit(' 7700 900756  ', 1, formats.GB, 'Delete', undefined, { has_trunk_prefix: false }).should.deep.equal({ digits: '700900756', digit_index: 0 })
		edit(' 7700 900756  ', 2, formats.GB, 'Delete', undefined, { has_trunk_prefix: false }).should.deep.equal({ digits: '700900756', digit_index: 1 })
		edit(' 7700 900756  ', 3, formats.GB, 'Delete', undefined, { has_trunk_prefix: false }).should.deep.equal({ digits: '770900756', digit_index: 2 })
	})

	it(`should edit inputted phone (backspace)`, function()
	{
		edit('(9  )', 2, formats.RU, 'Backspace').should.deep.equal({ digits: '', digit_index: 0 })

		edit('  999 ) 123 45 -67 ', 0, formats.RU, 'Backspace').should.deep.equal({ digits: '9991234567', digit_index: 0 })
		edit(' (999 ) 123 45 -67 ', 1, formats.RU, 'Backspace').should.deep.equal({ digits: '9991234567', digit_index: 0 })
		edit(' (999 ) 123 45 -67 ', 2, formats.RU, 'Backspace').should.deep.equal({ digits: '9991234567', digit_index: 0 })
		edit(' (999 ) 123 45 -67 ', 3, formats.RU, 'Backspace').should.deep.equal({ digits: '991234567', digit_index: 0 })
		edit(' (999 ) 123 45 -67 ', 4, formats.RU, 'Backspace').should.deep.equal({ digits: '991234567', digit_index: 1 })
		edit(' (999 ) 123 45 -67 ', 5, formats.RU, 'Backspace').should.deep.equal({ digits: '991234567', digit_index: 2 })
		edit(' (999 ) 123 45 -67 ', 6, formats.RU, 'Backspace').should.deep.equal({ digits: '991234567', digit_index: 2 })
		edit(' (999 ) 123 45 -67 ', 7, formats.RU, 'Backspace').should.deep.equal({ digits: '991234567', digit_index: 2 })
		edit(' (999 ) 123 45 -67 ', 8, formats.RU, 'Backspace').should.deep.equal({ digits: '991234567', digit_index: 2 })
		edit(' (999 ) 123 45 -67 ', 9, formats.RU, 'Backspace').should.deep.equal({ digits: '999234567', digit_index: 3 })
		edit(' (999 ) 123 45 -67 ', 10, formats.RU, 'Backspace').should.deep.equal({ digits: '999134567', digit_index: 4 })
		edit(' (999 ) 123 45 -67 ', 11, formats.RU, 'Backspace').should.deep.equal({ digits: '999124567', digit_index: 5 })
		edit(' (999 ) 123 45 -67 ', 12, formats.RU, 'Backspace').should.deep.equal({ digits: '999124567', digit_index: 5 })
		edit(' (999 ) 123 45 -67 ', 13, formats.RU, 'Backspace').should.deep.equal({ digits: '999123567', digit_index: 6 })
		edit(' (999 ) 123 45 -67 ', 14, formats.RU, 'Backspace').should.deep.equal({ digits: '999123467', digit_index: 7 })
		edit(' (999 ) 123 45 -67 ', 15, formats.RU, 'Backspace').should.deep.equal({ digits: '999123467', digit_index: 7 })
		edit(' (999 ) 123 45 -67 ', 16, formats.RU, 'Backspace').should.deep.equal({ digits: '999123467', digit_index: 7 })
		edit(' (999 ) 123 45 -67 ', 17, formats.RU, 'Backspace').should.deep.equal({ digits: '999123457', digit_index: 8 })
		edit(' (999 ) 123 45 -67 ', 18, formats.RU, 'Backspace').should.deep.equal({ digits: '999123456', digit_index: 9 })
		edit(' (999 ) 123 45 -67 ', 19, formats.RU, 'Backspace').should.deep.equal({ digits: '999123456', digit_index: 9 })
	})

	it(`should edit inputted phone (selection)`, function()
	{
		edit('  999 ) 123 45 -67 ', 4, formats.RU, 'Delete', { end: 13 }).should.deep.equal({ digits: '99567', digit_index: 2 })
		edit('  999 ) 123 45 -67 ', 4, formats.RU, 'Backspace', { end: 13 }).should.deep.equal({ digits: '99567', digit_index: 2 })
	})

	it(`should edit inputted phone (symbol)`, function()
	{
		edit(' 999 ) 123 45 -67 ', 2, formats.RU).should.deep.equal({ digits: '9991234567', digit_index: 1 })
		edit(' 999 ) 123 45 -67 ', 3, formats.RU).should.deep.equal({ digits: '9991234567', digit_index: 2 })
		edit(' 999 ) 123 45 -67 ', 4, formats.RU).should.deep.equal({ digits: '9991234567', digit_index: 3 })

		edit(' 999 ) 123 45 -67 ', 8, formats.RU).should.deep.equal({ digits: '9991234567', digit_index: 4 })
		edit(' 999 ) 123 45 -67 ', 9, formats.RU).should.deep.equal({ digits: '9991234567', digit_index: 5 })
		edit(' 999 ) 123 45 -67 ', 10, formats.RU).should.deep.equal({ digits: '9991234567', digit_index: 6 })

		edit(' 999 ) 123 45 -67 ', 12, formats.RU).should.deep.equal({ digits: '9991234567', digit_index: 7 })
		edit(' 999 ) 123 45 -67 ', 13, formats.RU).should.deep.equal({ digits: '9991234567', digit_index: 8 })

		edit(' 999 ) 123 45 -67 ', 16, formats.RU).should.deep.equal({ digits: '9991234567', digit_index: 9 })
		edit(' 999 ) 123 45 -67 ', 17, formats.RU).should.deep.equal({ digits: '9991234567', digit_index: 10 })

		// Test for phone number overflow
		edit(' 999 ) 123 45 -67 890', 20, formats.RU).should.deep.equal({ digits: '9991234567', digit_index: 10 })

		// Trunk-prefixed phone number test
		edit(' 1 ', 2, formats.GB, undefined, undefined, { has_trunk_prefix: false }).should.deep.equal({ digits: '1', digit_index: 1 })
		edit(' 7700 ', 5, formats.GB, undefined, undefined, { has_trunk_prefix: false }).should.deep.equal({ digits: '7700', digit_index: 4 })
		edit(' 77009 ', 6, formats.GB, undefined, undefined, { has_trunk_prefix: false }).should.deep.equal({ digits: '77009', digit_index: 5 })
	})
})