export interface Book {
  id?: string
  title: string
  author: string
  status: 'WISHLIST' | 'READING' | 'FINISHED'
  description: string
}

export type Books = Required<Book>[]
