var Input = require('../commonjs/PhoneInput').default

exports = module.exports = Input
exports['default']       = Input

exports.formatPhoneNumber = require('../commonjs/libphonenumber/formatPhoneNumber').default
exports.formatPhoneNumberIntl = require('../commonjs/libphonenumber/formatPhoneNumber').formatPhoneNumberIntl
exports.isValidPhoneNumber = require('../commonjs/libphonenumber/isValidPhoneNumber').default
exports.isPossiblePhoneNumber = require('../commonjs/libphonenumber/isPossiblePhoneNumber').default

exports.getCountries = require('libphonenumber-js/core').getCountries
exports.getCountryCallingCode = require('libphonenumber-js/core').getCountryCallingCode
exports.parsePhoneNumber = require('libphonenumber-js/core').parsePhoneNumberFromString