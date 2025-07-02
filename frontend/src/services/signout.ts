import { customFetch } from "../config/http"

export const signOut = async () => {
  const token = localStorage.getItem('token')
  return customFetch('auth/signout', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    credentials: 'include'
  })
}
