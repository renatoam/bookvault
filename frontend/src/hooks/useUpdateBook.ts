import { useMutation } from "@tanstack/react-query"
import { useNotification } from "./useNotification"
import { updateBook } from "../services/updateBook"

export const useUpdateBook = () => {
  const { notify } = useNotification()
  return useMutation({
    mutationKey: ['updateBook'],
    mutationFn: updateBook,
    onMutate: (data: unknown) => {
      console.log('On Mutate', { data })
    },
    onSuccess: (data: unknown) => {
      notify({
        message: 'Book successfully updated.',
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
