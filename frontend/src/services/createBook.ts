import { customFetch } from "../config/http"
import type { Book } from "../types/book"

export const createBook = async (book: Book) => {
  const response = await customFetch('books/new', {
    method: 'POST',
    body: JSON.stringify(book),
  })

  return response
}
