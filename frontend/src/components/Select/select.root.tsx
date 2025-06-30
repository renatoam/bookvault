import type { CustomSelectProps } from "./select.types";

export default function CustomSelect(props: Readonly<CustomSelectProps>) {
  const { label, id, error, defaultValue = "Default", options, ...rest } = props
  return (
    <>
      <label htmlFor={id} className="label">{label}</label>
      <select {...rest}>
        <option disabled={true}>{defaultValue}</option>
        {options.map(option => (
          <option key={option.value} value={option.value}>{option.label}</option>
        ))}
      </select>
      {error && <span className="label text-error">{error}</span>}
    </>
  )
}
