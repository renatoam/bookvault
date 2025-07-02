import { customFetch } from "../config/http"

export interface SignUpBody {
  email: string
  name?: string
  password: string
  confirmPassword: string
}

export interface SignUpResponse {
  user: {
      id: string;
      name: string;
      email: string;
  };
  auth: {
      accessToken: string;
      expiresIn: number;
  };
}

export const signUp = async (signupBody: SignUpBody) => {
  return customFetch<SignUpResponse>('auth/signup', {
    method: 'POST',
    body: JSON.stringify(signupBody)
  })
}
