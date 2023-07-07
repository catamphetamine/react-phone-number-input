import React from 'react'

import ReactHookFormInput from './ReactHookFormInput.js'
import PhoneInput_ from '../PhoneInputBrowser.js'

import { metadata as metadataType } from '../PropTypes.js'

export function createPhoneInput(defaultMetadata) {
  let PhoneInput = ({
    metadata = defaultMetadata,
    ...rest
  }, ref) => {
    return (
      <ReactHookFormInput
        {...rest}
        ref={ref}
        metadata={metadata}
        Component={PhoneInput_}
      />
    )
  }

  PhoneInput = React.forwardRef(PhoneInput)

  PhoneInput.propTypes = {
    metadata: metadataType
  }

  return PhoneInput
}

export default createPhoneInput()