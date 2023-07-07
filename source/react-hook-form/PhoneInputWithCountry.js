import React from 'react'
import PropTypes from 'prop-types'

import ReactHookFormInput from './ReactHookFormInput.js'
import PhoneInputWithCountry_ from '../PhoneInputWithCountryDefault.js'

import { metadata as metadataType } from '../PropTypes.js'

export function createPhoneInput(defaultMetadata) {
  let PhoneInputWithCountry = ({
    metadata = defaultMetadata,
    ...rest
  }, ref) => {
    return (
      <ReactHookFormInput
        {...rest}
        ref={ref}
        metadata={metadata}
        Component={PhoneInputWithCountry_}
      />
    )
  }

  PhoneInputWithCountry = React.forwardRef(PhoneInputWithCountry)

  PhoneInputWithCountry.propTypes = {
    metadata: metadataType.isRequired
  }

  return PhoneInputWithCountry
}

export default createPhoneInput()