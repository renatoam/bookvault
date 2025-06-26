import { customFetch } from "../config/http"

export interface Book {
  title: string
  author?: string
  status?: 'WISHLIST' | 'READING' | 'FINISHED'
  description?: string
}

export const createBook = async (book: Book) => {
  const response = await customFetch('http://localhost:4000/v1/books/new', {
    method: 'POST',
    body: JSON.stringify(book),
  })

  return response
}
