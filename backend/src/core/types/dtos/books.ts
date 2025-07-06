import type { Book } from "@prisma/client"
import type { Status } from "../../../config/http/httpTypes"

export interface GetBooksDto {
  q?: string
  author?: string
  status?: string
  page?: number
  limit?: number
  sort?: string
}

export interface CreateBookDto {
  title: string
  author: string
  status: Status
  description: string
}

export interface GetBookDto {
  id: string
}

export interface UpdateBookRequestDto {
  id: string
  title: string
  author: string
  status: Status
  description: string
}

export interface GetBooksResponse {
  content: Book[]
  page: number
  resultsPerPage: number
  totalResults: number
}
