import { type Request } from "express"

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
