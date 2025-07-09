export type Status = 'WISHLIST' | 'READING' | 'FINISHED'

export interface BookDto {
  id?: string
  title: string
  author: string
  status: Status
  description: string
}

export interface GetBooksDto {
  q?: string
  author?: string
  status?: string
  page?: number
  limit?: number
  sort?: string
}

export type CreateBookDto = Omit<BookDto, 'id'>

export interface GetBookDto {
  id: string
}

export type UpdateBookDto = Required<BookDto>
