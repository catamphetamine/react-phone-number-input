'use strict'

// Deprecated export, use the `.default` export instead.
exports = module.exports = require('./commonjs/PhoneInputReactResponsiveUIDefaultMetadata').default

exports.PhoneInputNative = require('./commonjs/PhoneInputNativeDefaultMetadata').default

// Deprecated export, use `smartCaret={false}` instead of `inputComponent={BasicInput}`.
exports.BasicInput = require('./commonjs/BasicInput').default

exports['default'] = require('./commonjs/PhoneInputReactResponsiveUIDefaultMetadata').default