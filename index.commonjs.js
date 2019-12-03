'use strict'

exports = module.exports = require('./commonjs/PhoneInputNativeDefaultMetadata').default

exports.parseRFC3966 = require('./commonjs/libphonenumber/RFC3966').parseRFC3966
exports.formatRFC3966 = require('./commonjs/libphonenumber/RFC3966').formatRFC3966
exports.parsePhoneNumber = require('./commonjs/libphonenumber/parsePhoneNumberDefaultMetadata').default
exports.formatPhoneNumber = require('./commonjs/libphonenumber/formatPhoneNumberDefaultMetadata').default
exports.formatPhoneNumberIntl = require('./commonjs/libphonenumber/formatPhoneNumberDefaultMetadata').formatPhoneNumberIntl
exports.isValidPhoneNumber = require('./commonjs/libphonenumber/isValidPhoneNumberDefaultMetadata').default
exports.isPossiblePhoneNumber = require('./commonjs/libphonenumber/isPossiblePhoneNumberDefaultMetadata').default
exports.getCountries = require('./commonjs/libphonenumber/getCountriesDefaultMetadata').default
exports.getCountryCallingCode = require('libphonenumber-js/min').getCountryCallingCode

exports['default'] = require('./commonjs/PhoneInputNativeDefaultMetadata').default