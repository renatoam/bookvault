import { useQuery } from "@tanstack/react-query"
import { findBooks } from "../services/findBooks"
import type { Books } from "../types/book"

export type Status = 'WISHLIST' | 'READING' | 'FINISHED'

export interface Filter {
  q?: string
  author?: string
  status?: Status
  page?: number
  limit?: number
  sort?: string
}

export const useFindBooks = (filter: Filter) => {
  return useQuery<Books | null>({
    queryKey: ['books', filter],
    queryFn: async () => {
      let params = ''

      if (filter) {
        params = Object.entries(filter)
          .filter(([, value]) => value !== undefined && value !== null)
          .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`)
          .join('&')
      }

      return findBooks(params)
    },
    refetchOnWindowFocus: false,
    retry: 3,
  })
}
