import React from 'react'
import PhoneTextInput from './PhoneTextInput'
import PhoneInput from '../PhoneInput'

/**
 * This is an _experimental_ React Native component.
 * Feedback thread: https://github.com/catamphetamine/react-phone-number-input/issues/296
 */
function ReactNativePhoneInput(props, ref) {
  return (
    <PhoneInput
      {...props}
      ref={ref}
      smartCaret={false}
      inputComponent={PhoneTextInput} />
  )
}

ReactNativePhoneInput = React.forwardRef(ReactNativePhoneInput)

export default ReactNativePhoneInput