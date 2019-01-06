'use strict'

var metadata = require('libphonenumber-js/metadata.min.json')
var createPhoneInput = require('../commonjs/PhoneInputReactResponsiveUIDefaults').createPhoneInput

var Input = createPhoneInput(metadata)

exports = module.exports = Input
exports['default']       = Input