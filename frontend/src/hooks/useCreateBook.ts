import { useMutation } from "@tanstack/react-query"
import { createBook } from "../services/createBook"

export const useCreateBook = () => {
  return useMutation({
    mutationFn: createBook,
    onMutate: (data: unknown) => {
      console.log('On Mutate', { data })
    },
    onSuccess: (data: unknown) => {
      console.log('On success', { data })
    },
    onError: (data: unknown) => {
      console.log('On error', { data })
    }
  })
}
