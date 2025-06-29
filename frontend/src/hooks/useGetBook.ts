import { useQuery } from "@tanstack/react-query"
import { getBook } from "../services/getBook"

export const useGetBook = (id?: string) => {
  return useQuery({
    queryKey: ['book', id],
    queryFn: () => getBook(id),
    enabled: !!id
  })
}
