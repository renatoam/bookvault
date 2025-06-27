import { customFetch } from "../config/http"
import type { Books } from "../types/book"

export const findBooks = async (): Promise<Books> => {
  return customFetch<Books>('books')
}
