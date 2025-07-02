import { forwardRef, type LegacyRef } from "react"
import type { CustomInputProps } from "./input.types"

export default forwardRef(function CustomInput(
  props: Readonly<CustomInputProps>,
  ref: LegacyRef<HTMLInputElement> | undefined
) {
  const { id, label, error, ...rest } = props
  return (
    <>
      <label htmlFor={id} className="label">{label}</label>
      <input {...rest} id={id} ref={ref} className={`input w-full ${error ? 'input-error' : ''}`} />
      {error && <span className="label text-error">{error}</span>}
    </>
  )
})
