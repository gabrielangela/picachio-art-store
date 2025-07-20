import { useAuth } from '../context/AuthContext';

export default function ContactPage() {
  const { user, loading } = useAuth();

  if (loading) return <p>Loading...</p>;

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded shadow text-center">
      <h1 className="text-2xl font-bold text-rose-600 mb-4">Contact Us</h1>
      <p className="text-gray-700 mb-2">Need help? We'd love to hear from you.</p>
      <p className="text-gray-600">Logged in as: {user?.email || 'Guest'}</p>
    </div>
  );
}