'use strict'

var metadata = require('libphonenumber-js/metadata.min.json')
var createInput = require('../commonjs/InputSmart').createInput

var Input = createInput(metadata)

exports = module.exports = Input
exports['default']       = Input