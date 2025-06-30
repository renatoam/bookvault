import type { CustomInputProps } from "./input.types"

export default function CustomInput(props: Readonly<CustomInputProps>) {
  const { id, label, error, ...rest } = props
  return (
    <>
      <label htmlFor={id} className="label">{label}</label>
      <input {...rest} />
      {error && <span className="label text-error">{error}</span>}
    </>
  )
}
