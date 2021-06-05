import React, { useRef, useCallback } from 'react'
import { Controller } from 'react-hook-form'
import PropTypes from 'prop-types'

let ReactHookFormInput = ({
  Component,
  name,
  defaultValue,
  control,
  rules,
  onChange: onChange_,
  onBlur: onBlur_,
  ...rest
}, ref) => {
  const internalRef = useRef()
  const setRef = useCallback((instance) => {
    internalRef.current = instance
    if (ref) {
      if (typeof ref === 'function') {
        ref(instance)
      } else {
        ref.current = instance
      }
    }
  }, [ref])
  const onFocus = useCallback(() => {
    // internalRef.current.disabled = false
    internalRef.current.focus()
  }, [])
  // `feact-hook-form` doesn't know how to properly handle `undefined` values.
  // https://github.com/react-hook-form/react-hook-form/issues/2990
  defaultValue = defaultValue === undefined ? null : defaultValue
  const renderInputComponent = ({
    ref,
    onChange,
    onBlur,
    // `restReactHookFormControlledFieldProps` contain properties like `name` and `value`.
    // https://github.com/react-hook-form/react-hook-form/blob/b0e6c3057ac12a7b12d5616aecf3791acb7d7204/src/types/controller.ts#L21-L30
    ...restReactHookFormControlledFieldProps
  }) => {
    const setComponentRef = useCallback((instance) => {
      setRef(instance)
      if (ref) {
        if (typeof ref === 'function') {
          ref(instance)
        } else {
          ref.current = instance
        }
      }
    }, [ref, setRef])
    const onChangeCombined = useCallback((value) => {
      onChange(value)
      if (onChange_) {
        onChange_(value)
      }
    }, [
      onChange,
      onChange_
    ])
    const onBlurCombined = useCallback((event) => {
      onBlur(event)
      if (onBlur_) {
        onBlur_(event)
      }
    }, [
      onBlur,
      onBlur_
    ])
    return (
      <Component
        {...rest}
        {...restReactHookFormControlledFieldProps}
        ref={setComponentRef}
        onChange={onChangeCombined}
        onBlur={onBlurCombined}/>
    )
  }
  return (
    <Controller
      control={control}
      name={name}
      defaultValue={defaultValue}
      rules={rules}
      onFocus={onFocus}
      render={(props) => {
        // Differentiate between `react-hook-form@6` and `react-hook-form@7`.
        // https://react-hook-form.com/migrate-v6-to-v7/
        // https://gitlab.com/catamphetamine/react-phone-number-input/-/issues/57
        // `props` (before v7) and `props.fields` (in v7) contain properties like:
        // `ref`, `name`, `value`, `onChange`, `onBlur`.
        // https://github.com/react-hook-form/react-hook-form/blob/b0e6c3057ac12a7b12d5616aecf3791acb7d7204/src/types/controller.ts#L21-L30
        return renderInputComponent(props.field || props)
      }}/>
  )
}

ReactHookFormInput = React.forwardRef(ReactHookFormInput)

ReactHookFormInput.propTypes = {
  Component: PropTypes.elementType.isRequired,
  name: PropTypes.string.isRequired,
  defaultValue: PropTypes.string,
  control: PropTypes.object.isRequired,
  rules: PropTypes.object.isRequired,
  onChange: PropTypes.func,
  onBlur: PropTypes.func
}

export default ReactHookFormInput