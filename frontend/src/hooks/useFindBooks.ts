import { useQuery } from "@tanstack/react-query"
import { findBooks } from "../services/findBooks"
import type { Books } from "../types/book"

export const useFindBooks = () => {
  return useQuery<Books>({
    queryKey: ['books'],
    queryFn: async () => findBooks(),
    refetchOnWindowFocus: false,
    retry: 3,
  })
}
