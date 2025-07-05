import { type Request } from "express"

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

export interface UpsertBookParams {
  id?: string
}

export type UpsertBookRequest = Request<UpsertBookParams, unknown, Book, unknown>

interface SignUpBody {
  email: string
  name?: string
  password: string
  confirmPassword: string
}

export type SignUpRequest = Request<unknown, unknown, SignUpBody, unknown>

interface SignInBody {
  email: string
  password: string
}

export type SignInRequest = Request<unknown, unknown, SignInBody, unknown>

interface ResetPasswordBody {
  token: string
  password: string
  confirmPassword: string
}

export type ResetPasswordRequest = Request<unknown, unknown, ResetPasswordBody, unknown>
