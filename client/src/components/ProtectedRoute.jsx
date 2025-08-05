import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router';

export default function ProtectedRoute({ children, requiredRole }) {
  const { user, userRole, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#cad2c5] to-[#84a98c] flex items-center justify-center">
        <p className="text-[#354f52] text-lg">Loading...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth/login" replace />;
  }

  if (requiredRole && userRole !== requiredRole) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#cad2c5] to-[#84a98c] flex items-center justify-center px-6">
        <div className="bg-[#f9fdfb] rounded-lg shadow-md p-8 text-center border border-[#cad2c5] max-w-md">
          <h2 className="text-2xl font-bold text-[#354f52] mb-4">Access Denied</h2>
          <p className="text-[#52796f] mb-4">
            You don't have permission to access this page. This page requires {requiredRole} role.
          </p>
          <p className="text-sm text-[#8a8f8c] mb-4">
            Your current role: {userRole || 'None'}
          </p>
          <button
            onClick={() => window.history.back()}
            className="bg-[#354f52] hover:bg-[#2f3e46] text-white font-semibold px-4 py-2 rounded transition"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return children;
}
