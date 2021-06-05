import metadata from 'libphonenumber-js/metadata.min.json'

import { createPhoneInput } from '../modules/react-hook-form/PhoneInputWithCountry'

export default createPhoneInput(metadata)