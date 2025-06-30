import toast from "react-hot-toast"
import type { NotifyProps } from "../components/Alert/alert.root"
import { Alert } from "../components"

export const useNotification = () => {
  const notify = (props: NotifyProps) => {
    return toast.custom(
      <Alert
        status={props.status}
        message={props.message}
      />
    )
  }

  return {
    notify
  }
}
