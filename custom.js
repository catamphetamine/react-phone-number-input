'use strict'

// Deprecated export, use the `.default` export instead.
exports = module.exports = require('./commonjs/Input').default

exports.BasicInput = require('./commonjs/BasicInput').default

exports['default'] = require('./commonjs/Input').default