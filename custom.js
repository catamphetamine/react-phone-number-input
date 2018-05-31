'use strict'

exports = module.exports = require('./commonjs/PhoneInputReactResponsiveUI').default

exports.PhoneInputNative = require('./commonjs/PhoneInputNative').default

exports.PhoneInput = require('./commonjs/PhoneInput').default
exports.formatPhoneNumber = require('./commonjs/formatPhoneNumber').default
exports.parsePhoneNumberCharacter = require('./commonjs/parsePhoneNumberCharacters').parsePhoneNumberCharacter
exports.parsePhoneNumberCharacters = require('./commonjs/parsePhoneNumberCharacters').default

exports.InputBasic = require('./commonjs/InputBasic').default
exports.InputSmart = require('./commonjs/InputSmart').default

exports.InternationalIcon = require('./commonjs/InternationalIcon').default

exports['default'] = require('./commonjs/PhoneInputReactResponsiveUI').default