'use strict'

// Deprecated export, use the `.default` export instead.
exports = module.exports = require('./commonjs/InputWithDefaultMetadata').default

// Deprecated export, use `smartCaret={false}` instead of `inputComponent={BasicInput}`.
exports.BasicInput = require('./commonjs/BasicInput').default

exports['default'] = require('./commonjs/InputWithDefaultMetadata').default