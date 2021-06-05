import React from 'react'

import ReactHookFormInput from './ReactHookFormInput'
import PhoneInput_ from '../PhoneInput'

import { metadata as metadataType } from '../PropTypes'

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