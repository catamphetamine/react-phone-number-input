'use strict'

exports = module.exports = require('./build/input').default

exports.parse_phone_number = require('libphonenumber-js/custom').parse
exports.parsePhoneNumber   = exports.parse_phone_number

exports.format_phone_number = require('libphonenumber-js/custom').format
exports.formatPhoneNumber   = exports.format_phone_number

exports.is_valid_phone_number = require('libphonenumber-js/custom').is_valid_number
exports.isValidPhoneNumber    = exports.is_valid_phone_number

module.exports['default'] = require('./build/input').default