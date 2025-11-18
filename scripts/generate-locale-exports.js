import fs from 'fs'
import path from 'path'

// Stupid Node.js can't even `import` JSON files.
// https://stackoverflow.com/questions/72348042/typeerror-err-unknown-file-extension-unknown-file-extension-json-for-node
// Using a `*.json.js` duplicate file workaround.
createLocaleJsonJsFiles(getAllLocales())

createLocaleJsonTypeScriptDefinitionFiles(getAllLocales())

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
			all[`./locale/${locale}`] = {
      		types:  `./locale/${locale}.json.d.ts`,
				import: `./locale/${locale}.json.js`,
				require: `./locale/${locale}.json`
			}
			all[`./locale/${locale}.json`] = {
      		types:  `./locale/${locale}.json.d.ts`,
				import: `./locale/${locale}.json.js`,
				require: `./locale/${locale}.json`
			}
			return all
		}, {})
	}

	// Save `package.json` file.
	fs.writeFileSync('./package.json', JSON.stringify(packageJson, null, 2) + '\n', 'utf8')
}

function readJsonFromFile(path) {
	return JSON.parse(fs.readFileSync(path, 'utf8'))
}

// Stupid Node.js can't even `import` JSON files.
// https://stackoverflow.com/questions/72348042/typeerror-err-unknown-file-extension-unknown-file-extension-json-for-node
// Using a `*.json.js` duplicate file workaround.
function createLocaleJsonJsFiles(locales) {
	for (const locale of locales) {
		const localeData = readJsonFromFile(`./locale/${locale}.json`)
		fs.writeFileSync(`./locale/${locale}.json.js`, 'export default ' + JSON.stringify(localeData, null, 2), 'utf8')
	}
}

function createLocaleJsonTypeScriptDefinitionFiles(locales) {
	for (const locale of locales) {
		fs.writeFileSync(
			`./locale/${locale}.json.d.ts`,
			`
import { LabelKey } from '../index'
type Locale = { [key in LabelKey]: string }
declare const Locale: Locale
export default Locale
			`.trim()
		)
	}
}