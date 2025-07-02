import type { ButtonHTMLAttributes } from "react";

export interface CustomButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean
}
