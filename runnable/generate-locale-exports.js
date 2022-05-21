import fs from 'fs'
import path from 'path'

addLocaleExports(getAllLocales())

/**
 * Returns a list of all locales supported by `relative-time-format`.
 * @return {string[]}
 */
function getAllLocales() {
	const LOCALE_FILE_NAME_REG_EXP = /([^\/]+)\.json$/
	return fs.readdirSync(path.join('./locale/'))
		.filter(_ => fs.statSync(path.join('./locale', _)).isFile() && LOCALE_FILE_NAME_REG_EXP.test(_))
		.map(_ => _.match(LOCALE_FILE_NAME_REG_EXP)[1])
}

// Add `export` entries in `package.json`.
function addLocaleExports(ALL_LOCALES) {
	// Read `package.json` file.
	const packageJson = readJsonFromFile('./package.json')

	// Remove all locale exports.
	for (const path of Object.keys(packageJson.exports)) {
		if (path.startsWith('./locale/')) {
			delete packageJson.exports[path]
		}
	}

	// Re-add all locale exports.
	packageJson.exports = {
		...packageJson.exports,
		...ALL_LOCALES.reduce((all, locale) => {
			all[`./locale/${locale}`] = `./locale/${locale}.json`
			all[`./locale/${locale}.json`] = `./locale/${locale}.json`
			return all
		}, {})
	}

	// Save `package.json` file.
	fs.writeFileSync('./package.json', JSON.stringify(packageJson, null, 2) + '\n', 'utf8')
}

function readJsonFromFile(path) {
	return JSON.parse(fs.readFileSync(path, 'utf8'))
}
