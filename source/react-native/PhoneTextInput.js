import React, { useCallback } from 'react'
import PropTypes from 'prop-types'
import { TextInput } from 'react-native'

/**
 * This is an _experimental_ React Native component.
 * Feedback thread: https://github.com/catamphetamine/react-phone-number-input/issues/296
 */
function PhoneTextInput({
  TextInputComponent,
  onChange,
  ...rest
}, ref) {
  // Instead of `onChangeText(value: string)` it could use
  // `onChange(nativeEvent: Event)` and get `value` from `nativeEvent.text`.
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
    <TextInputComponent
      ref={ref}
      keyboardType="phone-pad"
      onChangeText={onChangeText}
      {...rest}/>
  )
}

PhoneTextInput = React.forwardRef(PhoneTextInput)

PhoneTextInput.propTypes = {
  /**
   * The input field `value: string`.
   */
  value: PropTypes.string,

  /**
   * A function of `event: Event`.
   * Updates the `value: string` property.
   */
  onChange: PropTypes.func.isRequired,

  /**
   * The standard `autoCompleteType` property of a React Native `<TextInput/>`.
   */
  autoCompleteType: PropTypes.string,

  /**
   * The input field component.
   */
  TextInputComponent: PropTypes.elementType.isRequired
}

PhoneTextInput.defaultProps = {
  /**
   * Shows phone number suggestion(s) when the user focuses the input field.
   */
  autoCompleteType: 'tel',

  /**
   * By default, uses the default React Native `TextInput` component.
   */
  TextInputComponent: TextInput
}

export default PhoneTextInput
