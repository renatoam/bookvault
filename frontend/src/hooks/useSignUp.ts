import { useMutation } from "@tanstack/react-query"
import { signUp, type SignUpResponse } from "../services/signup"
import { useNotification } from "./useNotification"
import { useNavigate } from "react-router"

export const useSignUp = () => {
  const { notify } = useNotification()
  const navigate = useNavigate()

  return useMutation({
    mutationKey: ['signup'],
    mutationFn: signUp,
    onMutate: (data: unknown) => {
      console.log('On Mutate', { data })
    },
    onSuccess: (data: SignUpResponse | null) => {
      notify({
        message: 'User successfully registered.',
        status: 'success'
      })

      if (!data) {
        return navigate('/signin', { replace: true })
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
