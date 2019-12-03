'use strict'

exports = module.exports = require('../commonjs/PhoneInput').default

exports.parseRFC3966 = require('../commonjs/libphonenumber/RFC3966').parseRFC3966
exports.formatRFC3966 = require('../commonjs/libphonenumber/RFC3966').formatRFC3966
exports.parsePhoneNumber = require('../commonjs/libphonenumber/parsePhoneNumber').default
exports.formatPhoneNumber = require('../commonjs/libphonenumber/formatPhoneNumber').default
exports.formatPhoneNumberIntl = require('../commonjs/libphonenumber/formatPhoneNumber').formatPhoneNumberIntl
exports.isValidPhoneNumber = require('../commonjs/libphonenumber/isValidPhoneNumber').default
exports.isPossiblePhoneNumber = require('../commonjs/libphonenumber/isPossiblePhoneNumber').default
exports.getCountries = require('../commonjs/libphonenumber/getCountries').default
exports.getCountryCallingCode = require('libphonenumber-js/core').getCountryCallingCode

exports['default'] = require('../commonjs/PhoneInput').default