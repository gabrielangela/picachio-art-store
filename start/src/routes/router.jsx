import {
  createBrowserRouter,
} from "react-router";

import AdminLayout from '../layout/AdminLayout';
import MainLayout from '../layout/MainLayout';
import RegisterPage from '../pages/RegisterPage';
import LoginPage from '../pages/LoginPage';
import HomePage from '../pages/HomePage';

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      }
    ]
  },
  {
    path: "/auth",
    element: <AdminLayout />,
    children: [
      {
        path: "login",
        element: <LoginPage />
      },
      {
        path: "register",
        element: <RegisterPage />
      },
    ],
  },
]);

export default router;