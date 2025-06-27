import { customFetch } from "../config/http"
import type { Books } from "../types/book"

export const findBooks = async (): Promise<{ data: Books }> => {
  const response = await customFetch<{ data: Books }>('books')
  return response
}
