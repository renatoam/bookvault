import type { Request } from "express"
import type {
  BookDto,
  CreateBookDto,
  GetBookDto,
  GetBooksDto,
  UpdateBookDto
} from "./books.dto"

export type GetBooksRequest = Request<unknown, unknown, unknown, GetBooksDto>
export type GetBookRequest = Request<GetBookDto, unknown, unknown, unknown>
export type CreateBookRequest = Request<unknown, unknown, CreateBookDto, unknown>
export type UpsertBookRequest = Request<GetBookDto, unknown, UpdateBookDto, unknown>

export interface GetBooksResponse {
  content: BookDto[]
  page: number
  resultsPerPage: number
  totalResults: number
}
