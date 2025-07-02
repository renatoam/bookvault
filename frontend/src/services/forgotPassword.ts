import { customFetch } from "../config/http"

export interface ForgotPasswordBody {
  email: string
}

export const forgotPassword = async (forgotPasswordBody: ForgotPasswordBody) => {
  return customFetch<string>('auth/forgot-password', {
    method: 'POST',
    body: JSON.stringify(forgotPasswordBody)
  })
}
