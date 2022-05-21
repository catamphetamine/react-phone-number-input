import metadata from 'libphonenumber-js/metadata.min.json'

import { createPhoneInput } from '../modules/react-hook-form/PhoneInputWithCountry.js'

export default createPhoneInput(metadata)