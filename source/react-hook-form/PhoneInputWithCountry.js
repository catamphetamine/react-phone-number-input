import React from 'react'
import PropTypes from 'prop-types'

import ReactHookFormInput from './ReactHookFormInput.js'
import PhoneInputWithCountry_ from '../PhoneInputWithCountryDefault.js'

import { metadata as metadataType } from '../PropTypes.js'

export function createPhoneInput(defaultMetadata) {
  let PhoneInputWithCountry = (props, ref) => {
    return (
      <ReactHookFormInput
        {...props}
        ref={ref}
        Component={PhoneInputWithCountry_}/>
    )
  }

  PhoneInputWithCountry = React.forwardRef(PhoneInputWithCountry)

  PhoneInputWithCountry.propTypes = {
    metadata: metadataType.isRequired
  }

  PhoneInputWithCountry.defaultProps = {
    metadata: defaultMetadata
  }

  return PhoneInputWithCountry
}

export default createPhoneInput()