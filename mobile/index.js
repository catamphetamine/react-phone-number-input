import metadata from 'libphonenumber-js/metadata.mobile.json'

import {
	formatPhoneNumber as _formatPhoneNumber,
	formatPhoneNumberIntl as _formatPhoneNumberIntl,
	isValidPhoneNumber as _isValidPhoneNumber
} from '../core/index'

import { createPhoneInput } from '../modules/PhoneInputNativeDefaults'

function call(func, _arguments) {
	var args = Array.prototype.slice.call(_arguments)
	args.push(metadata)
	return func.apply(this, args)
}

export default createPhoneInput(metadata)

export function formatPhoneNumber() {
	return call(_formatPhoneNumber, arguments)
}

export function formatPhoneNumberIntl() {
	return call(_formatPhoneNumberIntl, arguments)
}

export function isValidPhoneNumber() {
	return call(_isValidPhoneNumber, arguments)
}