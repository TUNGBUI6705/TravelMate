import { createBrowserRouter, redirect } from "react-router";
import { Layout } from "./components/layout/Layout";
import Dashboard from "./pages/Dashboard";
import PlaceDetails from "./pages/PlaceDetails.jsx";
import PlaceList from "./pages/PlaceList";
import Reviews from "./pages/Reviews";
import Settings from "./pages/Settings";
import SignIn from "./pages/SignIn";
import UserList from "./pages/UserList";
import ExpenseList from "./pages/ExpenseList";
import TripList from "./pages/TripList";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { path: "/dashboard", Component: Dashboard },
      { path: "/users", Component: UserList },
      { path: "/places", Component: PlaceList },
      { path: "/places/:placeId", Component: PlaceDetails },
      { path: "/trips", Component: TripList },
      { path: "/expenses", Component: ExpenseList },
      { path: "/reviews", Component: Reviews },
      { path: "/settings", Component: Settings },
      { path: "*", loader: () => redirect("/dashboard") },
    ],
  },
  {
    path: "/signin",
    Component: SignIn,
  }
]);