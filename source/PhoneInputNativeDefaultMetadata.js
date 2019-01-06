// Deprecated.
// This is a file used in legacy `/index.js` export entry.
// In some next major version this file will be removed
// and `/index.js` will be redirected to `/min/index.js`.

import metadata from 'libphonenumber-js/metadata.min.json'
import { createPhoneInput } from './PhoneInputNativeDefaults'

export default createPhoneInput(metadata)