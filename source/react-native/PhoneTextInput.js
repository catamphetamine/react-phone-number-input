import React, { useCallback } from 'react'
import PropTypes from 'prop-types'
import { TextInput } from 'react-native'

/**
 * This is an _experimental_ React Native component.
 * Feedback thread: https://github.com/catamphetamine/react-phone-number-input/issues/296
 */
function PhoneTextInput({
  autoComplete,
  onChange,
  ...rest
}, ref) {
  // Instead of `onChangeText` it could use `onChange` and get `value` from `nativeEvent.text`.
  const onChangeText = useCallback((value) => {
    onChange({
      preventDefault() { this.defaultPrevented = true },
      target: { value }
    })
  }, [onChange])
  // React Native `<TextInput/>` supports properties:
  // * `placeholder: string?`
  // * `autoFocus: boolean?`
  // * `value: string?`
  // plus the ones mentioned below:
  return (
    <TextInput
      ref={ref}
      keyboardType="phone-pad"
      autoCompleteType={autoComplete}
      onChangeText={onChangeText}
      {...rest}/>
  )
}

PhoneTextInput = React.forwardRef(PhoneTextInput)

PhoneTextInput.propTypes = {
  autoComplete: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired
}

export default PhoneTextInput