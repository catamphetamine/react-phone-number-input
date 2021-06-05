'use strict'

exports = module.exports = require('../commonjs/PhoneInputWithCountry').default

exports.formatPhoneNumber = require('../commonjs/libphonenumber/formatPhoneNumber').default
exports.formatPhoneNumberIntl = require('../commonjs/libphonenumber/formatPhoneNumber').formatPhoneNumberIntl

exports.isValidPhoneNumber = require('libphonenumber-js/core').isValidPhoneNumber
exports.isPossiblePhoneNumber = require('libphonenumber-js/core').isPossiblePhoneNumber
exports.parsePhoneNumber = require('libphonenumber-js/core').parsePhoneNumberFromString
exports.getCountries = require('libphonenumber-js/core').getCountries
exports.getCountryCallingCode = require('libphonenumber-js/core').getCountryCallingCode
exports.isSupportedCountry = require('libphonenumber-js/core').isSupportedCountry

exports['default'] = require('../commonjs/PhoneInputWithCountry').default