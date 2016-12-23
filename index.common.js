'use strict'

var Input = require('./build/input') // ['default']

exports = module.exports = Input

exports.is_valid_phone_number = require('libphonenumber-js').is_valid_number
exports.isValidPhoneNumber    = require('libphonenumber-js').is_valid_number

exports.parsePhoneNumber   = require('libphonenumber-js').parse
exports.parse_phone_number = require('libphonenumber-js').parse

exports.formatPhoneNumber   = require('libphonenumber-js').format
exports.format_phone_number = require('libphonenumber-js').format

exports['default'] = Input