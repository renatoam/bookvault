import { customFetch } from "../config/http"

export interface SignInBody {
  email: string
  password: string
}

export interface SignInResponse {
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

export const signIn = async (signinBody: SignInBody) => {
  return customFetch<SignInResponse>('auth/signin', {
    method: 'POST',
    body: JSON.stringify(signinBody)
  })
}
