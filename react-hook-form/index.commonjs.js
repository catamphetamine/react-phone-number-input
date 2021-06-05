'use strict'

var metadata = require('libphonenumber-js/metadata.min.json')
var createPhoneInput = require('../commonjs/react-hook-form/PhoneInputWithCountry').createPhoneInput

var PhoneInputWithCountry = createPhoneInput(metadata)

exports = module.exports = PhoneInputWithCountry

exports['default'] = PhoneInputWithCountry