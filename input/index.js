import metadata from 'libphonenumber-js/metadata.min.json'

import { createInput } from '../modules/PhoneInputNoCountrySelect'

export default createInput(metadata)