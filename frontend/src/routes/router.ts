import { createBrowserRouter } from "react-router";
import App from "../App";
import { Home, Books, Book, SignUp, Forgot, Signin } from "../pages";
import PrivateRoot from "../pages/privateRoot";
import ResetPassword from "../pages/reset";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: App,
    children: [
      {
        index: true,
        Component: Home,
      },
      {
        Component: PrivateRoot,
        children: [
          {
            path: "books",
            children: [
              {
                index: true,
                Component: Books,
              },
              {
                path: ":id",
                Component: Book,
              },
              {
                path: "new",
                Component: Book,
              },
            ]
          },
          {
            path: "profile",
            Component: Book,
          },
          {
            path: "docs",
            Component: Book,
          },
        ]
      }
    ],
  },
  {
    path: "signup",
    Component: SignUp,
  },
  {
    path: "signin",
    Component: Signin,
  },
  {
    path: "forgot-password",
    Component: Forgot,
  },
  {
    path: "reset-password",
    Component: ResetPassword,
  },
]);
