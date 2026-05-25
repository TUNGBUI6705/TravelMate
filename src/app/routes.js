import { createBrowserRouter, redirect } from "react-router";
import { Layout } from "./components/layout/Layout.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import PlaceList from "./pages/PlaceList.jsx";
import PlaceDetails from "./pages/PlaceDetails.jsx";
import Reviews from "./pages/Reviews.jsx";
import Settings from "./pages/Settings.jsx";
import SignIn from "./pages/SignIn.jsx";
import UserList from "./pages/UserList.jsx";

export const router = createBrowserRouter([
  { path: "/", Component: SignIn },
  { path: "/signin", Component: SignIn },
  {
    Component: Layout,
    children: [
      { path: "/dashboard", Component: Dashboard },
      { path: "/users", Component: UserList },
      { path: "/places", Component: PlaceList },
      { path: "/places/:placeId", Component: PlaceDetails },
      { path: "/reviews", Component: Reviews },
      { path: "/settings", Component: Settings },
      { path: "*", loader: () => redirect("/dashboard") },
    ],
  },
]);
