import { useMutation } from "@tanstack/react-query"
import { useNavigate } from "react-router"
import { signOut } from "../services/signout"
import { useNotification } from "./useNotification"

export const useSignOut = () => {
  const { notify } = useNotification()
  const navigate = useNavigate()

  return useMutation({
    mutationKey: ['signout'],
    mutationFn: signOut,
    onSuccess: () => {
      const token = localStorage.getItem('token')

      if (token) {
        localStorage.removeItem('token')
      }

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

      const token = localStorage.getItem('token')

      if (token) {
        localStorage.removeItem('token')
      }

      navigate('/signin', { replace: true })
    }
  })
}
