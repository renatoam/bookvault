import type { Request } from "express"
import type {
  AuthorDto,
  GetAuthorsDto,
  GetAuthorDto,
  AutocompleteAuthorsDto
} from "./authors.dto"

export type GetAuthorsRequest = Request<unknown, unknown, unknown, GetAuthorsDto>
export type GetAuthorRequest = Request<GetAuthorDto, unknown, unknown, unknown>
export type AutocompleteAuthorsRequest = Request<unknown, unknown, unknown, AutocompleteAuthorsDto>

export interface GetAuthorsResponse {
  content: AuthorDto[]
  page: number
  resultsPerPage: number
  totalResults: number
}

export interface AutocompleteAuthorsResponse {
  suggestions: string[]
} 