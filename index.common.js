'use strict'

var React = require('react')
var metadata = require('libphonenumber-js/metadata.min.json')

var Input = require('./custom').default

var Phone = function Phone(props)
{
   var properties = Object.keys(props).reduce(function(reduced, property)
   {
   	reduced[property] = props[property]
   	return reduced
   },
   { metadata: metadata })

	return React.createElement(Input, properties)
}

exports = module.exports = Phone

var custom = require('libphonenumber-js/custom')

exports.parse_phone_number = function parse()
{
	var parameters = Array.prototype.slice.call(arguments)
	parameters.push(metadata)
	return custom.parse.apply(this, parameters)
}

exports.format_phone_number = function format()
{
	var parameters = Array.prototype.slice.call(arguments)
	parameters.push(metadata)
	return custom.format.apply(this, parameters)
}

exports.is_valid_phone_number = function is_valid_number()
{
	var parameters = Array.prototype.slice.call(arguments)
	parameters.push(metadata)
	return custom.isValidNumber.apply(this, parameters)
}

// camelCase aliases
exports.parsePhoneNumber   = exports.parse_phone_number
exports.formatPhoneNumber  = exports.format_phone_number
exports.isValidPhoneNumber = exports.is_valid_phone_number

module.exports['default'] = Phone
