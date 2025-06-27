import { type Request, type Response, type NextFunction } from "express"

export interface Search {
  q: string // by title and author
  author: string
  status: Status
  page: number
  limit: number
  sort: string // field:order (asc, desc)
  orderBy: {
    field: string
    order: string
  }
}

export type SearchRequest = Request<unknown, unknown, unknown, Partial<Search>>

export type Status = 'WISHLIST' | 'READING' | 'FINISHED'

export interface Book {
  id: string
  title: string
  author: string
  status: Status
  description?: string
}

export type CreateBookRequest = Request<unknown, unknown, Book, unknown>
