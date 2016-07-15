'use strict'

var Input = require('./build/input') // ['default']

exports = module.exports = Input

exports.format  = require('./build/phone').formats
exports.isValid = require('./build/phone').validate

exports['default'] = Input