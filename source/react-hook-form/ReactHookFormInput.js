import React, { useRef, useCallback, useImperativeHandle } from 'react'
import { Controller } from 'react-hook-form'
import PropTypes from 'prop-types'

let ReactHookFormInput = ({
  Component,
  name,
  defaultValue,
  shouldUnregister,
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
    // Setting `ref` passed by `react-hook-form` results in a bug:
    // when an initial value is defined (example: "+78005553535")
    // it seems to be set directly on the `ref`d `<input/>`
    // by `react-hook-form` and the result is a non-formatted
    // "+78005553535" initial value in the `<input/>`.
    //
    // To work around that bug, a fake `ref` is assigned,
    // so that it could only `.focus()` it and no more.
    //
    // `useImperativeHandle()` hook seems to allow `ref` being `undefined`.
    //
    // if (ref) {
      useImperativeHandle(ref, () => ({
        focus() {
          internalRef.current.focus()
        }
      }))
    // }

    const setComponentRef = useCallback((instance) => {
      setRef(instance)
      // if (ref) {
      //   if (typeof ref === 'function') {
      //     ref(instance)
      //   } else {
      //     ref.current = instance
      //   }
      // }
    }, [ref, setRef])

    const onChangeCombined = useCallback((value) => {
      // `feact-hook-form` doesn't know how to properly handle `undefined` values.
      // https://github.com/react-hook-form/react-hook-form/issues/2990
      if (value === undefined) {
        value = null
      }
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

  // `react-hook-form@7` no longer accepts `onFocus` property.
  // Since this component can be used with both `v6` and `v7`,
  // the `onFocus` property is left here.
  const onFocus = useCallback(() => {
    // internalRef.current.disabled = false
    internalRef.current.focus()
  }, [])

  return (
    <Controller
      control={control}
      name={name}
      defaultValue={defaultValue}
      shouldUnregister={shouldUnregister}
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
  // A quote from `react-hook-form`:
  // Without `shouldUnregister: true`, an input value would be retained when input is removed.
  // Setting `shouldUnregister: true` makes the form behave more closer to native.
  shouldUnregister: PropTypes.bool,
  control: PropTypes.object.isRequired,
  rules: PropTypes.object,
  onChange: PropTypes.func,
  onBlur: PropTypes.func
}

export default ReactHookFormInput