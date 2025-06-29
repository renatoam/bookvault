import { customFetch } from "../config/http"
import type { Book } from "../types/book"

export const getBook = async (id?: string) => {
  return customFetch<Book>(`books/${id}`)
}
