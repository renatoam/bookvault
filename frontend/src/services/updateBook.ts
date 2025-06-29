import { customFetch } from "../config/http"
import type { Book } from "../types/book"

export const updateBook = async (book: Required<Book>) => {
  const response = await customFetch(`books/${book.id}`, {
    method: 'PUT',
    body: JSON.stringify(book),
  })

  return response
}
