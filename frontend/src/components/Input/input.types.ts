import type { InputHTMLAttributes } from "react"

export interface CustomInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
}
