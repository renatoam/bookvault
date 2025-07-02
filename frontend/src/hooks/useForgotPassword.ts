import { useMutation } from "@tanstack/react-query"
import { forgotPassword } from "../services/forgotPassword"
import { useNotification } from "./useNotification"

export const useForgotPassword = () => {
  const { notify } = useNotification()

  return useMutation({
    mutationKey: ['forgot'],
    mutationFn: forgotPassword,
    onSuccess: (message: string | null) => {
      notify({
        message: message ?? 'Instructions sent via email',
        status: 'success'
      })
    },
    onError: (error: string) => {
      const index = error
        .split('')
        .findIndex((ch) => ch === ':') + 1
      const message = error
        .slice(index, error.length)
        .trim()
      
      notify({
        message,
        status: 'error'
      })
    }
  })
}
