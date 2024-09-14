import { RouteObject } from "react-router-dom";
import RootLayout from "@/layouts/RootLayout";
import HomePage from "./Home";
import SigninPage from "./auth/Signin";
import SignupPage from "./auth/Signup";

export const routes: RouteObject[] = [
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        path: "",
        element: <HomePage />,
      },
    ],
  },
  {
    path: "/signin",
    element: <SigninPage />,
  },
  {
    path: "/signup",
    element: <SignupPage />,
  },
];
