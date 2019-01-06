'use strict'

// Deprecated.
// Use `/core` sub-package instead.

console.warn('Importing from "react-phone-number-input/custom" is deprecated. Import from "react-phone-number-input/core" instead.')

exports = module.exports = require('./commonjs/PhoneInput').default

exports['default'] = require('./commonjs/PhoneInput').default