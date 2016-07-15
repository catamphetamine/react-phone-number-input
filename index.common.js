'use strict'

var Input = require('./build/input') // ['default']

exports = module.exports = Input

exports.phone_number_format = require('./build/phone').formats
exports.phoneNumberFormat   = require('./build/phone').formats

exports.is_valid_phone_number = require('./build/phone').validate
exports.isValidPhoneNumber    = require('./build/phone').validate

exports.format_phone_number = require('./build/phone').format
exports.formatPhoneNumber   = require('./build/phone').format

exports.format_phone_number_international = require('./build/phone').format_international
exports.formatPhoneNumberInternational    = require('./build/phone').format_international

exports['default'] = Input