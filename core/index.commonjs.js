'use strict'

exports = module.exports = require('../commonjs/PhoneInput').default

exports.formatPhoneNumber = require('../commonjs/formatPhoneNumber').default
exports.formatPhoneNumberIntl = require('../commonjs/formatPhoneNumber').formatPhoneNumberIntl
exports.isValidPhoneNumber = require('../commonjs/isValidPhoneNumber').default

exports['default'] = require('../commonjs/PhoneInput').default