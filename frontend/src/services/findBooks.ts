import { customFetch } from "../config/http"
import type { Books } from "../types/book"

export const findBooks = async (params: string): Promise<Books | null> => {
  return customFetch<Books>(`books?${params}`)
}
