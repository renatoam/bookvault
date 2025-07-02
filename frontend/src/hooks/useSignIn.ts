import { useMutation } from "@tanstack/react-query"
import { useNotification } from "./useNotification"
import { useNavigate } from "react-router"
import { signIn, type SignInResponse } from "../services/signin"

export const useSignIn = () => {
  const { notify } = useNotification()
  const navigate = useNavigate()

  return useMutation({
    mutationKey: ['signin'],
    mutationFn: signIn,
    onMutate: (data: unknown) => {
      console.log('On Mutate', { data })
    },
    onSuccess: (data: SignInResponse | null) => {
      notify({
        message: 'User successfully logged in.',
        status: 'success'
      })

      if (!data) {
        return notify({
          message: 'Something went wrong. Try again in a few minutes.',
          status: 'error'
        })
      }

      localStorage.setItem('token', data.auth.accessToken)
      navigate('/books', { replace: true })
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
