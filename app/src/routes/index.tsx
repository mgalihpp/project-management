import { RouteObject } from "react-router-dom";
import RootLayout from "@/layouts/RootLayout";
import HomePage from "./Home";
import SigninPage from "./auth/Signin";
import SignupPage from "./auth/Signup";
import TimelinePage from "./Timeline";
import SettingsPage from "./Settings";
import UsersPage from "./Users";
import TeamsPage from "./Teams";
import PriorityPage from "./Priority";

export const routes: RouteObject[] = [
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        path: "",
        element: <HomePage />,
      },
      {
        path: "timeline",
        element: <TimelinePage />,
      },
      {
        path: "settings",
        element: <SettingsPage />,
      },
      {
        path: "users",
        element: <UsersPage />,
      },
      {
        path: "teams",
        element: <TeamsPage />,
      },
      {
        path: "priority/:priority",
        element: <PriorityPage />,
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
