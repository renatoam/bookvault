import { useMutation } from "@tanstack/react-query"
import { createBook } from "../services/createBook"
import { useNotification } from "./useNotification"

export const useCreateBook = () => {
  const { notify } = useNotification()
  return useMutation({
    mutationFn: createBook,
    onMutate: (data: unknown) => {
      console.log('On Mutate', { data })
    },
    onSuccess: (data: unknown) => {
      notify({
        message: 'Book successfully created.',
        status: 'success'
      })

      console.info({ data })
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
