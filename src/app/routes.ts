import { createBrowserRouter } from 'react-router';
import { Layout } from './components/layout/Layout';
import SignIn from './pages/SignIn';
import Dashboard from './pages/Dashboard';
import UserList from './pages/UserList';
import UserDetails from './pages/UserDetails';
import PlaceList from './pages/PlaceList';
import AddPlace from './pages/AddPlace';
import EditPlace from './pages/EditPlace';
import Reviews from './pages/Reviews';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: SignIn,
  },
  {
    path: '/signin',
    Component: SignIn,
  },
  {
    Component: Layout,
    children: [
      { path: '/dashboard', Component: Dashboard },
      { path: '/users', Component: UserList },
      { path: '/users/:id', Component: UserDetails },
      { path: '/places', Component: PlaceList },
      { path: '/places/add', Component: AddPlace },
      { path: '/places/edit/:id', Component: EditPlace },
      { path: '/reviews', Component: Reviews },
      { path: '/analytics', Component: Analytics },
      { path: '/settings', Component: Settings },
    ],
  },
]);