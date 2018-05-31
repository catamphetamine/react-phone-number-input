'use strict'

exports = module.exports = require('./commonjs/PhoneInputReactResponsiveUI').default

exports.PhoneInputNative = require('./commonjs/PhoneInputNative').default

exports.PhoneInput = require('./commonjs/PhoneInput').default
exports.formatPhoneNumber = require('./commonjs/formatPhoneNumber').default
exports.parsePhoneNumberCharacter = require('./commonjs/parsePhoneNumberCharacters').parsePhoneNumberCharacter
exports.parsePhoneNumberCharacters = require('./commonjs/parsePhoneNumberCharacters').default

exports['default'] = require('./commonjs/PhoneInputReactResponsiveUI').default