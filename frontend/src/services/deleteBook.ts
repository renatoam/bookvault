import { customFetch } from "../config/http"
import type { Book } from "../types/book"

export const deleteBook = async (id?: string) => {
  return customFetch<Book>(`books/${id}`, {
    method: 'DELETE'
  })
}
