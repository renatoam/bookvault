import { Navigate, Outlet } from "react-router";

export default function PrivateRoot() {
  const token = localStorage.getItem('token') ?? ''

  if (!token) {
    return <Navigate to="/signin" replace />
  }

  const [, payload] = token.split('.');
  const { exp } = JSON.parse(atob(payload));
  const isValid = exp * 1000 > Date.now();

  if (!isValid) {
    return <Navigate to="/signin" replace />
  }

  return <Outlet />
}