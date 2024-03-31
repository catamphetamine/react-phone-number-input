import { useRef, useCallback } from 'react'

/**
 * This hook creates an internal copy of a `ref`
 * and returns a new `ref`-alike setter function
 * that updates both `ref` and the internal copy of it.
 * That `ref`-alike setter function could then be passed
 * to child elements instead of the original `ref`.
 *
 * The internal copy of the `ref` can then be used to
 * call instance methods like `.focus()`, etc.
 *
 * One may ask: why create a copy of `ref` for "internal" use
 * when the code could use the original `ref` for that.
 * The answer is: the code would have to dance around the original `ref` anyway
 * to figure out whether it exists and to find out the internal implementation of it
 * in order to read its value correctly. This hook encapsulates all that "boilerplate" code.
 * The returned copy of the `ref` is guaranteed to exist and functions as a proper ref "object".
 * The returned `ref`-alike setter function must be used instead of the original `ref`
 * when passing it to child elements.
 *
 * @param  {(object|function)} [externalRef] — The original `ref` that may have any internal implementation and might not even exist.
 * @return {any[]} Returns an array of two elements: a copy of the `ref` for "internal" use and a `ref`-alike setter function that should be used in-place of the original `ref` when passing it to child elements.
 */
export default function useExternalRef(externalRef) {
  // Create a copy of the original `ref` (which might not exist).
  // Both refs will point to the same value.
  const refCopy = useRef()

  // Updates both `ref`s with the same `value`.
  const refSetter = useCallback((value) => {
    setRefsValue([externalRef, refCopy], value)
  }, [
    externalRef,
    refCopy
  ])

  return [refCopy, refSetter]
}

// Sets the same `value` of all `ref`s.
// Some of the `ref`s may not exist in which case they'll be skipped.
export function setRefsValue(refs, value) {
  for (const ref of refs) {
    if (ref) {
      setRefValue(ref, value)
    }
  }
}

// Sets the value of a `ref`.
// Before React Hooks were introduced, `ref`s used to be functions.
// After React Hooks were introduces, `ref`s became objects with `.current` property.
// This function sets a `ref`'s value regardless of its internal implementation,
// so it supports both types of `ref`s.
function setRefValue(ref, value) {
  if (typeof ref === 'function') {
    ref(value)
  } else {
    ref.current = value
  }
}