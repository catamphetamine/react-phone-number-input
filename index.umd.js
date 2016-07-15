'use strict'

var Input = require('./build/input') // ['default']

exports = module.exports = Input

exports.formats = require('./build/phone').formats

exports['default'] = Input