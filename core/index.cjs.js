'use strict'

// This file is deprecated.
// It's the same as `index.cjs`, just with an added `.js` file extension.
// It only exists for compatibility with the software that doesn't like `*.cjs` file extension.
// https://gitlab.com/catamphetamine/libphonenumber-js/-/issues/61#note_950728292

exports = module.exports = require('../commonjs/PhoneInputWithCountry.js').default

exports.formatPhoneNumber = require('../commonjs/libphonenumber/formatPhoneNumber.js').default
exports.formatPhoneNumberIntl = require('../commonjs/libphonenumber/formatPhoneNumber.js').formatPhoneNumberIntl

exports.parsePhoneNumber = require('libphonenumber-js/core').default
exports.isValidPhoneNumber = require('libphonenumber-js/core').isValidPhoneNumber
exports.isPossiblePhoneNumber = require('libphonenumber-js/core').isPossiblePhoneNumber
exports.getCountries = require('libphonenumber-js/core').getCountries
exports.getCountryCallingCode = require('libphonenumber-js/core').getCountryCallingCode
exports.isSupportedCountry = require('libphonenumber-js/core').isSupportedCountry

exports['default'] = require('../commonjs/PhoneInputWithCountry.js').default