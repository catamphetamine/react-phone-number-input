'use strict'

exports = module.exports = require('../commonjs/PhoneInputWithCountry').default

exports.formatPhoneNumber = require('../commonjs/libphonenumber/formatPhoneNumber').default
exports.formatPhoneNumberIntl = require('../commonjs/libphonenumber/formatPhoneNumber').formatPhoneNumberIntl
exports.isValidPhoneNumber = require('../commonjs/libphonenumber/isValidPhoneNumber').default
exports.isPossiblePhoneNumber = require('../commonjs/libphonenumber/isPossiblePhoneNumber').default

exports.parsePhoneNumber = require('libphonenumber-js/core').parsePhoneNumberFromString
exports.getCountries = require('libphonenumber-js/core').getCountries
exports.getCountryCallingCode = require('libphonenumber-js/core').getCountryCallingCode

exports['default'] = require('../commonjs/PhoneInputWithCountry').default