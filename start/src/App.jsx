import './App.css';
import { RouterProvider } from "react-router";
import router from './routes/router';
import { AuthProvider } from './context/AuthContext';

export default function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}