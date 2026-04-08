import { createBrowserRouter, redirect } from "react-router";
import { Layout } from "./components/layout/Layout";
import Dashboard from "./pages/Dashboard";
import PlaceList from "./pages/PlaceList";
import Reviews from "./pages/Reviews";
import Settings from "./pages/Settings";
import SignIn from "./pages/SignIn";
import UserList from "./pages/UserList";

export const router = createBrowserRouter([
  { path: "/", Component: SignIn },
  { path: "/signin", Component: SignIn },
  {
    Component: Layout,
    children: [
      { path: "/dashboard", Component: Dashboard },
      { path: "/users", Component: UserList },
      { path: "/places", Component: PlaceList },
      { path: "/reviews", Component: Reviews },
      { path: "/settings", Component: Settings },
      { path: "*", loader: () => redirect("/dashboard") },
    ],
  },
]);
