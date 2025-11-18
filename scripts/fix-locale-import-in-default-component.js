// Replaces `import en from '../locale/en.json.js'`
// with `import en from '../locale/en.json'`
// in a CommonJS version of the built modules
// Because CommonJS can import JSON files directly
// and stupid Node.js "ES Module" system can't.

import fs from 'fs'

fs.writeFileSync(
	'./commonjs/PhoneInputWithCountryDefault.js',
	fs.readFileSync('./commonjs/PhoneInputWithCountryDefault.js', 'utf8').replace('/locale/en.json.js', '/locale/en.json'),
	'utf8'
)

fs.writeFileSync(
	'./commonjs/PhoneInputWithCountryDefault.js.map',
	fs.readFileSync('./commonjs/PhoneInputWithCountryDefault.js.map', 'utf8').replace('/locale/en.json.js', '/locale/en.json'),
	'utf8'
)