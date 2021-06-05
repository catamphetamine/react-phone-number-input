'use strict'

var metadata = require('libphonenumber-js/metadata.min.json')
var createPhoneInput = require('../commonjs/react-hook-form/PhoneInput').createPhoneInput

var PhoneInput = createPhoneInput(metadata)

exports = module.exports = PhoneInput

exports['default'] = PhoneInput