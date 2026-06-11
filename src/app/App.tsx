import { RouterProvider } from 'react-router';
import { router } from './routes';
import { NotificationProvider } from './utils/NotificationContext';
import { ThemeProvider } from './utils/ThemeContext';

export default function App() {
  return (
    <ThemeProvider>
      <NotificationProvider>
        <RouterProvider router={router} />
      </NotificationProvider>
    </ThemeProvider>
  );
}
