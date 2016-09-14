'use strict'

var Input = require('./build/input') // ['default']

exports = module.exports = Input

exports.phone_number_format = require('./build/formats')
exports.phoneNumberFormat   = require('./build/formats')

exports.is_valid_phone_number = require('./build/phone').validate
exports.isValidPhoneNumber    = require('./build/phone').validate

exports.format_phone_number = require('./build/phone').format
exports.formatPhoneNumber   = require('./build/phone').format

exports.plaintext_local = require('./build/phone').plaintext_local
exports.plaintextLocal  = require('./build/phone').plaintext_local

exports.plaintext_international = require('./build/phone').plaintext_international
exports.plaintextInternational  = require('./build/phone').plaintext_international

exports.parse_phone_number = require('./build/phone').parse_plaintext_international
exports.parsePhoneNumber   = require('./build/phone').parse_plaintext_international

exports.country = require('./build/country')['default']

exports.country_codes = require('./build/country').country_codes

exports.country_from_locale = require('./build/country').country_from_locale
exports.countryFromLocale   = require('./build/country').country_from_locale

exports['default'] = Input
