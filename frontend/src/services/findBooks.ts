import { customFetch } from "../config/http"
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

export const findBooks = async (filter: Filter): Promise<Books | null> => {
  let params = ''

  if (filter) {
    params = Object.entries(filter)
      .filter(([, value]) => value !== undefined && value !== null)
      .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`)
      .join('&')
  }

  return customFetch<Books>(`books?${params}`)
}
