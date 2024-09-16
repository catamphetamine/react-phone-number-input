import { useCallback } from 'react'

// Returns a custom `onKeyDown` handler that works around a Backspace keypress edge case:
// * `<PhoneInputWithCountrySelect international countryCallingCodeEditable={false}/>`
// * When placing the caret before the leading plus character and pressing Backspace,
//   it duplicates the country calling code in the `<input/>`.
// https://github.com/catamphetamine/react-phone-number-input/issues/442
export default function useInputKeyDownHandler({
	onKeyDown,
	inputFormat
}) {
	return useCallback((event) => {
		// Usability:
		// Don't allow the user to erase a leading "+" character when "international" input mode is forced.
		// That indicates to the user that they can't possibly enter the phone number in a non-international format.
		if (event.keyCode === BACKSPACE_KEY_CODE && inputFormat === 'INTERNATIONAL') {
			// It checks `event.target` here for being an `<input/>` element
			// because "keydown" events may bubble from arbitrary child elements
			// so there's no guarantee that `event.target` represents an `<input/>` element.
			// Also, since `inputComponent` is not neceesarily an `<input/>`, this check is required too.
			if (event.target instanceof HTMLInputElement) {
				if (getCaretPosition(event.target) === LEADING_PLUS.length) {
					event.preventDefault()
					return
				}
			}
		}
		if (onKeyDown) {
			onKeyDown(event)
		}
	}, [
		onKeyDown,
		inputFormat
	])
}

// Gets the caret position in an `<input/>` field.
// The caret position starts with `0` which means "before the first character".
function getCaretPosition(element) {
	return element.selectionStart
}

const BACKSPACE_KEY_CODE = 8

const LEADING_PLUS = '+'