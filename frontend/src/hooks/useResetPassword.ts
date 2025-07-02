import { useMutation } from "@tanstack/react-query"
import { useNotification } from "./useNotification"
import { useNavigate } from "react-router"
import { resetPassword } from "../services/resetPassword"

export const useResetPassword = () => {
  const { notify } = useNotification()
  const navigate = useNavigate()

  return useMutation({
    mutationKey: ['reset'],
    mutationFn: resetPassword,
    onSuccess: (message: string | null) => {
      notify({
        message: message ?? 'Password successfully changed.',
        status: 'success'
      })

      navigate('/signin', { replace: true })
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

      console.log('On error', { error })
    }
  })
}
