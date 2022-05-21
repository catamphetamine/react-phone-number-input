'use strict'

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