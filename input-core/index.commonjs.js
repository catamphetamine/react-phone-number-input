var Input = require('../commonjs/PhoneInputNoCountrySelect').default

exports = module.exports = Input
exports['default']       = Input

exports.parseRFC3966 = require('../commonjs/libphonenumber/RFC3966').parseRFC3966
exports.formatRFC3966 = require('../commonjs/libphonenumber/RFC3966').formatRFC3966
exports.parsePhoneNumber = require('../commonjs/libphonenumber/parsePhoneNumber').default
exports.formatPhoneNumber = require('../commonjs/libphonenumber/formatPhoneNumber').default
exports.formatPhoneNumberIntl = require('../commonjs/libphonenumber/formatPhoneNumber').formatPhoneNumberIntl
exports.isValidPhoneNumber = require('../commonjs/libphonenumber/isValidPhoneNumber').default
exports.isPossiblePhoneNumber = require('../commonjs/libphonenumber/isPossiblePhoneNumber').default
exports.getCountries = require('../commonjs/libphonenumber/getCountries').default
exports.getCountryCallingCode = require('libphonenumber-js/core').getCountryCallingCode