import { type FormHTMLAttributes } from "react"

export interface CustomFormProps extends FormHTMLAttributes<HTMLFormElement> {
  legend?: string
  disabled?: boolean
}
