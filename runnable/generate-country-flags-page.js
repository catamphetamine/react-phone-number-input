import path from 'path'
import fs from 'fs'
import { getCountries } from '..'
import labels from '../locale/en.json'

let html = '<html><title>Flags</title><body>'

html += `
	<style>
		body {
			margin: 0;
			font-family: sans-serif;
		}

		.Countries {
			display: flex;
			flex-wrap: wrap;
		}

		.Country {
			flex: 0 0 10%;
			flex-direction: column;
			align-items: center;
			padding: 1em;
			box-sizing: border-box;
			overflow: hidden;
		}

		.CountryFlagContainer {
			position: relative;
			width: 100%;
			padding-bottom: calc(100% * 2 / 3);
		}

		.CountryFlag {
			position: absolute;
			width: 100%;
			height: 100%;
			box-shadow: 0 0 0 1px black;
		}

		.Country h1 {
			text-align: center;
			font-weight: normal;
			overflow: hidden;
			text-overflow: ellipsis;
		}
	</style>
`

html += '<div class="Countries">'

for (const country of getCountries()) {
	html += `
		<section class="Country">
			<div class="CountryFlagContainer">
				<img class="CountryFlag" src="./${country.toLowerCase()}.svg"/>
			</div>
			<h1><strong>${country}.</strong> ${labels[country]}</h1>
		</section>
	`
}

html += '</div>'

html += '</body></html>'

fs.writeFileSync(path.join(__dirname, '../flags/3x2/index.html'), html)