import { customFetch } from "../config/http"

export interface ResetPasswordBody {
  token?: string | null
  password: string
  confirmPassword: string
}

export const resetPassword = async (resetBody: ResetPasswordBody) => {
  return customFetch<string>('auth/reset-password', {
    method: 'POST',
    body: JSON.stringify(resetBody)
  })
}
