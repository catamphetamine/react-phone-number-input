// Deprecated.
// This is a file used in legacy `/index.js` export entry.
// In some next major version this file will be removed
// and `/index.js` will be redirected to `/min/index.js`.

import React, { Component } from 'react'
import metadata from 'libphonenumber-js/metadata.min.json'

import InputSmart from './InputSmart'

export default class InputSmartDefaultMetadata extends Component
{
	// Proxy `.focus()` method.
	focus = () => this.input.focus()

	storeInputRef = (ref) => this.input = ref

	render()
	{
		return (
			<InputSmart
				{ ...this.props }
				ref={ this.storeInputRef }
				metadata={ metadata }/>
		)
	}
}