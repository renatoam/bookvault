import { forwardRef, type LegacyRef } from "react";
import type { CustomFormProps } from "./form.types";

const CustomForm = forwardRef((
  props: Readonly<CustomFormProps>,
  ref: LegacyRef<HTMLFormElement> | undefined
) => {
  const { legend, children, disabled, ...rest } = props
  return (
    <form
      className="space-y-4 m-auto w-lg"
      ref={ref}
      {...rest}
    >
      <fieldset className="fieldset border-base-300 rounded-box border p-4" disabled={disabled}>
        <legend className="fieldset-legend">{legend}</legend>
        {children}
      </fieldset>
    </form>
  )
})

export default CustomForm
