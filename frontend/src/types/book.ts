export interface Book {
  id?: string
  title: string
  author: string
  status: 'WISHLIST' | 'READING' | 'FINISHED'
  description: string
}

export interface Books {
  content: Required<Book>[],
  page: number
  resultsPerPage: number
  totalResults: number
}
