import { createBrowserRouter } from 'react-router';
import AdminLayout from '../layout/AdminLayout';
import MainLayout from '../layout/MainLayout';
import RegisterPage from '../pages/RegisterPage';
import LoginPage from '../pages/LoginPage';
import HomePage from '../pages/HomePage';
import AboutPage from '../pages/AboutPage';
import ContactPage from '../pages/ContactPage';
import AddProductPage from '../pages/AddProductPage';
import EditProductPage from '../pages/EditProductPage';
import CartPage from '../pages/CartPage';
import AdminSetupPage from '../pages/AdminSetupPage';
import AdminDashboard from '../pages/AdminDashboard';
import ProtectedRoute from '../components/ProtectedRoute';

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "about",
        element: <AboutPage />
      },
      {
        path: "contact",
        element: <ContactPage />
      },
      {
        path: "add",
        element: (
          <ProtectedRoute requiredRole="admin">
            <AddProductPage />
          </ProtectedRoute>
        )
      },
      {
        path: "edit/:id",
        element: (
          <ProtectedRoute requiredRole="admin">
            <EditProductPage />
          </ProtectedRoute>
        )
      },
      {
        path: "cart",
        element: (
          <ProtectedRoute requiredRole="client">
            <CartPage />
          </ProtectedRoute>
        )
      },
      {
        path: "admin-setup",
        element: (
          <ProtectedRoute requiredRole="admin">
            <AdminSetupPage />
          </ProtectedRoute>
        )
      },
      {
        path: "admin-dashboard",
        element: (
          <ProtectedRoute requiredRole="admin">
            <AdminDashboard />
          </ProtectedRoute>
        )
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
