'use strict'

exports = module.exports = require('./commonjs/PhoneInputReactResponsiveUI').default

exports.PhoneInputNative = require('./commonjs/PhoneInputNative').default

// Deprecated export, use `smartCaret={false}` instead of `inputComponent={BasicInput}`.
exports.BasicInput = require('./commonjs/BasicInput').default

exports['default'] = require('./commonjs/PhoneInputReactResponsiveUI').default