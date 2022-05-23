'use strict'

// This file is deprecated.
// It's the same as `index.cjs`, just with an added `.js` file extension.
// It only exists for compatibility with the software that doesn't like `*.cjs` file extension.
// https://gitlab.com/catamphetamine/libphonenumber-js/-/issues/61#note_950728292

var metadata = require('libphonenumber-js/mobile/metadata')
var core = require('../core/index.cjs')
var createInput = require('../commonjs/PhoneInputBrowser.js').createInput

function call(func, _arguments) {
	var args = Array.prototype.slice.call(_arguments)
	args.push(metadata)
	return func.apply(this, args)
}

var PhoneInput = createInput(metadata)

exports = module.exports = PhoneInput

exports.parsePhoneNumber = function parsePhoneNumber() {
	return call(core.parsePhoneNumber, arguments)
}

exports.formatPhoneNumber = function formatPhoneNumber() {
	return call(core.formatPhoneNumber, arguments)
}

exports.formatPhoneNumberIntl = function formatPhoneNumberIntl() {
	return call(core.formatPhoneNumberIntl, arguments)
}

exports.isValidPhoneNumber = function isValidPhoneNumber() {
	return call(core.isValidPhoneNumber, arguments)
}

exports.isPossiblePhoneNumber = function isPossiblePhoneNumber() {
	return call(core.isPossiblePhoneNumber, arguments)
}

exports.getCountries = function getCountries() {
	return call(core.getCountries, arguments)
}

exports.getCountryCallingCode = function getCountryCallingCode() {
	return call(core.getCountryCallingCode, arguments)
}

exports.isSupportedCountry = function isSupportedCountry() {
	return call(core.isSupportedCountry, arguments)
}

exports['default'] = PhoneInput