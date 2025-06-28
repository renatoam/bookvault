import { useQuery } from "@tanstack/react-query"
import { findBooks, type Filter } from "../services/findBooks"
import type { Books } from "../types/book"

export const useFindBooks = (filter: Filter) => {
  return useQuery<Books>({
    queryKey: ['books', filter],
    queryFn: async () => findBooks(filter),
    refetchOnWindowFocus: false,
    retry: 3,
  })
}
