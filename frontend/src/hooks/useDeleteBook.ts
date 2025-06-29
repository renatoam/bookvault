import { useMutation } from "@tanstack/react-query"
import { deleteBook } from "../services/deleteBook"
import { useNotification } from "./useNotification"
import type { Filter } from "../services/findBooks"
import { queryClient } from "../config/tanstack"

export const useDeleteBook = (filter: Filter) => {
  const { notify } = useNotification()
  return useMutation({
    mutationKey: ['deleteBook'],
    mutationFn: (id?: string) => deleteBook(id),
    onMutate: (data: unknown) => {
      console.log('On Mutate', { data })
    },
    onSuccess: () => {
      notify({
        message: 'Book successfully deleted.',
        status: 'success'
      })

      queryClient.invalidateQueries({ queryKey: ['books', filter] })
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
      queryClient.invalidateQueries({ queryKey: ['books', filter] })
    }
  })
}
