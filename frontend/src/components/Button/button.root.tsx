import { Loader } from "lucide-react";
import type { CustomButtonProps } from "./button.types";

export default function CustomButton(props: Readonly<CustomButtonProps>) {
  const { isLoading = false, children, ...rest } = props
  return (
    <button {...rest}>
      {isLoading ? <Loader className="animate-spin" /> : children}
    </button>
  )
}
