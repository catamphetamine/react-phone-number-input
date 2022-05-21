// Creates a `package.json` file in the CommonJS build folder.
// That marks that whole folder as CommonJS so that Node.js doesn't complain
// about `require()`-ing those files.

import fs from 'fs'

fs.writeFileSync('./commonjs/package.json', JSON.stringify({
	name: 'react-phone-number-input/commonjs',
	type: 'commonjs',
	private: true
}, null, 2), 'utf8')