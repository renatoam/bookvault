import { createBrowserRouter } from "react-router";
import App from "../App";
import { Home, Books, Book, SignUp, Forgot, Signin } from "../pages";

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
    path: "forgot",
    Component: Forgot,
  },
]);
