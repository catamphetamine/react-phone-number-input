import React from 'react'

import ReactHookFormInput from './ReactHookFormInput.js'
import PhoneInput_ from '../PhoneInputBrowser.js'

import { metadata as metadataType } from '../PropTypes.js'

export function createPhoneInput(defaultMetadata) {
  let PhoneInput = (props, ref) => {
    return (
      <ReactHookFormInput
        {...props}
        ref={ref}
        Component={PhoneInput_}/>
    )
  }

  PhoneInput = React.forwardRef(PhoneInput)

  PhoneInput.propTypes = {
    metadata: metadataType.isRequired
  }

  PhoneInput.defaultProps = {
    metadata: defaultMetadata
  }

  return PhoneInput
}

export default createPhoneInput()