import { useQuery } from "@tanstack/react-query"
import { findBooks } from "../services/findBooks"
import type { Books } from "../types/book"

export const useFindBooks = () => {
  return useQuery<Books>({
    queryKey: ['books'],
    queryFn: async () => {
      const response = await findBooks()
      return response.data
    },
    refetchOnWindowFocus: false,
    retry: 3,
  })
}
