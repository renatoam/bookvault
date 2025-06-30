import type { SelectHTMLAttributes } from "react"

export interface CustomSelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string
  error?: string
  defaultValue?: string
  options: {
    value: string
    label: string
  }[]
}
