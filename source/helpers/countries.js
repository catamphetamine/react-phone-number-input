import { isSupportedCountry } from 'libphonenumber-js/core'
export { getCountries } from 'libphonenumber-js/core'

/**
 * Sorts country `<select/>` options.
 * Can move some country `<select/>` options
 * to the top of the list, for example.
 * @param  {object[]} countryOptions — Country `<select/>` options.
 * @param  {string[]} [countryOptionsOrder] — Country `<select/>` options order. Example: `["US", "CA", "AU", "|", "..."]`.
 * @return {object[]}
 */
export function sortCountryOptions(options, order) {
	if (!order) {
		return options
	}
	const optionsOnTop = []
	const optionsOnBottom = []
	let appendTo = optionsOnTop
	for (const element of order) {
		if (element === '|') {
			appendTo.push({ divider: true })
		} else if (element === '...' || element === '…') {
			appendTo = optionsOnBottom
		} else {
			let countryCode
			if (element === '🌐') {
				countryCode = undefined
			} else {
				countryCode = element
			}
			// Find the position of the option.
			const index = options.indexOf(options.filter(option => option.value === countryCode)[0])
			// Get the option.
			const option = options[index]
			// Remove the option from its default position.
			options.splice(index, 1)
			// Add the option on top.
			appendTo.push(option)
		}
	}
	return optionsOnTop.concat(options).concat(optionsOnBottom)
}

export function getSupportedCountryOptions(countryOptions, metadata) {
	if (countryOptions) {
		countryOptions = countryOptions.filter((option) => {
			switch (option) {
				case '🌐':
				case '|':
				case '...':
				case '…':
					return true
				default:
					return isCountrySupportedWithError(option, metadata)
			}
		})
		if (countryOptions.length > 0) {
			return countryOptions
		}
	}
}

export function isCountrySupportedWithError(country, metadata) {
	if (isSupportedCountry(country, metadata)) {
		return true
	} else {
		console.error(`Country not found: ${country}`)
		return false
	}
}

export function getSupportedCountries(countries, metadata) {
	if (countries) {
		countries = countries.filter(country => isCountrySupportedWithError(country, metadata))
		if (countries.length === 0) {
			countries = undefined
		}
	}
	return countries
}