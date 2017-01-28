'use strict'

var metadata = require('libphonenumber-js/metadata.min')

var create_input = require('./custom').default

var parse           = require('./custom').parse_phone_number
var format          = require('./custom').format_phone_number
var is_valid_number = require('./custom').is_valid_phone_number

var Input = create_input(metadata)

exports = module.exports = Input

var context = { metadata: metadata }

exports.parse_phone_number = parse.bind(context)
exports.parsePhoneNumber   = exports.parse_phone_number

exports.format_phone_number = format.bind(context)
exports.formatPhoneNumber   = exports.format_phone_number

exports.is_valid_phone_number = is_valid_number.bind(context)
exports.isValidPhoneNumber    = exports.is_valid_phone_number

module.exports['default'] = Input